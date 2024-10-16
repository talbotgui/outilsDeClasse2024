import { CommonModule, Location } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { tap } from 'rxjs';
import { AbstractComponent } from '../../directives/abstract.component';
import { Journal } from '../../model/journal-model';
import { ModelUtil } from '../../model/model-utils';
import { ContexteService } from '../../service/contexte-service';


@Component({
    selector: 'route-journal', templateUrl: './route-journal.component.html',
    standalone: true, imports: [
        // Angular
        CommonModule, FormsModule,
        // Matérial
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, MatChipsModule, MatSelectModule, MatDatepickerModule, MatGridListModule,
        // Pour l'éditeur WYSIWYG
        HttpClientModule, AngularEditorModule
    ]
})
export class RouteJournalComponent extends AbstractComponent implements OnInit {

    /** Date du journal saisie dans le filtre. */
    public dateJournal: Date | undefined;

    /** Journal en cours d'édition. */
    public journal: Journal | undefined;

    /** Liste des journaux chargée */
    public journaux: Journal[] | undefined;

    /** Données de références : liste des heures pour la sélection de l'heure de début et de fin des temps */
    public tempsDisponibles: string[] = ModelUtil.creerListeHoraires();
    /** Données de références : liste des types de temps */
    public typesDeTemps: string[] = [];

    /** Constructeur pour injection des dépendances. */
    public constructor(private contexteService: ContexteService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location) { super(); }

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
                this.typesDeTemps = donnees?.libellesTypeTempsJournal || [];
                this.journaux = donnees?.journal;

                //  déclenchement de la sélection du journal
                this.onChangementDateJournal();
            })
        ).subscribe();
        super.declarerSouscription(sub);
    }

    /** Au changement de date, on recherche le journal. */
    public onChangementDateJournal(): void {
        if (this.dateJournal) {
            // Recherche du journal
            const time = this.dateJournal?.getTime();
            this.journal = this.journaux?.find(j => j.date?.getTime() == time);

            // MaJ de l'URL avec la date
            const url = this.router.createUrlTree([], { relativeTo: this.activatedRoute, queryParams: { time: time } }).toString();
            this.location.go(url);
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
}
