import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AbstractComponent } from '../../directives/abstract.component';
import { MaClasseService } from '../../service/maclasse-service';

@Component({
    selector: 'route-chargerdonnees', templateUrl: './route-chargerdonnees.component.html',
    standalone: true, imports: [
        // Matérial
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule,
        // FontAwesome
        FontAwesomeModule
    ]
})
export class RouteChargerDonneesComponent extends AbstractComponent {

    /** Constructeur pour injection des dépendances. */
    constructor(private maclasseService: MaClasseService) { super(); }

    /**Nom du fichier local sélectionné (vide sinon) */
    public nomFichierLocal = "";

    /** A la sélection d'un fichier via upload */
    public onSelectFichierLocal(event: Event): void {
        // Récupération de l'input depuis l'event
        const fichier = (event?.target as any)?.value;

        // Si un fichier est bien sélectionné
        if (fichier) {
            // Extraction du nom du fichier
            this.nomFichierLocal = fichier.substring(fichier.lastIndexOf('/') + fichier.lastIndexOf('\\') + 2);
        }
    }

    /** Au clic sur la validation du chargement d'un fichier local */
    public onClickValiderChargementFichierLocal(inputFichierLocal: HTMLInputElement): void {
        // Préparation du traitement de lecture du fichier chargé
        const fr = new FileReader();
        fr.onloadend = this.lireFichier.bind(this);

        // Lecture des données sur les navigateurs HTML5
        if (inputFichierLocal.files && inputFichierLocal.files.length === 1) {
            fr.readAsText(inputFichierLocal.files[0]);
        }
    }

    /** Lecture du fichier */
    private lireFichier(e: any) {
        // Extraction du contenu
        const contenu = e.target['result'];

        // Chargement et sauvegarde
        const sub = this.maclasseService.chargerDonneesDeClasse(contenu).subscribe();
        super.declarerSouscription(sub);
    }
}
