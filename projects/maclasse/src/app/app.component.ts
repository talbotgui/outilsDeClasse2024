import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import { AbstractComponent } from './directives/abstract.component';
import { DivAideComponent } from './div-aide/div-aide.component';
import { DivContenuComponent } from './div-contenu/div-contenu.component';
import { DivEnteteComponent } from './div-entete/div-entete.component';
import { DivMessageComponent } from './div-message/div-message.component';
import { BouchonService } from './service/bouchon-service';
import { ContexteService } from './service/contexte-service';

@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrl: './app.component.scss',
  standalone: true, imports: [
    // Pour les composants Material
    MatSidenavModule, MatButtonModule, MatTooltipModule,
    // FontAwesome
    FontAwesomeModule,
    // Pour les composants applicatifs
    DivEnteteComponent, DivAideComponent, DivContenuComponent, DivMessageComponent]
})
export class AppComponent extends AbstractComponent implements OnInit {

  /** Flag indiquant si les données sont chargées */
  public donneesChargees = false;

  /** Constructeur pour injection des dépendances. */
  // conserver l'instance de bouchonService même si elle n'est pas utilisée pour forcer le chargement du composant et déclencher l'exécution de son constructeur
  constructor(private library: FaIconLibrary, private contexteService: ContexteService, private bouchonService: BouchonService) {
    super();
    library.addIconPacks(fas);

  }

  /** Au chargement du composant */
  public ngOnInit(): void {
    // Au chargement des données, récupéation de  la liste des élèves
    const sub = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
      tap(donnees => {
        if (donnees) {
          this.donneesChargees = true;
        }
      })
    ).subscribe();
    super.declarerSouscription(sub);
  }
}
