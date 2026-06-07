import { Exercise } from './exercise.model';

/** Día de la semana asignable a una rutina (RF03). */
export type DayOfWeek = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

/** Orden y etiquetas legibles de los días, para mostrar en la UI. */
export const DAYS_OF_WEEK: { code: DayOfWeek; label: string }[] = [
  { code: 'lun', label: 'Lun' },
  { code: 'mar', label: 'Mar' },
  { code: 'mie', label: 'Mié' },
  { code: 'jue', label: 'Jue' },
  { code: 'vie', label: 'Vie' },
  { code: 'sab', label: 'Sáb' },
  { code: 'dom', label: 'Dom' },
];

/**
 * Cabecera de una rutina de ejercicio (RF03/RF04).
 *
 * @property id        Identificador asignado por la base de datos.
 * @property userId    Dueño de la rutina (FK a users).
 * @property name      Nombre de la rutina (ej: "Pierna y glúteo").
 * @property days      Días de la semana asignados.
 * @property createdAt Fecha de creación en formato ISO 8601.
 */
export interface Routine {
  id: number;
  userId: number;
  name: string;
  days: DayOfWeek[];
  createdAt: string;
}

/**
 * Un ejercicio dentro de una rutina, con sus parámetros (tabla puente).
 *
 * @property id          Identificador de la fila puente.
 * @property exerciseId  Ejercicio del catálogo (FK a exercises).
 * @property series      Número de series.
 * @property reps        Repeticiones por serie.
 * @property durationSec Duración en segundos (para ejercicios por tiempo).
 * @property position    Orden del ejercicio dentro de la rutina.
 */
export interface RoutineExercise {
  id: number;
  exerciseId: number;
  series: number;
  reps: number;
  durationSec: number;
  position: number;
}

/**
 * Rutina completa: la cabecera más sus ejercicios, ya enlazados con los datos
 * del catálogo para poder mostrar nombre, categoría, etc.
 */
export interface RoutineDetail extends Routine {
  exercises: (RoutineExercise & { exercise: Exercise })[];
}

/** Parámetros de un ejercicio al crear/editar una rutina. */
export interface RoutineExerciseInput {
  exerciseId: number;
  series: number;
  reps: number;
  durationSec: number;
}

/** Datos que envía el formulario de crear/editar rutina (RF03). */
export interface RoutineInput {
  name: string;
  days: DayOfWeek[];
  exercises: RoutineExerciseInput[];
}
