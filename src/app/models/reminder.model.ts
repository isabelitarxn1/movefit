import { DayOfWeek } from './routine.model';

/**
 * Recordatorio configurable por el usuario para reforzar la constancia (RF08).
 * Se repite semanalmente: suena a la hora `time` en cada uno de los `days`.
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

/** Día de la semana → `weekday` de Capacitor LocalNotifications (domingo = 1). */
export const WEEKDAY_NUMBER: Record<DayOfWeek, number> = {
  dom: 1,
  lun: 2,
  mar: 3,
  mie: 4,
  jue: 5,
  vie: 6,
  sab: 7,
};
