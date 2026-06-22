import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  LocalNotificationSchema,
} from '@capacitor/local-notifications';
import { Reminder, WEEKDAY_NUMBER } from '../models/reminder.model';

/**
 * Traduce los recordatorios del usuario (RF08) a notificaciones locales del
 * sistema operativo y gestiona los permisos.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** Pide permiso para mostrar notificaciones. Devuelve true si se concedió. */
  async requestPermission(): Promise<boolean> {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  /** Indica si el permiso de notificaciones ya está concedido. */
  async hasPermission(): Promise<boolean> {
    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
  }

  /**
   * Cancela lo pendiente y reprograma solo los recordatorios activos.
   * Llamar tras cada cambio (crear, editar, activar/desactivar o borrar).
   */
  async sync(reminders: Reminder[]): Promise<void> {
    await this.cancelAll();

    const toSchedule: LocalNotificationSchema[] = [];
    for (const reminder of reminders) {
      if (reminder.enabled) {
        toSchedule.push(...this.buildNotifications(reminder));
      }
    }

    if (toSchedule.length > 0) {
      await LocalNotifications.schedule({ notifications: toSchedule });
    }
  }

  /** Cancela todas las notificaciones pendientes (programadas y aún no mostradas). */
  async cancelAll(): Promise<void> {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  }

  /**
   * Convierte un recordatorio en una notificación por día, con repetición
   * semanal. El id `reminder.id * 10 + weekday` es único y estable (weekday 1-7).
   */
  private buildNotifications(reminder: Reminder): LocalNotificationSchema[] {
    const { hour, minute } = this.parseTime(reminder.time);

    return reminder.days.map((day) => {
      const weekday = WEEKDAY_NUMBER[day];
      return {
        id: reminder.id * 10 + weekday,
        title: reminder.title,
        body: reminder.message.trim() || '¡Es hora de tu rutina! 💪',
        schedule: {
          on: { weekday, hour, minute },
          repeats: true,
          allowWhileIdle: true,
        },
      };
    });
  }

  /** Parte una hora "HH:MM" en sus componentes numéricos. */
  private parseTime(time: string): { hour: number; minute: number } {
    const [h, m] = time.split(':');
    return { hour: Number(h), minute: Number(m) };
  }
}
