import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { tap } from 'rxjs';
import { AbstractComponent } from '../directives/abstract.component';
import { ContexteService } from '../service/contexte-service';


@Component({
  selector: '[div-contenu]', templateUrl: './div-contenu.component.html',
  standalone: true, imports: [
    // Pour les routes
    RouterOutlet, CommonModule, RouterLink, RouterLinkActive,
    // Pour les composants Material
    MatTabsModule, MatSidenavModule, MatButtonModule, MatTooltipModule]
})
export class DivContenuComponent extends AbstractComponent implements OnInit {

  /** Flag indiquant que le menu peut être complètement affiché car les données sont chargées */
  public donneesDeClasseChargee = false;

  /** Constructeur pour injection des dépendances. */
  public constructor(private contexteService: ContexteService, private router: Router) { super(); }

  /** Au chargement du composant */
  public ngOnInit(): void {
    // Si des données sont chargées, 
    const sub = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
      tap(donnees => {
        //l'état est conservé
        this.donneesDeClasseChargee = !!donnees;
        // bascule sur la route ELEVE
        this.router.navigate(['route-eleve']);
      })
    ).subscribe();
    super.declarerSouscription(sub);
  }
}
