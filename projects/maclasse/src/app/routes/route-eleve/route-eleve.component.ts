import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { tap } from 'rxjs';
import { AbstractComponent } from '../../directives/abstract.component';
import { AbsenceEleve, ContactEleve, CursusEleve, Eleve } from '../../model/eleve-model';
import { ModelUtil } from '../../model/model-utils';
import { ContexteService } from '../../service/contexte-service';


@Component({
    selector: 'route-eleve', templateUrl: './route-eleve.component.html', styleUrl: './route-eleve.component.scss',
    standalone: true, imports: [
        // Angular
        CommonModule, FormsModule,
        // Matérial
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, MatChipsModule, MatSelectModule, MatDatepickerModule, MatGridListModule,
        // Pour l'éditeur WYSIWYG
        HttpClientModule, AngularEditorModule

    ]
})
export class RouteEleveComponent extends AbstractComponent implements OnInit {

    /** Liste des élèves extraite des données de la classe */
    public eleves: Eleve[] | undefined;
    /** Elève sélectionné */
    public eleveSelectionne: Eleve | undefined;

    /** Liste des statuts d'élève pour la liste déroulante */
    public mapLibelleStatutEleve: any | undefined;
    /** Liste des types de contact pour la liste déroulante */
    public mapTypeContact: any | undefined;
    /** Liste des raisons d'absence pour la liste déroulante */
    public mapRaisonAbsence: any | undefined;
    /**  Liste des heures pour la sélection de l'heure de début et de fin des temps*/
    public tempsDisponibles: string[] = ModelUtil.creerListeHoraires();;
    /**  Liste des jours de la semaine*/
    public joursDeLaSemaine: Map<string, string> = ModelUtil.creerMapJoursDeLaSemaine();

    /** Constructeur pour injection des dépendances. */
    public constructor(private contexteService: ContexteService) { super(); }

    /** Au chargement du composant */
    public ngOnInit(): void {
        // Au chargement des données, récupéation de  la liste des élèves
        const sub = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
            tap(donnees => {
                this.eleves = donnees?.eleves;
                this.mapLibelleStatutEleve = donnees?.mapLibelleStatutEleve;
                this.mapTypeContact = donnees?.mapTypeContact;
                this.mapRaisonAbsence = donnees?.mapRaisonAbsence;
            })
        ).subscribe();
        super.declarerSouscription(sub);
    }

    /** Ajout d'un contact à la liste des contacts de l'élève sélectionné */
    public ajouterUnContact(): void {
        if (this.eleveSelectionne) {
            this.eleveSelectionne.contacts.push(new ContactEleve());
        }
    }

    /** Ajout d'une absence  à la liste des absences de l'élève sélectionné */
    public ajouterUneAbsence(): void {
        if (this.eleveSelectionne) {
            if (!this.eleveSelectionne.absences) {
                this.eleveSelectionne.absences = [];
            }
            this.eleveSelectionne.absences.push(new AbsenceEleve());
        }
    }

    /** Ajout d'un élève et sélection automatique. */
    public ajouterUnEleve(): void {
        this.eleves?.push(new Eleve());
    }

    /** Au clic sur un élève, on le sélectionne/désélectionne */
    public onSelectionEleve(eleve: Eleve): void {
        // Si l'élève cliqué est déjà sélectionné, on vide l'élève sélectionné
        if (this.eleveSelectionne && this.eleveSelectionne === eleve) {
            this.eleveSelectionne = undefined;
        }
        // Sinon on sélectionne l'élève
        else {
            this.eleveSelectionne = eleve;
        }
    }

    /** Ajouter une ligne de cursus */
    public ajouterCursus(): void {
        if (this.eleveSelectionne) {
            const nouveauCursus = new CursusEleve();
            nouveauCursus.annee = this.recupererAnneeSuivante(this.eleveSelectionne);
            this.eleveSelectionne.cursus.push(nouveauCursus);
        }
    }

    /** Extraction de l'année suivante des données de l'élève. */
    private recupererAnneeSuivante(eleve: Eleve): number {

        // par défaut
        let anneeSuivante = 1;

        // si un cursus existe, on en récupère l'année
        if (eleve.cursus && eleve.cursus.length > 0) {
            anneeSuivante = eleve.cursus[eleve.cursus.length - 1].annee + 1;
        }

        // si une date de naissance existe (de type DATE ou STRING)
        else if (eleve.dateNaissance) {
            if (eleve.dateNaissance instanceof Date) {
                anneeSuivante = eleve.dateNaissance.getFullYear();
            } else {
                anneeSuivante = parseInt(("" + eleve.dateNaissance).substring(0, 4));
            }
        }

        // renvoi de l'année
        return anneeSuivante;
    }

    /** Retrait du cursus de la liste. */
    public retirerCursus(cursus: CursusEleve): void {
        if (this.eleveSelectionne) {
            const index = this.eleveSelectionne.cursus.indexOf(cursus);
            if (0 <= index && index < this.eleveSelectionne.cursus.length) {
                this.eleveSelectionne.cursus.splice(index, 1);
            }
        }
    }
}
