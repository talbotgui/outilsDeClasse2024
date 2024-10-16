import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularEditorConfig, AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { tap } from 'rxjs';
import { ComposantAffichageCompetenceComponent } from '../../composants/composant-affichagecompetence/composant-affichagecompetence.component';
import { DialogSelectionCompetenceComponent } from '../../composants/dialogue-selectioncompetence/dialog-selectioncompetence.component';
import { AbstractComponent } from '../../directives/abstract.component';
import { Eleve } from '../../model/eleve-model';
import { GroupeSurUnTemps, Journal, Temps } from '../../model/journal-model';
import { ModelUtil } from '../../model/model-utils';
import { HtmlPipe } from '../../pipes/html.pipe';
import { ContexteService } from '../../service/contexte-service';
import { MaClasseService } from '../../service/maclasse-service';
import { DialogDuplicationComponent } from './dialogue-duplication/dialog-duplication.component';

@Component({
    selector: 'route-journal', templateUrl: './route-journal.component.html', styleUrl: './route-journal.component.scss',
    standalone: true, imports: [
        // Angular
        CommonModule, FormsModule,
        // FontAwesome
        FontAwesomeModule,
        // Matérial
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, MatChipsModule, MatSelectModule, MatDatepickerModule, MatDialogModule,
        // Pour l'éditeur WYSIWYG
        HttpClientModule, AngularEditorModule,
        // Pipes
        HtmlPipe,
        // Composant applicatif
        ComposantAffichageCompetenceComponent, DialogSelectionCompetenceComponent
    ]
})
export class RouteJournalComponent extends AbstractComponent implements OnInit {

    public configurationWysiwyg: AngularEditorConfig = {
        "defaultFontSize": "2",
        "height": "auto",
        "minHeight": "250px",
    }

    /** Date du journal saisie dans le filtre. */
    public dateJournal: Date | undefined;
    /** Journal en cours d'édition. */
    public journal: Journal | undefined;
    /** Liste des journaux chargée. */
    public journaux: Journal[] | undefined;

    /** Index du temps en cours d'édition. */
    public tempsEnEdition: number | undefined;
    /** Flag pour les remarques  en cours d'édition. */
    public remarqueEnEdition: boolean = false;
    /** Liste des statuts d'affichage du contenu de chaque temps. */
    public statutsAffichage: boolean[] = [];

    /** Données de référence : liste des heures pour la sélection de l'heure de début et de fin des temps. */
    public tempsDisponibles: string[] = ModelUtil.creerListeHoraires();
    /** Donnees de référence : liste des élèves. */
    public eleves: Eleve[] = []

    /** Constructeur pour injection des dépendances. */
    public constructor(private contexteService: ContexteService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location, private maclasseService: MaClasseService, private dialog: MatDialog) {
        super();
    }

