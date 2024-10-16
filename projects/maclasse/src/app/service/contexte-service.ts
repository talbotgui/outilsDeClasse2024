import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MessageAafficher } from "../model/message-model";
import { Annee } from "../model/model";

@Injectable({ providedIn: 'root' })
export class ContexteService {

    /** Subject lié aux données de classe chargées. */
    private donneesDeClasseChargee = new BehaviorSubject<any | undefined>(undefined);

    /** Subject lié aux messages généraux à afficher en haut de page. */
    private messageGeneralSubject = new BehaviorSubject<MessageAafficher | undefined>(undefined);

    /** Affiche un message général. */
    public afficherUnMessageGeneral(message: MessageAafficher | undefined): void {
        this.messageGeneralSubject.next(message);
    }

    /** Etre notifié quand les données de classe sont chargées */
    public obtenirUnObservableDuChargementDesDonneesDeClasse(): Observable<Annee | undefined> {
        return this.donneesDeClasseChargee.asObservable();
    }

    /** Etre notifié quand un message général est créé */
    public obtenirUnObservableSurLesMessagesGeneraux(): Observable<MessageAafficher | undefined> {
        return this.messageGeneralSubject.asObservable();
    }

    /** Sauvegarde informations post connexion */
    public sauvegarderDonnesDeClasseChargee(donneesDeClasse: Annee): void {
        this.donneesDeClasseChargee.next(donneesDeClasse);
    }
}