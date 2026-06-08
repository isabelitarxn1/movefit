/**
 * Representa un registro de entrenamiento realizado por un usuario (RF06, RF07).
 *
 * @property id           Identificador autoincremental de la sesión de entrenamiento.
 * @property userId       ID del usuario que realizó el entrenamiento.
 * @property routineId    ID de la rutina asociada (puede ser null si se hace ejercicio libre).
 * @property routineName  Nombre de la rutina o descripción del ejercicio libre.
 * @property durationMin  Duración de la sesión en minutos.
 * @property loggedAt     Fecha en que se realizó el entrenamiento (YYYY-MM-DD).
 */
export interface WorkoutLog {
  id: number;
  userId: number;
  routineId: number | null;
  routineName: string;
  durationMin: number;
  loggedAt: string;
}

/**
 * Datos requeridos para registrar un entrenamiento en el formulario.
 */
export interface WorkoutInput {
  routineId: number | null;
  routineName: string;
  durationMin: number;
  loggedAt: string;
}