    /** Au chargement du composant */
    public ngOnInit(): void {

        // Récupération du paramètre de date depuis l'URL
        const timeEnParametreUrl = this.activatedRoute.snapshot.queryParams['time'];

        // Initialisation de la date du journal + déclenchement de la sélection du journal
        this.dateJournal = new Date();
        if (timeEnParametreUrl) {
            this.dateJournal.setTime(timeEnParametreUrl);
        }
        this.dateJournal.setHours(0, 0, 0, 0);
        this.onChangementDateJournal();

        // Au chargement des données,
        const sub = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
            tap(donnees => {
                // Copie des données nécessaires
                this.journaux = donnees?.journal;
                this.eleves = donnees?.eleves || [];

                //  déclenchement de la sélection du journal
                this.onChangementDateJournal();
            })
        ).subscribe();
        super.declarerSouscription(sub);
    }

    /** Ajout d'une compétence via le composant dédié dans un dialog. */
    public ajouterCompetence(groupe: GroupeSurUnTemps): void {

        // Ouverture du dialog avec le composant de sélection de compétence
        const dialog = this.dialog.open(DialogSelectionCompetenceComponent, { height: '500px', width: '1000px' });

        // A la fermeture, ajout de la compétence (si sélectionnée)
        dialog.afterClosed().subscribe(competence => {
            if (competence !== undefined) {
                if (!groupe.competences) {
                    groupe.competences = [];
                }
                groupe.competences.push(competence.id);
            }
        });
    }

    /** Ajout d'un nouveau groupe dans le temps pointé avec les élèves non sélectionnés dans les autres groupes du temps. */
    public ajouterGroupe(i: number): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length && this.journal.temps[i]) {
            const idElevesDejaDansDautresGroupes = this.journal.temps[i].groupes.flatMap(g => g.eleves);
            const nouveauGroupe = new GroupeSurUnTemps();
            nouveauGroupe.eleves = this.eleves.map(e => e.id).filter(id => idElevesDejaDansDautresGroupes.indexOf(id) === -1);
            this.journal.temps[i].groupes.push(nouveauGroupe);
        }
    }

    /** Ajout ou retrait d'un élève à un temps */
    public ajouterRetirerEleveAuGroupeDunTemps(t: number, g: number, idEleve: string): void {
        if (!this.journal || !this.journal.temps || t >= this.journal.temps.length) {
            return;
        }
        const temps = this.journal.temps[t];
        if (!temps || !temps.groupes || g >= temps.groupes.length) {
            return;
        }
        const groupe = temps.groupes[g];
        if (!groupe.eleves) {
            groupe.eleves = [];
        }
        const index = groupe.eleves.indexOf(idEleve);
        if (index !== -1) {
            groupe.eleves.splice(index, 1);
        } else {
            groupe.eleves.push(idEleve);
        }
    }

    /** Ajout d'un temps d'un type précis après le temps passé en index */
    public ajouterTempsApres(i: number, type: string): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {

            // Ajout du temps au bon endroit
            const temps = new Temps();
            this.journal.temps.splice(i + 1, 0, temps);
            this.statutsAffichage.splice(i + 1, 0, true);

            // Initialisation des attributs communs à tous les types
            temps.type = type;

            // Initialisation des attributs par type
            if (type === 'classe') {
                // un groupe par défaut
                temps.groupes = [new GroupeSurUnTemps()];

                // Copie de l'heure de fin du temps précédent
                if (i >= 0 && this.journal.temps[i] && this.journal.temps[i].fin) {
                    temps.debut = this.journal.temps[i].fin;
                } else if (i >= 1 && this.journal.temps[i - 1] && this.journal.temps[i - 1].fin) {
                    temps.debut = this.journal.temps[i - 1].fin;
                }

                // Si édition en cours, le nouveau temps passe en édition
                this.tempsEnEdition = i + 1;
            }
        }
    }

    /** Déplacement de la date du journal d'un nombre 'delta' de jours */
    public changerDate(delta: number) {
        if (this.dateJournal) {
            const nouvelleDate = new Date();
            nouvelleDate.setTime(this.dateJournal.getTime() + (delta * 1000 * 3600 * 24));
            nouvelleDate.setHours(0, 0, 0, 0);
            this.dateJournal = nouvelleDate;
            this.onChangementDateJournal();
        }
    }

    /** Création d'un journal pour la date sélectionnée */
    public creerJournal(): void {
        if (this.journaux && this.dateJournal && !this.journal) {

            // création du journal
            this.journal = this.maclasseService.rechercherOuCreerJournal(this.journaux, this.dateJournal);

            // en mode édition par défaut
            this.tempsEnEdition = 0;
            this.remarqueEnEdition = true;
        }
    }

    /** Déplacer un temps dans le journal */
    public descendreTemps(i: number): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {

            // Déplacement du temps
            const temps = this.journal.temps[i];
            this.journal.temps[i] = this.journal.temps[i + 1];
            this.journal.temps[i + 1] = temps;

            // Déplacement du flag d'affichage
            const affichage = this.statutsAffichage[i];
            this.statutsAffichage[i] = this.statutsAffichage[i + 1]
            this.statutsAffichage[i + 1] = affichage;

            // Déplacement du temps en édition
            if (this.tempsEnEdition == i && i < this.journal.temps.length - 1) {
                this.tempsEnEdition = i + 1;
            }
        }
    }

    /** Dupliquer le journal sélectionné ou le temps passé en paramètre à une autre date. */
    public dupliquerJournal(): void {
        const dialog = this.dialog.open(DialogDuplicationComponent, { height: '300px', width: '500px' }).componentInstance;
        dialog.journaux = this.journaux;
        dialog.journal = this.journal;
        dialog.dateCible = this.journal?.date;
    }

    /** Dupliquer le journal sélectionné ou le temps passé en paramètre à une autre date. */
    public dupliquerTemps(indexTemps: number): void {
        if (indexTemps > -1 && this.journal && this.journal.temps && indexTemps < this.journal.temps.length) {
            const dialog = this.dialog.open(DialogDuplicationComponent, { height: '300px', width: '500px' }).componentInstance;
            dialog.journaux = this.journaux;
            dialog.temps = this.journal.temps[indexTemps];
            dialog.dateCible = this.journal?.date;
        }
    }

    /** Passer en mode EDITION. */
    public editerTemps(i: number): void {
        this.tempsEnEdition = i;
    }

    /** Déplacer un temps dans le journal. */
    public monterTemps(i: number): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {

            // Déplacement du temps
            const temps = this.journal.temps[i];
            this.journal.temps[i] = this.journal.temps[i - 1];
            this.journal.temps[i - 1] = temps;

            // Déplacement du flag d'affichage
            const affichage = this.statutsAffichage[i];
            this.statutsAffichage[i] = this.statutsAffichage[i - 1]
            this.statutsAffichage[i - 1] = affichage;

            // Déplacement du temps en édition
            if (this.tempsEnEdition == i && i > 0) {
                this.tempsEnEdition = i - 1;
            }
        }
    }

    /** Au changement de date, on recherche le journal. */
    public onChangementDateJournal(): void {
        if (this.journaux && this.dateJournal) {
            // Recherche du journal
            this.journal = this.maclasseService.rechercherJournal(this.journaux, this.dateJournal);
            this.statutsAffichage = [];
            if (this.journal && this.journal.temps) {
                this.statutsAffichage = this.journal.temps.map(t => false);
            }

            // MaJ de l'URL avec la date
            const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { time: this.dateJournal.getTime() } }).toString();
            this.location.go(url);
        }
    }

    /** Pour valider un temps directement via un CRTL+ENTRER */
    public onKeyUpSurTempsDeJournal(event: KeyboardEvent): void {
        if (!!event.ctrlKey && event.key == "Enter") {
            this.validerTemps();
        }
    }

    /** Pour valider les remarques directement via un CRTL+ENTRER */
    public onKeyUpSurRemarqueDeJournal(event: KeyboardEvent): void {
        if (!!event.ctrlKey && event.key == "Enter") {
            this.remarqueEnEdition = false;
        }
    }

    /** Suppression d'une compétence. */
    public supprimerCompetence(groupe: GroupeSurUnTemps, idCompetence: string): void {
        if (groupe && idCompetence) {
            const index = groupe.competences.indexOf(idCompetence);
            groupe.competences.splice(index, 1);
        }
    }

    /** Suppression du groupe dans le temps */
    public supprimerGroupe(t: number, g: number): void {
        if (!this.journal || !this.journal.temps || t >= this.journal.temps.length) {
            return;
        }
        const temps = this.journal.temps[t];
        if (!temps || !temps.groupes || g >= temps.groupes.length) {
            return;
        }
        temps.groupes.splice(g, 1);
    }

    /** Suppression du journal */
    public supprimerJournal(): void {
        if (this.journal && this.journaux) {

            // Suppression
            const index = this.journaux.indexOf(this.journal);
            if (index !== -1) {
                this.journaux.splice(index, 1);
            }

            // Ménage dans les flags et données du composant
            this.journal = undefined;
            this.tempsEnEdition = undefined;
            this.remarqueEnEdition = false;
        }
    }

    /** Supprimer un temps */
    public supprimerTemps(i: number): void {

        // Suppression
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {
            this.journal.temps.splice(i, 1);
            this.statutsAffichage.splice(i, 1);
        }

        // Si le journal est vide, création d'un temps par défaut
        if (this.journal?.temps.length == 0) {
            this.ajouterTempsApres(-1, 'classe');
        }
    }

    /** Sortir du mode EDITION */
    public validerTemps(): void {
        this.tempsEnEdition = undefined;
    }
}
