/** Modèle de données utilisé pour l'arbre de compétence. */
export class NoeudCompetence {

  /** Constructeur pour les données obligatoires. */
  constructor(
    public id: string,
    public text: string,
    public noeudsEnfant: NoeudCompetence[]) {
  }

  /** Données calculées - statut d'affichage des enfants du noeud dans l'arbre. */
  public ouvert = false;

  /** Données calculées - niveau dans l'arbre. */
  public niveau = 0;

  /** Lien avec le parent. */
  public noeudParent: NoeudCompetence | undefined;
  public setNoeudParent(noeud: NoeudCompetence) {
    this.noeudParent = noeud;
    this.niveau = this.noeudParent.niveau + 1;
  }
}