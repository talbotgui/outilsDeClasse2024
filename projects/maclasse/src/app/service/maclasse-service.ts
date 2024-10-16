import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { InclusionEleve } from "../model/eleve-model";
import { Journal, Temps } from "../model/journal-model";
import { MessageAafficher, TypeMessageAafficher } from "../model/message-model";
import { Annee } from "../model/model";
import { ModelUtil } from "../model/model-utils";
import { ContexteService } from "./contexte-service";

@Injectable({ providedIn: 'root' })
export class MaClasseService {

    private static readonly FORMAT_DATE_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;

    /** Constructeur pour injection des dépendances. */
    constructor(private contexteService: ContexteService) { }

    /** Création d'un nouveau journal pour cette date */
    public rechercherOuCreerJournal(journaux: Journal[], dateJournal: Date): Journal | undefined {

        // Si pas de date, pas de journal
        if (!dateJournal) {
            return undefined;
        }
        // Recherche du journal
        let journal = this.rechercherJournal(journaux, dateJournal);
        if (journal) {
            return journal;
        }

        // Ajout d'un nouveau journal pour la date sélectionnée
        const nouveauJournal = new Journal();
        nouveauJournal.date = dateJournal;
        journaux?.push(nouveauJournal);
        return nouveauJournal;
    }

    /** Recherche d'un journal existant */
    public rechercherJournal(journaux: Journal[], dateJournal: Date): Journal | undefined {
        const time = dateJournal.getTime();
        return journaux?.find(j => j.date?.getTime() == time);
    }

    /** Duplication du journal pour l'ajouter avec la date cible. */
    public dupliquerJournal(journal: Journal, journalCible: Journal): void {
        // Si le journal n'est pas vide, on ne peut pas dupliquer
        if (journalCible.temps && journalCible.temps.length > 0) {
            const message = new MessageAafficher("dupliquerJournal", TypeMessageAafficher.Avertissement, "Des temps sont présents dans le journal du " + MaClasseService.formatDate(journal.date, true) + '.');
            this.contexteService.afficherUnMessageGeneral(message);
            return;
        }

        journalCible.remarque = 'Duplication du journal du ' + MaClasseService.formatDate(journal.date, true) + '<br/>' + journal.remarque;
        journalCible.temps = [];
        if (journal.temps) {
            for (const t of journal.temps) {
                journalCible.temps.push(this.clonerTemps(t));
            }
        }
    }

    /** Duplication du temps et ajout au journal de la date cible */
    public dupliquerTemps(temps: Temps, journalCible: Journal): void {
        // Ajout du temps dupliqué
        if (!journalCible.temps) {
            journalCible.temps = [];
        }
        journalCible.temps.push(this.clonerTemps(temps));
    }

    /** Fonction de manipulation de données */
    private clonerTemps(t: Temps): Temps {
        const nouveauTemps = new Temps();
        nouveauTemps.commentaire = t.commentaire;
        nouveauTemps.competences = t.competences.slice();
        nouveauTemps.debut = t.debut;
        nouveauTemps.fin = t.fin;
        nouveauTemps.eleves = t.eleves.slice();
        nouveauTemps.nom = t.nom;
        nouveauTemps.type = t.type;
        return nouveauTemps;
    }

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
        donnees.journal.forEach(j => {
            j.id = j.id ?? ModelUtil.getUID();
            j.temps.forEach(t => {
                t.id = t.id ?? ModelUtil.getUID();
                t.type = (t.type) ? t.type : 'classe';
            });
        });
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

        // Fonction traitant les dates dans le JSON
        const parseIsoDateStrToDate = (key: string, value: any) => {
            if (typeof value === "string" && MaClasseService.FORMAT_DATE_ISO.test(value)) {
                return new Date(value);
            }
            return value
        }

        // Parse du JSON
        try {
            return of(JSON.parse(json, parseIsoDateStrToDate))
        } catch (error) {
            console.error(error);
            return of(undefined);
        }
    }

    /** Formattage d'une date. */
    private static formatDate(date?: Date, formatLong: boolean = false): string {
        if (date) {
            const mapJours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            const jour = mapJours[date.getDay()];
            const j = MaClasseService.formatNumber(date.getDate());
            const m = MaClasseService.formatNumber(date.getMonth() + 1);
            const y = date.getFullYear();
            if (formatLong) {
                return jour + ' ' + j + '/' + m + '/' + y;
            } else {
                return j + '/' + m + '/' + y;
            }
        } else {
            return '';
        }
    }

    /** Formattage d'un nombre sur 2 chiffres. */
    private static formatNumber(n: number): string {
        if (n < 10) {
            return '0' + n;
        } else {
            return '' + n;
        }
    }
}