import { afterNextRender, Injectable } from "@angular/core";
import { AbstractComponent } from "../directives/abstract.component";
import { Jdd } from "../model/jdd";
import { MessageAafficher, TypeMessageAafficher } from "../model/message-model";
import { ContexteService } from "./contexte-service";
import { MaClasseService } from "./maclasse-service";

@Injectable({ providedIn: 'root' })
export class BouchonService extends AbstractComponent {

    /** Flag public */
    public unJeuDeDonneesBouchonneEstCharge = false;

    /** Constructeur pour injection des dépendances. */
    constructor(private maclasseService: MaClasseService, private contexteService: ContexteService) {
        super();

        // Pour accéder à l'objet WINDOW (qui est propre à un navigateur), il faut utiliser afterNextRender dans un constructeur
        afterNextRender(() => {
            if (window.location.href.indexOf("bouchon") !== -1) {
                this.chargerUnBouchon();
            }
        });
    }

    /** Charger un jeu de données de bouchon. */
    public chargerUnBouchon(): void {
        // Initialisation du flag avant le chargement réel (pour que le flag soit true avant le déclenchement de l'évènement dans le contexte)
        this.unJeuDeDonneesBouchonneEstCharge = true

        // un jeu de données est chargé par défaut
        const sub = this.maclasseService.chargerDonneesDeClasse(JSON.stringify(Jdd.JDD_RICHE)).subscribe();
        super.declarerSouscription(sub);

        // Un message est affiché
        this.contexteService.afficherUnMessageGeneral(new MessageAafficher("AppComponent", TypeMessageAafficher.Information, "Jeu de données BOUCHON1 chargé"));
    }
}