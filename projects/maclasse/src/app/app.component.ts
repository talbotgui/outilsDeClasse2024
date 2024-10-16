import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DivEnteteComponent } from './div-entete/div-entete.component';

@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrl: './app.component.scss',
  standalone: true, imports: [RouterOutlet, MatTabsModule, CommonModule, RouterLink, RouterLinkActive, DivEnteteComponent]
})
export class AppComponent {

  /** Flag indiquant que le menu peut être complètement affiché car les données sont chargées */
  public menuCompletAffiche = false;

}
