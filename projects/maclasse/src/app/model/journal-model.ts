import { AvecIdentifiant } from "./model";

export class Journal extends AvecIdentifiant {
    public date: Date | undefined;
    public remarque?: string;
    public temps: Temps[] = [];
}

export class Temps extends AvecIdentifiant {
    public debut?: string;
    public fin?: string;
    public nom?: string;
    public objectifs?: string;
    public consignes?: string;
    public materiel?: string;
    public type?: string;
    public commentaire?: string;
    public eleves: string[] = [];
    public competences: string[] = [];
}
