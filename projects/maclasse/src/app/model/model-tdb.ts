import { AvecIdentifiant, Projet } from "./model";
import { Competence, Note } from "./note-model";

export class LigneDeTableauDeBord extends AvecIdentifiant {
  public competenceParente: Competence | undefined;
  public libelleCompetenceParente: string = '';
  public referenceProjet: Projet | undefined;
  public sousLignes: SousLigneDeTableauDeBord[] = [];
}
export class SousLigneDeTableauDeBord extends AvecIdentifiant {
  public competence: Competence | undefined;
  public libelleCompetence: string = '';

  public notePeriodeEvaluee: Note | undefined;
  public notePeriodePreparee: Note | undefined;
}
