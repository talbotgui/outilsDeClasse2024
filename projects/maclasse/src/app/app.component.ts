import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DivAideComponent } from './div-aide/div-aide.component';
import { DivContenuComponent } from './div-contenu/div-contenu.component';
import { DivEnteteComponent } from './div-entete/div-entete.component';
import { DivMessageComponent } from './div-message/div-message.component';
import { BouchonService } from './service/bouchon-service';


@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrl: './app.component.scss',
  standalone: true, imports: [
    // Pour les composants Material
    MatSidenavModule, MatButtonModule, MatTooltipModule,
    // Pour les composants applicatifs
    DivEnteteComponent, DivAideComponent, DivContenuComponent, DivMessageComponent]
})
export class AppComponent {

  /** Constructeur pour injection des dépendances. */
  // conserver l'instance de bouchonService même si elle n'est pas utilisée pour forcer le chargement du composant et déclencher l'exécution de son constructeur
  constructor(private bouchonService: BouchonService) { }

}
