
export class ModelUtil {

  /** Génération d'un ID unique */
  public static getUID(): string {
    const n = 8;
    return new Array(n + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, n);
  }

  /** Génération d'une Map des jours de la semaine*/
  public static creerMapJoursDeLaSemaine(): Map<string, string> {
    const map = new Map();
    map.set('0', 'Dimanche');
    map.set('1', 'Lundi');
    map.set('2', 'Mardi');
    map.set('3', 'Mercredi');
    map.set('4', 'Jeudi');
    map.set('5', 'Vendredi');
    map.set('6', 'Samedi');
    return map;
  }

  /** Génération d'une liste d'heures */
  public static creerListeHoraires(): string[] {
    const tempsDisponibles = [];
    for (let i = 8; i < 18; i++) {
      tempsDisponibles.push(i + 'h00');
      tempsDisponibles.push(i + 'h15');
      tempsDisponibles.push(i + 'h30');
      tempsDisponibles.push(i + 'h45');
    }
    return tempsDisponibles;
  }
}
