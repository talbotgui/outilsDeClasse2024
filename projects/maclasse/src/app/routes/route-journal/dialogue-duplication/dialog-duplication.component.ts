import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AbstractComponent } from '../../../directives/abstract.component';
import { Journal, Temps } from '../../../model/journal-model';
import { ContexteService } from '../../../service/contexte-service';
import { MaClasseService } from '../../../service/maclasse-service';

@Component({
  selector: 'dialog-duplication', templateUrl: './dialog-duplication.component.html',
  standalone: true, imports: [
    // Angular
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatTooltipModule,
    // Matérial
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule
  ]
})
export class DialogDuplicationComponent extends AbstractComponent {

  /** Liste des journaux chargés */
  public journaux: Journal[] | undefined;

  /** Journal à dupliquer (optionnel) */
  @Input()
  public journal: Journal | undefined;

  /** Temps à dupliquer (optionnel) */
  @Input()
  public temps: Temps | undefined;

  /** Date ciblée */
  public dateCible: Date | undefined;

  /** Un constructeur pour se faire injecter les dépendances. */
  constructor(private contexteService: ContexteService, private maclasseService: MaClasseService, private dialogRef: MatDialogRef<DialogDuplicationComponent>) { super(); }

  /** Fermeture de la popup */
  public annuler(): void {
    this.dialogRef.close();
  }

  /** Duplication */
  public dupliquer(): void {

    // Si pas de date ou pas de données, fin
    if (!this.dateCible || !this.journaux) {
      return;
    }

    // Recherche du journal à cette date
    const journalCible = this.maclasseService.rechercherOuCreerJournal(this.journaux, this.dateCible)

    // Si duplication du temps
    if (this.journal && journalCible) {
      this.maclasseService.dupliquerJournal(this.journal, journalCible);
    }

    // Si duplication de journal
    else if (this.temps && journalCible) {
      this.maclasseService.dupliquerTemps(this.temps, journalCible);
    }

    this.dialogRef.close();
  }
}
