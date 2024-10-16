import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { tap } from 'rxjs';
import { AbstractComponent } from '../../directives/abstract.component';
import { Eleve } from '../../model/eleve-model';
import { Periode } from '../../model/model';
import { LigneDeTableauDeBord, SousLigneDeTableauDeBord } from '../../model/model-tdb';
import { Competence, Note } from '../../model/note-model';
import { ContexteService } from '../../service/contexte-service';
import { MaClasseService } from '../../service/maclasse-service';

@Component({
    selector: 'route-tdb', templateUrl: './route-tdb.component.html', styleUrl: './route-tdb.component.scss',
    standalone: true, imports: [
        // Angular
        CommonModule, FormsModule,
        // FontAwesome
        FontAwesomeModule,
        // Matérial
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, MatSelectModule
    ]
})
export class RouteTdbComponent extends AbstractComponent implements OnInit {

    /** Donnees de référence : liste des élèves. */
    public eleves: Eleve[] = [];
    /** Donnees de référence : liste des périodes. */
    public periodes: Periode[] = [];
    /** Donnees de référence : liste des périodes. */
    private competences: Competence[] = [];
    /** Donnees de référence : liste des compétences sous forme de MAP. */
    private mapCompetences = new Map<string, Competence>();
    /** Donnees de référence : libellés de note. */
    public mapLibelleNotes: { [key: string]: string } = {};


    /** Donnees manipulées : liste des notes. */
    private notes: Note[] = [];
    /** Donnees manipulées : liste des lignes du tableau de bord. */
    public lignes: LigneDeTableauDeBord[] = [];

    /** Filtre : élève. */
    public eleveSelectionne: Eleve | undefined;
    /** Filtre : période. */
    public periodeSelectionnee: Periode | undefined;
    /** Filtre : Mode d'affichage. */
    public modeAffichage: number = 1;

    /** Constructeur pour injection des dépendances. */
    public constructor(private contexteService: ContexteService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location, private maclasseService: MaClasseService, private dialog: MatDialog) {
        super();
    }

