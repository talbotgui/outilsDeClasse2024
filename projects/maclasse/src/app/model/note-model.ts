export class Competence {
  public id?: string;
  public text?: string;
  public parent?: string;
}
export class Note {
  public id?: string;
  public date?: Date;
  public idEleve?: string;
  public idItem?: string;
  public valeurEvaluation?: string;
  public commentaireEvaluationPublic?: string;
  public commentaireEvaluationPrive?: string;
  public constatEnPreparation?: string = 'Constats : \nOutils : ';
}
