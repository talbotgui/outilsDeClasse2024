import { Eleve } from "./eleve-model";
import { Journal } from "./journal-model";
import { Competence, Note } from "./note-model";

export class Annee {
  public anneeScolaire?: string;
  public periodes: Periode[] = [];
  public enteteEdition?: string;
  public enseignant?: string;
  public cycleNiveau?: string;
  public libellesTypeTempsJournal: string[] = [];
  public eleves: Eleve[] = [];
  public competences: Competence[] = [];
  public notes: Note[] = [];
  public journal: Journal[] = [];
  public dateDerniereSauvegarde: Date | undefined;
  public historique: Historique[] = [];
  public erreursChargement: string[] = [];
  public mapLibelleStatutEleve: any;
  public mapLibelleNotes: any;
  public mapTypeContact: any;
  public mapRaisonAbsence: any;
  public mapLibelleStatutEleveMap: Map<string, string> | undefined = new Map<string, string>();
  public mapLibelleNotesMap: Map<string, string> | undefined = new Map<string, string>();
  public mapTypeContactMap: Map<string, string> | undefined = new Map<string, string>();
  public mapRaisonAbsenceMap: Map<string, string> | undefined = new Map<string, string>();
  public themeSelectionne?: string;
  public taches: Tache[] = [];
  public projets: Projet[] = [];
}

export class Periode {
  public id: number = 0;
  public nom?: string;
  public debut: Date | undefined;
  public fin: Date | undefined;
}

export class Historique {
  public date: Date | undefined;
  public modification?: string;
}
export class Echeance {
  public termine: boolean = false;
  public nom?: string;
  public date?: Date;
}
export class Tache {
  public titre?: string;
  public echeances: Echeance[] = [];
}

export class Projet {
  public nom?: string;
  public idCompetences: string[] = [];
}