    /** Au chargement du composant */
    public ngOnInit(): void {

        // Récupération du paramètre de date depuis l'URL
        const eleveEnParametreUrl = this.activatedRoute.snapshot.queryParams['eleve'];
        const periodeEnParametreUrl = this.activatedRoute.snapshot.queryParams['periode'];
        const modeAffichageEnParametreUrl = this.activatedRoute.snapshot.queryParams['affichage'];

        // Au chargement des données,
        const sub = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
            tap(donnees => {
                // Copie des données nécessaires
                this.periodes = donnees?.periodes || [];
                this.eleves = donnees?.eleves || [];
                this.notes = donnees?.notes || [];
                this.competences = donnees?.competences || [];
                this.competences.forEach(c => this.mapCompetences.set(c.id || '', c));
                this.mapLibelleNotes = donnees?.mapLibelleNotes || {};

                // Initialisation des filtres à partir des données de l'URL (si présentes)
                if (eleveEnParametreUrl && periodeEnParametreUrl && periodeEnParametreUrl) {
                    this.eleveSelectionne = this.eleves.find(e => e.id === eleveEnParametreUrl);
                    this.periodeSelectionnee = this.periodes.find(e => e.id === periodeEnParametreUrl);
                    this.modeAffichage = modeAffichageEnParametreUrl;
                }

                //  déclenchement du traitement de MaJ des données maintenant que les filtres sont initialisés
                this.onChangementFiltre();
            })
        ).subscribe();
        super.declarerSouscription(sub);
    }

    /** Recherche de l'ascendance d'une compétence */
    private calculerAscendance(idItem: string | undefined): Competence[] {
        // Init du tableau des ascendants
        const ascendance: Competence[] = [];

        // Recherche de l'ascendance
        let id = idItem;
        while (id && id != '#') {
            const competence = this.rechercherCompetence(id);
            if (competence) {
                ascendance.push(competence);
            }
            id = competence?.parent;
        }

        return ascendance.reverse();
    }

    /** Calcul (ou usage du cache) d'un libellé complet de compétence */
    private calculerLibelleDeCompetence(competence: Competence, aPartirDe: number = 0): string {
        let ascendance = this.calculerAscendance(competence.id);
        if (aPartirDe) {
            ascendance.splice(0, aPartirDe);
        }
        return ascendance.map(c => c.text).join(' > ');
    }

    /** Création des lignes à partir des notes */
    private creerLignesTdb(): void {
        this.lignes = [];

        // Si une période est sélectionnée
        if (this.periodeSelectionnee) {

            // Filtrage des notes de l'élève (car on va boucler deux fois dessus, autant réduire la liste)
            const notesDeLeleve = this.notes.filter(n => n.idEleve == this.eleveSelectionne?.id);

            // Création des lignes pour les deux périodes
            const indexPeriodeSelectionnee = this.periodes.indexOf(this.periodeSelectionnee);
            if (this.modeAffichage == 1) {
                if (indexPeriodeSelectionnee > 0) {
                    this.creerLignesTableauDeBordPourUnePeriode(this.periodes[indexPeriodeSelectionnee - 1], false, notesDeLeleve);
                }
                this.creerLignesTableauDeBordPourUnePeriode(this.periodeSelectionnee, true, notesDeLeleve);
            } else {
                this.creerLignesTableauDeBordPourUnePeriode(this.periodeSelectionnee, false, notesDeLeleve);
                if (indexPeriodeSelectionnee < this.periodes.length) {
                    this.creerLignesTableauDeBordPourUnePeriode(this.periodes[indexPeriodeSelectionnee + 1], true, notesDeLeleve);
                }
            }
        }

        console.log('lignes=', this.lignes);
    }

    /** Création des lignes pour la période fournie */
    private creerLignesTableauDeBordPourUnePeriode(periode: Periode, periodePreparee: boolean, notesDeLeleve: Note[]): void {
        if (periode && periode.debut && periode.fin) {
            const dateDebutPeriodeSelectionnee = periode.debut;
            const dateFinPeriodeSelectionnee = periode.fin;

            // Pour chaque note 
            notesDeLeleve
                //de la période
                .filter(n => n.date && dateDebutPeriodeSelectionnee <= n.date && n.date <= dateFinPeriodeSelectionnee)
                // Création des lignes correspondantes
                .forEach(n => {
                    // Recherche des compétences de la note
                    const competenceParente = this.rechercherCompetenceParente(n.idItem);

                    // En cas de pb
                    if (!competenceParente) {
                        console.log('PROBLEME car pas de compétence parente pour la note', n);
                        return;
                    }

                    // Recherche (ou création) de la ligne pour cette compétence parente
                    let ligne = this.lignes.find(l => l.competenceParente?.id === competenceParente.id);
                    if (!ligne) {
                        ligne = new LigneDeTableauDeBord();
                        ligne.competenceParente = competenceParente;
                        ligne.libelleCompetenceParente = this.calculerLibelleDeCompetence(ligne.competenceParente);
                        this.lignes.push(ligne);
                    }

                    // Recherche (ou création) de la sous-ligne pour cette compétence
                    let sousLigne = ligne.sousLignes.find(sl => sl.competence?.id == n.idItem);
                    if (!sousLigne) {
                        sousLigne = new SousLigneDeTableauDeBord();
                        sousLigne.competence = this.rechercherCompetence(n.idItem);
                        if (sousLigne.competence) {
                            sousLigne.libelleCompetence = this.calculerLibelleDeCompetence(sousLigne.competence, 3);
                        }
                        ligne.sousLignes.push(sousLigne);
                    }

                    // Alimentation des champs en fonction du type de période (évaluée ou préparéek)
                    if (periodePreparee) {
                        sousLigne.notePeriodeSuivante = n;
                    } else {
                        sousLigne.notePeriodePrecedente = n;
                    }
                });
        }
    }

    /** Au changement d'un des filtres. */
    public onChangementFiltre(): void {

        // MaJ de l'URL avec les données de filtrage
        if (this.eleveSelectionne && this.periodeSelectionnee && this.modeAffichage) {
            const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { eleve: this.eleveSelectionne.id, periode: this.periodeSelectionnee.id, affichage: this.modeAffichage } }).toString();
            this.location.go(url);
        }

        // Créer lignes du tdb
        this.creerLignesTdb();
    }

    /** Méthode de recherche dans les données de référence. */
    private rechercherCompetence(idCompetence: string | undefined): Competence | undefined {
        if (idCompetence) {
            return this.mapCompetences.get(idCompetence);
        } else {
            return undefined;
        }
    }

    /** Méthode de recherche dans les données de référence */
    private rechercherCompetenceParente(idItem: string | undefined): Competence | undefined {
        // Recherche de l'ascendance
        const ascendance = this.calculerAscendance(idItem);

        // Renvoi du niveau 3 (ou lenght-1 à défaut)
        if (ascendance.length >= 3) {
            return ascendance[2];
        } else {
            return undefined;
        }
    }
}
