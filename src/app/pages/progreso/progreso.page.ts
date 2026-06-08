import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  statsChartOutline,
  barbellOutline,
  calendarOutline,
  trashOutline,
  timeOutline,
  addOutline,
  closeOutline,
  saveOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { WorkoutRepository } from '../../services/workout.repository';
import { RoutineRepository } from '../../services/routine.repository';
import { WorkoutLog } from '../../models/workout.model';
import { RoutineSummary } from '../../models/routine.model';

@Component({
  selector: 'app-progreso',
  templateUrl: './progreso.page.html',
  styleUrls: ['./progreso.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule],
})
export class ProgresoPage {
  private readonly auth = inject(AuthService);
  private readonly workoutRepo = inject(WorkoutRepository);
  private readonly routineRepo = inject(RoutineRepository);

  /** Entrenamientos realizados e historial. */
  readonly workouts = signal<WorkoutLog[]>([]);

  /** Rutinas del usuario para el selector del formulario. */
  readonly routines = signal<RoutineSummary[]>([]);

  // Estados del formulario y vistas
  readonly isLogging = signal(false);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  // Variables enlazadas al formulario de registro rápido
  selectedRoutineId: string | null = null;
  customRoutineName = '';
  durationMin: number | null = null;
  loggedAt = new Date().toISOString().substring(0, 10);

  // --- Estadísticas Calculadas Reactivamente ---
  
  readonly totalWorkouts = computed(() => this.workouts().length);

  readonly totalTime = computed(() =>
    this.workouts().reduce((sum, w) => sum + w.durationMin, 0)
  );

  readonly favoriteRoutine = computed(() => {
    const logs = this.workouts();
    if (logs.length === 0) {
      return '—';
    }

    const counts: Record<string, number> = {};
    for (const w of logs) {
      counts[w.routineName] = (counts[w.routineName] || 0) + 1;
    }

    let favName = '—';
    let maxCount = 0;
    for (const name of Object.keys(counts)) {
      if (counts[name] > maxCount) {
        maxCount = counts[name];
        favName = name;
      }
    }

    return favName;
  });

  constructor() {
    addIcons({
      statsChartOutline,
      barbellOutline,
      calendarOutline,
      trashOutline,
      timeOutline,
      addOutline,
      closeOutline,
      saveOutline,
    });
  }

  /** Recarga el historial de entrenamientos y las rutinas al entrar. */
  async ionViewWillEnter(): Promise<void> {
    const current = this.auth.currentUser();
    if (current) {
      try {
        this.workouts.set(await this.workoutRepo.findByUser(current.id));
        this.routines.set(await this.routineRepo.findByUser(current.id));
      } catch (err) {
        console.error('Error al cargar datos de progreso:', err);
      }
    }
  }

  /** Abre o cierra el formulario rápido para registrar una sesión. */
  toggleLogging(): void {
    this.isLogging.update((v) => !v);
    this.error.set(null);
    if (this.isLogging()) {
      this.selectedRoutineId = '';
      this.customRoutineName = '';
      this.durationMin = null;
      this.loggedAt = new Date().toISOString().substring(0, 10);
    }
  }

  /** Valida y guarda el entrenamiento en SQLite. */
  async saveWorkout(): Promise<void> {
    this.error.set(null);
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.error.set('No hay una sesión activa.');
      return;
    }

    let name = '';
    let rId: number | null = null;

    if (this.selectedRoutineId && this.selectedRoutineId !== '') {
      rId = Number(this.selectedRoutineId);
      const found = this.routines().find((r) => r.id === rId);
      name = found ? found.name : 'Rutina';
    } else {
      if (!this.customRoutineName || !this.customRoutineName.trim()) {
        this.error.set(
          'Por favor, ingresa el nombre de la rutina o del ejercicio libre.'
        );
        return;
      }
      name = this.customRoutineName.trim();
    }

    if (
      this.durationMin === null ||
      this.durationMin === undefined ||
      isNaN(this.durationMin) ||
      this.durationMin <= 0
    ) {
      this.error.set('Por favor, ingresa una duración válida mayor a 0 minutos.');
      return;
    }

    if (!this.loggedAt) {
      this.error.set('Por favor, selecciona una fecha válida.');
      return;
    }

    this.loading.set(true);

    try {
      await this.workoutRepo.create(userId, {
        routineId: rId,
        routineName: name,
        durationMin: this.durationMin,
        loggedAt: this.loggedAt,
      });

      // Recarga el historial de entrenamientos actualizado
      this.workouts.set(await this.workoutRepo.findByUser(userId));
      this.isLogging.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'Error al registrar el entrenamiento.');
    } finally {
      this.loading.set(false);
    }
  }

  /** Elimina un registro del historial previa confirmación. */
  async deleteWorkout(id: number): Promise<void> {
    const confirmed = confirm(
      '¿Eliminar esta sesión de entrenamiento del historial?'
    );
    if (!confirmed) {
      return;
    }

    try {
      await this.workoutRepo.deleteById(id);
      const userId = this.auth.currentUser()?.id;
      if (userId) {
        this.workouts.set(await this.workoutRepo.findByUser(userId));
      }
    } catch (err) {
      console.error('Error al eliminar entrenamiento:', err);
    }
  }

  /** Formatea la fecha guardada (YYYY-MM-DD) a formato amigable en español. */
  formatDate(isoDateString: string): string {
    try {
      const parts = isoDateString.split('-');
      if (parts.length === 3) {
        const date = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
      const date = new Date(isoDateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoDateString;
    }
  }
}

