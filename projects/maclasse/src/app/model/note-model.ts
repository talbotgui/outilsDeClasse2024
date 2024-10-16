export class Competence {
  public id?: string;
  public text?: string;
  public parent?: string;
}
export class Note {
  public id?: string;
  public valeur?: string;
  public idEleve?: string;
  public idItem?: string;
  public date?: Date;
  public proposition?: string;
  public constat?: string;
  public commentaire?: string;
  public outil?: string;
}
