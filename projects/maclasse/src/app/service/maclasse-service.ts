import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { InclusionEleve } from "../model/eleve-model";
import { MessageAafficher, TypeMessageAafficher } from "../model/message-model";
import { Annee } from "../model/model";
import { ModelUtil } from "../model/model-utils";
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
                    // recompléter les données si des attributs sont manquants
                    this.completerDonneeSiManquante(donnees);
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

    /** Ajout /completion d'attributs/membres vides. */
    private completerDonneeSiManquante(donnees: Annee): void {
        // Initialisation des listes et map si null ou undefined
        donnees.competences = donnees.competences ?? [];
        donnees.eleves = donnees.eleves ?? [];
        donnees.historique = donnees.historique ?? [];
        donnees.journal = donnees.journal ?? [];
        donnees.libellesTypeTempsJournal = donnees.libellesTypeTempsJournal ?? [];
        donnees.mapLibelleNotes = donnees.mapLibelleNotes ?? {};
        donnees.mapLibelleStatutEleve = donnees.mapLibelleStatutEleve ?? {};
        donnees.mapTypeContact = donnees.mapTypeContact ?? {};
        donnees.mapRaisonAbsence = donnees.mapRaisonAbsence ?? {};
        donnees.notes = donnees.notes ?? [];
        donnees.periodes = donnees.periodes ?? [];
        donnees.projets = donnees.projets ?? [];
        donnees.taches = donnees.taches ?? [];
        // Initialisation des ID si manquant
        donnees.competences.forEach(c => c.id = c.id ?? ModelUtil.getUID());
        donnees.eleves.forEach(e => {
            e.id = e.id ?? ModelUtil.getUID();
            e.inclusion = e.inclusion ?? new InclusionEleve();
            e.contacts = e.contacts ?? [];
            e.absences = e.absences ?? [];
            e.cursus = e.cursus ?? [];
            e.contacts.forEach(c => c.id = c.id ?? ModelUtil.getUID());
            e.cursus.forEach(c => c.id = c.id ?? ModelUtil.getUID());
            e.absences.forEach(a => a.id = a.id ?? ModelUtil.getUID());
        });
        donnees.historique.forEach(h => h.id = h.id ?? ModelUtil.getUID());
        donnees.journal.forEach(j => j.id = j.id ?? ModelUtil.getUID());
        donnees.notes.forEach(n => n.id = n.id ?? ModelUtil.getUID());
        donnees.periodes.forEach(p => p.id = p.id ?? ModelUtil.getUID());
        donnees.projets.forEach(p => p.id = p.id ?? ModelUtil.getUID());
        donnees.taches.forEach(t => {
            t.id = t.id ?? ModelUtil.getUID();
            t.echeances = t.echeances ?? [];
        });
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