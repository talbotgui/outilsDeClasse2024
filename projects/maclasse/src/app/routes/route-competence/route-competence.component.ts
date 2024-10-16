import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { ComposantSelectionCompetenceComponent } from '../../composants/composant-selectioncompetence/composant-selectioncompetence.component';
import { AbstractComponent } from '../../directives/abstract.component';
import { NoeudCompetence } from '../../model/arbre-model';
import { Competence } from '../../model/note-model';
import { ContexteService } from '../../service/contexte-service';

@Component({
    selector: 'route-competence', templateUrl: './route-competence.component.html', styleUrl: './route-competence.component.scss',
    standalone: true, imports: [
        // Angular
        CommonModule, FormsModule,
        // Matérial
        ReactiveFormsModule, MatButtonModule, MatTooltipModule, MatTreeModule,
        // FontAwesome
        FontAwesomeModule,
        // Pour le copier/coller
        ClipboardModule,
        // Composant de l'application
        ComposantSelectionCompetenceComponent
    ]
})
export class RouteCompetenceComponent extends AbstractComponent implements OnInit {

    /** Source de données de l'arbre (mode "nested nodes" car moins de code TS et donc plus simple). */
    public dataSource = new MatTreeNestedDataSource<NoeudCompetence>();

    /** Competences chargées. */
    public flagCompetencesChargees = false;

    /** Données chargées dans le datasource mais sous forme de map */
    private mapNoeuds = new Map<string, NoeudCompetence>();

    /** Objet de controle de l'arbre (deprécié mais aucune documentation de l'usage sans cette classe au 17/09/2024). */
    public treeControl = new NestedTreeControl<NoeudCompetence>(n => n.noeudsEnfant);

    /** Constructeur pour injection des dépendances. */
    public constructor(private contexteService: ContexteService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location) { super(); }

    /** Au chargement du composant */
    public ngOnInit(): void {

        // Au chargement des données, récupéation de  la liste des élèves
        const sub = this.contexteService.obtenirUnObservableDuChargementDesDonneesDeClasse().pipe(
            tap(donnees => {
                // Si on a des données
                if (donnees && donnees.competences) {

                    // Création de la liste des noeuds racine
                    const noeudsRacine: NoeudCompetence[] = [];
                    this.dataSource.data = noeudsRacine;

                    // Initialisation de la map utilisée durant la création du jdd de l'arbre
                    this.mapNoeuds = new Map<string, NoeudCompetence>();

                    // Pour chaque compétence complète
                    donnees.competences.forEach(c => {
                        if (c.id && c.text && c.parent) {

                            // Création de la compétence
                            const nouvelleCompetence = new NoeudCompetence(c.id, c.text, []);
                            this.mapNoeuds.set(c.id, nouvelleCompetence);
                            // Rechercher du parent
                            if (c.parent == '#') {
                                noeudsRacine.push(nouvelleCompetence);
                            } else {
                                const noeudParent = this.mapNoeuds.get(c.parent);
                                if (noeudParent) {
                                    nouvelleCompetence.noeudParent = noeudParent;
                                    noeudParent.noeudsEnfant.push(nouvelleCompetence);
                                }
                            }
                        }
                    });

                    // Pour indiquer que les données sont chargées
                    this.flagCompetencesChargees = true;
                }
            })
        ).subscribe();
        super.declarerSouscription(sub);
    }

    /** Pour savoir si une competence a des enfants. */
    public estUneCompetenceParente(_: number, node: NoeudCompetence): boolean {
        return node.noeudsEnfant && node.noeudsEnfant.length > 0;
    }

    /** A la sélection d'un compétence dans le sélecteur de compétence. */
    public selectionnerCompetence(competence: Competence): void {

        // Collapse total
        this.treeControl.collapseAll();

        // Si la compétence est bien un noeud
        if (competence && competence.id) {
            const noeud = this.mapNoeuds.get(competence.id);
            if (noeud) {

                // Création du chemin vers le bon noeud
                const listeNoeud = [];
                let n: NoeudCompetence | undefined = noeud;
                while (n) {
                    listeNoeud.push(n);
                    n = n.noeudParent;
                }

                // En partant du dernier, expand de chaque noeud
                listeNoeud.reverse().forEach(n => this.treeControl.expand(n));
            }
        }
    }
}
