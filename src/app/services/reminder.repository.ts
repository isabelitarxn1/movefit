import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { DayOfWeek } from '../models/routine.model';
import { Reminder, ReminderInput } from '../models/reminder.model';

/**
 * Maneja el guardado y la consulta de recordatorios en la base de datos (RF08).
 * Es el único lugar que escribe SQL sobre la tabla `reminders`.
 */
@Injectable({ providedIn: 'root' })
export class ReminderRepository {
  private readonly database = inject(DatabaseService);

  /**
   * Crea un recordatorio para un usuario y persiste. Devuelve el id generado.
   */
  async create(userId: number, data: ReminderInput): Promise<number> {
    const db = this.database.getConnection();
    const createdAt = new Date().toISOString();

    const res = await db.run(
      `INSERT INTO reminders (userId, title, message, time, days, enabled, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.title.trim(),
        data.message.trim(),
        data.time,
        this.serializeDays(data.days),
        data.enabled ? 1 : 0,
        createdAt,
      ]
    );

    await this.database.persist();
    return res.changes?.lastId ?? 0;
  }

  /**
   * Reemplaza el contenido de un recordatorio existente.
   */
  async update(reminderId: number, data: ReminderInput): Promise<void> {
    const db = this.database.getConnection();
    await db.run(
      `UPDATE reminders
       SET title = ?, message = ?, time = ?, days = ?, enabled = ?
       WHERE id = ?`,
      [
        data.title.trim(),
        data.message.trim(),
        data.time,
        this.serializeDays(data.days),
        data.enabled ? 1 : 0,
        reminderId,
      ]
    );
    await this.database.persist();
  }

  /**
   * Activa o desactiva un recordatorio sin tocar el resto de sus datos.
   */
  async setEnabled(reminderId: number, enabled: boolean): Promise<void> {
    const db = this.database.getConnection();
    await db.run(`UPDATE reminders SET enabled = ? WHERE id = ?`, [
      enabled ? 1 : 0,
      reminderId,
    ]);
    await this.database.persist();
  }

  /**
   * Lista los recordatorios de un usuario, de los más recientes a los más antiguos.
   */
  async findByUser(userId: number): Promise<Reminder[]> {
    const db = this.database.getConnection();
    const res = await db.query(
      `SELECT * FROM reminders WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    return (res.values ?? []).map((row) => this.toReminder(row));
  }

  /** Elimina un recordatorio. */
  async deleteById(reminderId: number): Promise<void> {
    const db = this.database.getConnection();
    await db.run(`DELETE FROM reminders WHERE id = ?`, [reminderId]);
    await this.database.persist();
  }

  // --- Helpers --------------------------------------------------------------

  /** Los días se guardan como texto CSV ("lun,mie,vie"); aquí se (de)serializan. */
  private serializeDays(days: DayOfWeek[]): string {
    return days.join(',');
  }

  private deserializeDays(csv: string): DayOfWeek[] {
    return csv ? (csv.split(',') as DayOfWeek[]) : [];
  }

  private toReminder(row: any): Reminder {
    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      message: row.message,
      time: row.time,
      days: this.deserializeDays(row.days),
      // SQLite no tiene booleanos: se guardan como 0/1.
      enabled: row.enabled === 1,
      createdAt: row.createdAt,
    };
  }
}
