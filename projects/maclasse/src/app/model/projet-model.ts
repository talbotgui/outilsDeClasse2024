import { AvecIdentifiant } from "./model";

export class Projet extends AvecIdentifiant {
  public nom?: string;
  public sousProjetParPeriode: SousProjetParPeriode[] = [];
}

export class SousProjetParPeriode extends AvecIdentifiant {
  public idPeriode?: string;
  public idCompetences: string[] = [];
}
