import { Routes } from '@angular/router';
import { TabAccueilComponent } from './tab-accueil/tab-accueil.component';
import { TabAideComponent } from './tab-aide/tab-aide.component';

export const routes: Routes = [

    // pour rediriger par défaut sur le dashboard
    { path: '', redirectTo: '/tab-accueil-route', pathMatch: 'full' },
    { path: 'tab-accueil-route', component: TabAccueilComponent },
    { path: 'tab-aide-route', component: TabAideComponent },
    { path: 'tab-competence-route', component: TabAccueilComponent },
    { path: 'tab-eleve-route', component: TabAccueilComponent },
    { path: 'tab-journal-route', component: TabAideComponent },
    { path: 'tab-projet-route', component: TabAideComponent },
    { path: 'tab-tableaudebord-route', component: TabAideComponent },
    { path: 'tab-taches-route', component: TabAideComponent }
    // { path: 'tab-editioneleve-route/:idEleve', component: TabAccueilComponent },
    // { path: 'tab-editionlisteeleve-route', component: TabAccueilComponent },
    // { path: 'tab-editionjournal-route/:timeJournal', component: TabAccueilComponent },
    // { path: 'tab-editionppi-route/:idEleve/:idPeriode', component: TabAccueilComponent },
    // { path: 'tab-editionbilan-route/:idEleve/:idPeriode', component: TabAccueilComponent },
    // { path: 'tab-eleve-route/:idEleve', component: TabAccueilComponent },
    // { path: 'tab-tableaudebord-route/:idEleve/:idPeriode', component: TabAccueilComponent },
    // { path: 'tab-journal-route/:timeJournal', component: TabAideComponent },
    // { path: 'tab-nouvelleAnnee-route', component: TabAideComponent },
];
