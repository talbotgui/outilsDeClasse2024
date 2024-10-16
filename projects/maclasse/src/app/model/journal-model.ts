export class Journal {
    public date: Date | undefined;
    public remarque?: string;
    public temps: Temps[] = [];
}

export class Temps {
    public debut?: string;
    public fin?: string;
    public nom?: string;
    public type?: string;
    public commentaire?: string;
    public eleves: string[] = [];
    public competences: string[] = [];
}
