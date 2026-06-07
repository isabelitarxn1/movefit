import { RoutineInput, RoutineExerciseInput } from '../models/routine.model';
import { NewRoutine } from '../services/routine.repository';

const SERIES_RANGE = { min: 1, max: 20 };
const REPS_RANGE = { min: 0, max: 100 };
const DURATION_RANGE = { min: 0, max: 3600 };

/** Resultado de parsear el formulario de rutina. */
export type RoutineParseResult =
  | { ok: true; data: NewRoutine }
  | { ok: false; error: string };

/**
 * Valida y normaliza los datos del formulario de crear/editar rutina (RF03).
 *
 * Reglas:
 *  - Nombre obligatorio.
 *  - Al menos un día asignado.
 *  - Al menos un ejercicio.
 *  - Cada ejercicio con series/repeticiones/duración dentro de rangos razonables.
 *
 * @param input Datos crudos del formulario.
 * @returns Los datos validados, o un mensaje de error a mostrar.
 */
export function parseRoutine(input: RoutineInput): RoutineParseResult {
  const name = input.name?.trim() ?? '';
  if (!name) {
    return { ok: false, error: 'El nombre de la rutina es obligatorio.' };
  }

  if (input.days.length === 0) {
    return { ok: false, error: 'Selecciona al menos un día para la rutina.' };
  }

  if (input.exercises.length === 0) {
    return { ok: false, error: 'Agrega al menos un ejercicio a la rutina.' };
  }

  for (const ex of input.exercises) {
    const error = validateExercise(ex);
    if (error) {
      return { ok: false, error };
    }
  }

  return {
    ok: true,
    data: { name, days: input.days, exercises: input.exercises },
  };
}

/** Valida los parámetros de un ejercicio dentro de la rutina. */
function validateExercise(ex: RoutineExerciseInput): string | null {
  if (ex.series < SERIES_RANGE.min || ex.series > SERIES_RANGE.max) {
    return `Las series deben estar entre ${SERIES_RANGE.min} y ${SERIES_RANGE.max}.`;
  }
  if (ex.reps < REPS_RANGE.min || ex.reps > REPS_RANGE.max) {
    return `Las repeticiones deben estar entre ${REPS_RANGE.min} y ${REPS_RANGE.max}.`;
  }
  if (ex.durationSec < DURATION_RANGE.min || ex.durationSec > DURATION_RANGE.max) {
    return `La duración debe estar entre ${DURATION_RANGE.min} y ${DURATION_RANGE.max} segundos.`;
  }
  return null;
}
