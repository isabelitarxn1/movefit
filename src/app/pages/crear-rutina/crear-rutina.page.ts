import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, trashOutline, arrowBackOutline } from 'ionicons/icons';
import { ExerciseRepository } from '../../services/exercise.repository';
import { RoutineService } from '../../services/routine.service';
import { Exercise } from '../../models/exercise.model';
import { DayOfWeek, DAYS_OF_WEEK, RoutineInput } from '../../models/routine.model';

/** Un ejercicio elegido para la rutina, con sus parámetros editables. */
interface SelectedExercise {
  exercise: Exercise;
  series: number;
  reps: number;
  durationSec: number;
}

@Component({
  selector: 'app-crear-rutina',
  templateUrl: './crear-rutina.page.html',
  styleUrls: ['./crear-rutina.page.scss'],
  standalone: true,
  imports: [IonContent, IonModal, IonIcon, FormsModule, RouterLink],
})
export class CrearRutinaPage {
  private readonly exerciseRepo = inject(ExerciseRepository);
  private readonly routineService = inject(RoutineService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly days = DAYS_OF_WEEK;
  readonly catalog = signal<Exercise[]>([]);
  readonly modalOpen = signal(false);
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);
  readonly isEdit = signal(false);

  /** Id de la rutina en edición, o null si es una rutina nueva. */
  private routineId: number | null = null;

  name = '';
  selectedDays: DayOfWeek[] = [];
  exercises: SelectedExercise[] = [];

  constructor() {
    addIcons({ addOutline, closeOutline, trashOutline, arrowBackOutline });
  }

  /**
   * Ionic reutiliza la página (no la destruye), así que inicializamos en
   * ionViewWillEnter —que corre en cada entrada— y reseteamos el formulario,
   * para no arrastrar los datos de una rutina anterior.
   */
  async ionViewWillEnter(): Promise<void> {
    if (this.catalog().length === 0) {
      this.catalog.set(await this.exerciseRepo.findAll());
    }

    this.resetForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.routineId = Number(idParam);
      const detail = await this.routineService.getDetail(this.routineId);
      if (detail) {
        this.name = detail.name;
        this.selectedDays = [...detail.days];
        this.exercises = detail.exercises.map((e) => ({
          exercise: e.exercise,
          series: e.series,
          reps: e.reps,
          durationSec: e.durationSec,
        }));
        this.isEdit.set(true);
      }
    }
  }

  private resetForm(): void {
    this.name = '';
    this.selectedDays = [];
    this.exercises = [];
    this.routineId = null;
    this.isEdit.set(false);
    this.error.set(null);
    this.saving.set(false);
  }

  toggleDay(code: DayOfWeek): void {
    const i = this.selectedDays.indexOf(code);
    if (i >= 0) {
      this.selectedDays.splice(i, 1);
    } else {
      this.selectedDays.push(code);
    }
  }

  isDaySelected(code: DayOfWeek): boolean {
    return this.selectedDays.includes(code);
  }

  openCatalog(): void {
    this.modalOpen.set(true);
  }

  closeCatalog(): void {
    this.modalOpen.set(false);
  }

  addExercise(exercise: Exercise): void {
    this.exercises.push({ exercise, series: 3, reps: 12, durationSec: 0 });
    this.modalOpen.set(false);
  }

  removeExercise(index: number): void {
    this.exercises.splice(index, 1);
  }

  async save(): Promise<void> {
    this.error.set(null);
    this.saving.set(true);

    const input: RoutineInput = {
      name: this.name,
      days: this.selectedDays,
      exercises: this.exercises.map((e) => ({
        exerciseId: e.exercise.id,
        series: e.series,
        reps: e.reps,
        durationSec: e.durationSec,
      })),
    };

    const result = this.routineId
      ? await this.routineService.update(this.routineId, input)
      : await this.routineService.create(input);
    this.saving.set(false);

    if (result.ok) {
      this.router.navigateByUrl('/tabs/rutinas');
    } else {
      this.error.set(result.error ?? 'No se pudo guardar la rutina.');
    }
  }
}
