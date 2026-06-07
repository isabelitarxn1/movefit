/**
 * Ejercicio del catálogo predefinido (RF05).
 *
 * @property id           Identificador asignado por la base de datos.
 * @property name         Nombre del ejercicio (ej: "Sentadillas").
 * @property description  Descripción breve de qué trabaja.
 * @property instructions Instrucciones de ejecución paso a paso.
 * @property category     Grupo o categoría (ej: "Piernas", "Pecho", "Cardio").
 */
export interface Exercise {
  id: number;
  name: string;
  description: string;
  instructions: string;
  category: string;
}

/**
 * Datos de un ejercicio del catálogo antes de tener id (para sembrarlo).
 */
export type ExerciseSeed = Omit<Exercise, 'id'>;
