import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { tap } from 'rxjs';
import { AbstractComponent } from '../../directives/abstract.component';
import { Eleve } from '../../model/eleve-model';
import { Journal, Temps } from '../../model/journal-model';
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
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, MatChipsModule, MatSelectModule, MatDatepickerModule, MatGridListModule, MatDialogModule,
        // Pour l'éditeur WYSIWYG
        HttpClientModule, AngularEditorModule,
        // Pipes
        HtmlPipe
    ]
})
export class RouteJournalComponent extends AbstractComponent implements OnInit {

    /** Date du journal saisie dans le filtre. */
    public dateJournal: Date | undefined;

    /** Journal en cours d'édition. */
    public journal: Journal | undefined;

    /** Liste des journaux chargée */
    public journaux: Journal[] | undefined;

    /** Index du temps en cours d'édition */
    public tempsEnEdition: number | undefined;

    /** Flag pour les remarques  en cours d'édition */
    public remarqueEnEdition: boolean = false;

    /** Données de référence : liste des heures pour la sélection de l'heure de début et de fin des temps */
    public tempsDisponibles: string[] = ModelUtil.creerListeHoraires();
    /** Donnees de référence : liste des élèves */
    public eleves: Eleve[] = []

    /** Constructeur pour injection des dépendances. */
    public constructor(library: FaIconLibrary, private contexteService: ContexteService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location, private maclasseService: MaClasseService, private dialog: MatDialog) {
        super();
        library.addIconPacks(fas);
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
        if (this.journaux && this.dateJournal) {
            this.maclasseService.rechercherOuCreerJournal(this.journaux, this.dateJournal);
        }
    }

    /** Au changement de date, on recherche le journal. */
    public onChangementDateJournal(): void {
        if (this.journaux && this.dateJournal) {
            // Recherche du journal
            this.journal = this.maclasseService.rechercherJournal(this.journaux, this.dateJournal);

            // MaJ de l'URL avec la date
            const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { time: this.dateJournal.getTime() } }).toString();
            this.location.go(url);
        }
    }

    public validerTemps(): void {
        this.tempsEnEdition = undefined;
    }
    public editerTemps(i: number): void {
        this.tempsEnEdition = i;
    }
    public supprimerTemps(i: number): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {
            this.journal.temps.splice(i, 1);
        }
    }
    public descendreTemps(i: number): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {
            const temps = this.journal.temps[i];
            this.journal.temps[i] = this.journal.temps[i + 1];
            this.journal.temps[i + 1] = temps;
            if (this.tempsEnEdition == i && i < this.journal.temps.length - 1) {
                this.tempsEnEdition = i + 1;
            }
        }
    }
    public monterTemps(i: number): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {
            const temps = this.journal.temps[i];
            this.journal.temps[i] = this.journal.temps[i - 1];
            this.journal.temps[i - 1] = temps;
            if (this.tempsEnEdition == i && i > 0) {
                this.tempsEnEdition = i - 1;
            }
        }
    }
    public ajouterTempsApres(i: number, type: string): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {
            const temps = new Temps();
            temps.type = type;
            this.journal.temps.splice(i + 1, 0, temps);
            if (type === 'classe') {
                this.tempsEnEdition = i + 1;
            }
        }
    }

    /** Ajout ou retrait d'un élève à un temps */
    public ajouterRetirerEleveAuTemps(i: number, idEleve: string): void {
        if (this.journal && this.journal.temps && i < this.journal.temps.length) {
            if (!this.journal.temps[i].eleves) {
                this.journal.temps[i].eleves = [];
            }
            const index = this.journal.temps[i].eleves.indexOf(idEleve);
            if (index !== -1) {
                this.journal.temps[i].eleves.splice(index, 1);
            } else {
                this.journal.temps[i].eleves.push(idEleve);
            }
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
}
