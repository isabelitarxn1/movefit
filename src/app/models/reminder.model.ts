import { DayOfWeek } from './routine.model';

/**
 * Recordatorio configurable por el usuario para reforzar la constancia (RF08).
 *
 * Cada recordatorio se repite semanalmente: suena a la hora `time` en cada uno
 * de los `days` seleccionados. Se traduce a una o varias notificaciones locales
 * del sistema operativo (ver NotificationService).
 *
 * @property id        Identificador asignado por la base de datos.
 * @property userId    Dueño del recordatorio (FK a users).
 * @property title     Título corto que aparece en la notificación (ej: "¡A entrenar!").
 * @property message   Cuerpo del mensaje (ej: "Es hora de tu rutina de pierna").
 * @property time      Hora del recordatorio en formato 24h "HH:MM".
 * @property days      Días de la semana en que debe repetirse.
 * @property enabled   Si está activo; los desactivados no programan notificaciones.
 * @property createdAt Fecha de creación en formato ISO 8601.
 */
export interface Reminder {
  id: number;
  userId: number;
  title: string;
  message: string;
  time: string;
  days: DayOfWeek[];
  enabled: boolean;
  createdAt: string;
}

/** Datos que envía el formulario de crear/editar recordatorio (RF08). */
export interface ReminderInput {
  title: string;
  message: string;
  time: string;
  days: DayOfWeek[];
  enabled: boolean;
}

/**
 * Mapea cada día de la semana al número de `weekday` que espera Capacitor
 * LocalNotifications, donde la semana empieza en domingo = 1 ... sábado = 7.
 * Se usa para programar la repetición semanal de cada recordatorio.
 */
export const WEEKDAY_NUMBER: Record<DayOfWeek, number> = {
  dom: 1,
  lun: 2,
  mar: 3,
  mie: 4,
  jue: 5,
  vie: 6,
  sab: 7,
};
