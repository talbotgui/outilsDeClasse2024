import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { AbstractComponent } from '../directives/abstract.component';
import { MessageAafficher } from '../model/message-model';
import { ContexteService } from '../service/contexte-service';

@Component({
    selector: '[div-message]', templateUrl: './div-message.component.html', styleUrl: './div-message.component.scss',
    standalone: true, imports: []
})
export class DivMessageComponent extends AbstractComponent implements OnInit {

    /** Message à afficher */
    public messagesAafficher: MessageAafficher[] = [];

    /** Constructeur pour injection des dépendances. */
    public constructor(private contexteService: ContexteService) { super(); }

    /** Au chargement du composant */
    public ngOnInit(): void {

        // à chaque message généré, on l'affiche en masquant le précédent
        const sub = this.contexteService.obtenirUnObservableSurLesMessagesGeneraux()
            .pipe(tap(message => {
                if (message) {
                    // on retire tout message venant de la même source
                    this.messagesAafficher = this.messagesAafficher.filter(m => m.codeEmetteurDuMessage !== message.codeEmetteurDuMessage);
                    // on ajoute le nouveau message (s'il n'est pas vide)
                    if (message.message) {
                        this.messagesAafficher.push(message);
                    }
                    // pour remettre l'utilisateur en haut de la page
                    window.scrollTo(0, 0);
                }
            }))
            .subscribe();
        super.declarerSouscription(sub);
    }
}
