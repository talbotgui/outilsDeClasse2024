import { Component } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'route-accueil', templateUrl: './route-accueil.component.html',
    standalone: true, imports: [
        // FontAwesome
        FontAwesomeModule
    ]
})
export class RouteAccueilComponent {

    /** Constructeur pour injection des dépendances. */
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas);
    }
}
