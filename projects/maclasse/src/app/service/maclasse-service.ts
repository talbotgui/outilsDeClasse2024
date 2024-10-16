import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { MessageAafficher, TypeMessageAafficher } from "../model/message-model";
import { Annee } from "../model/model";
import { ContexteService } from "./contexte-service";

@Injectable({ providedIn: 'root' })
export class MaClasseService {

    /** Constructeur pour injection des dépendances. */
    constructor(private contexteService: ContexteService) { }

    /**
     * Chargement du contenu d'un fichier JSON de données de classe.
     * @param donnees Les données JSON sous forme de string.
     * @return un observable indiquant le résultat du traitement
     */
    public chargerDonneesDeClasse(donnees: string): Observable<boolean> {

        // Parse de la string fournie
        return this.parserFichierJson(donnees).pipe(
            map(donnees => {
                // Si le parse est un succès
                if (donnees) {
                    // sauvegarde des données dans le contexte
                    this.contexteService.sauvegarderDonnesDeClasseChargee(donnees);
                    // message de succès
                    this.contexteService.afficherUnMessageGeneral(new MessageAafficher("chargerDonneesDeClasse", TypeMessageAafficher.Information, "Le fichier de données est correctement chargé."));
                    // renvoi OK
                    return true;
                }
                // sinon
                else {
                    //Message d'erreur
                    this.contexteService.afficherUnMessageGeneral(new MessageAafficher("chargerDonneesDeClasse", TypeMessageAafficher.Erreur, "Erreur durant l'analyse du contenu du fichier. Est-ce bien un fichier de données de l'application MaClasse ?"));
                    // renvoi KO
                    return false;
                }
            })
        );
    }

    /** Parse du fichier. */
    private parserFichierJson(json: string): Observable<Annee | undefined> {
        // Parse du JSON
        try {
            return of(JSON.parse(json))
        } catch (error) {
            console.error(error);
            return of(undefined);
        }
    }
}