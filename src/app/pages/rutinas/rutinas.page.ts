import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, barbellOutline } from 'ionicons/icons';
import { RoutineService } from '../../services/routine.service';
import {
  RoutineSummary,
  DayOfWeek,
  DAYS_OF_WEEK,
} from '../../models/routine.model';

@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.page.html',
  styleUrls: ['./rutinas.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink],
})
export class RutinasPage {
  private readonly routineService = inject(RoutineService);

  /** Rutinas del usuario en sesión (con conteo de ejercicios). */
  readonly routines = signal<RoutineSummary[]>([]);

  constructor() {
    addIcons({ addOutline, trashOutline, barbellOutline });
  }

  /** Ionic llama esto cada vez que se entra a la página (recarga la lista). */
  async ionViewWillEnter(): Promise<void> {
    await this.load();
  }

  /** Etiqueta de 3 letras de un día (ej: "lun" → "Lun"). */
  dayLabel(code: DayOfWeek): string {
    return DAYS_OF_WEEK.find((d) => d.code === code)?.label ?? code;
  }

  async remove(routine: RoutineSummary): Promise<void> {
    const confirmed = confirm(`¿Eliminar la rutina "${routine.name}"?`);
    if (!confirmed) {
      return;
    }
    await this.routineService.delete(routine.id);
    await this.load();
  }

  private async load(): Promise<void> {
    this.routines.set(await this.routineService.listForCurrentUser());
  }
}
