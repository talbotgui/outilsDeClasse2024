import { Routes } from '@angular/router';
import { RouteAccueilComponent } from './routes/route-accueil/route-accueil.component';
import { RouteChargerDonneesComponent } from './routes/route-chargerdonnees/route-chargerdonnees.component';


export const routes: Routes = [
    // pour rediriger par défaut sur le dashboard
    { path: '', redirectTo: '/route-accueil', pathMatch: 'full' },
    { path: 'route-accueil', component: RouteAccueilComponent },
    { path: 'route-chargerdonnees', component: RouteChargerDonneesComponent },
    { path: 'route-competence', component: RouteAccueilComponent },
    { path: 'route-eleve', component: RouteAccueilComponent },
    { path: 'route-journal', component: RouteAccueilComponent },
    { path: 'route-projet', component: RouteAccueilComponent },
    { path: 'route-tableaudebord', component: RouteAccueilComponent },
    { path: 'route-taches', component: RouteAccueilComponent }
    // { path: 'tab-editioneleve/:idEleve', component: RouteAccueilComponent },
    // { path: 'tab-editionlisteeleve', component: RouteAccueilComponent },
    // { path: 'tab-editionjournal/:timeJournal', component: RouteAccueilComponent },
    // { path: 'tab-editionppi/:idEleve/:idPeriode', component: RouteAccueilComponent },
    // { path: 'tab-editionbilan/:idEleve/:idPeriode', component: RouteAccueilComponent },
    // { path: 'tab-eleve/:idEleve', component: RouteAccueilComponent },
    // { path: 'tab-tableaudebord/:idEleve/:idPeriode', component: RouteAccueilComponent },
    // { path: 'tab-journal/:timeJournal', component: RouteAccueilComponent },
    // { path: 'tab-nouvelleAnnee', component: RouteAccueilComponent },
];
