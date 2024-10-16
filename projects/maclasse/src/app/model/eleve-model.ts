export class Eleve {
  static readonly CODE_STATUT_DANS_LA_CLASSE = '2';

  public id?: string;
  public nom?: string;
  public prenom?: string;
  public dateNaissance: Date | undefined;
  public contacts: ContactEleve[] = [];
  public absences: AbsenceEleve[] = [];
  public statut?: string;
  public bilans?: string;
  public cursus: CursusEleve[] = [];
  public dateAdmission: Date | undefined;
  public accueil?: string;
  public datesPPA?: string;
  public datesPAP?: string;
  public datesESS?: string;
  public droitImage?: string;
  public autorisationBaignade?: string;
  public inclusion: InclusionEleve = new InclusionEleve();
}

export class CursusEleve {
  public annee: number = 0;
  public niveau?: string;
  public etablissement?: string;
  public accompagnement?: string;
}

export class ContactEleve {
  public type?: string;
  public nom?: string;
  public email?: string;
  public telephone?: string;
  public adressePostale?: string;
}

export class InclusionEleve {
  public ecoleNom?: string;
  public ecoleAdresse?: string;
  public nomContact?: string;
  public emailContact?: string;
  public telContact?: string;
  public niveau?: string;
  public enseignant?: string;
  public telephoneEnseignant?: string;
}

export class AbsenceEleve {
  public raison?: string;
  public jour?: string;
  public frequence?: number;
  public heureDebut?: string;
  public heureFin?: string;
}
