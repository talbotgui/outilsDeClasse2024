import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Event, NavigationEnd, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AbstractComponent } from '../directives/abstract.component';
import { ContexteService } from '../service/contexte-service';

@Component({
    selector: '[div-aide]', templateUrl: './div-aide.component.html',
    standalone: true, imports: [MatIconModule]
})
export class DivAideComponent extends AbstractComponent implements OnInit {

    /** Route active à un instant T */
    public routeActive: string | undefined;

    /** Flag sur le chargement des données de classe */
    public donneesChargees = false;

    /** Constructeur pour injection des dépendances. */
    public constructor(private router: Router, private contexteService: ContexteService) { super(); }

    /** Au chargement du composant */
    public ngOnInit(): void {
        // Mise en place d'une écoute des évènements du ROUTER d'Angular
        const sub = this.router.events.pipe(
            tap(this.traiterEvenement)
        ).subscribe();
        super.declarerSouscription(sub);

        // Ecoute du chargement des données
        const sub2 = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
            tap(donnees => this.donneesChargees = !!donnees)
        ).subscribe();
        super.declarerSouscription(sub2);
    }

    /** Traitement de chaque EVENT envoyé par le ROUTER d'Angular */
    private traiterEvenement(e: Event) {
        // Si l'évènement est le dernier de la série liée à un changement de page dans le routeur
        // @see https://medium.com/@gurunadhpukkalla/router-events-in-angular-3112a3968660
        if (e instanceof NavigationEnd) {
            this.routeActive = (e as NavigationEnd).urlAfterRedirects;
        }
    }
}
