import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { WorkoutLog, WorkoutInput } from '../models/workout.model';

/**
 * Gestiona el almacenamiento e historial de entrenamientos en SQLite (RF06, RF07).
 */
@Injectable({ providedIn: 'root' })
export class WorkoutRepository {
  private readonly database = inject(DatabaseService);

  /**
   * Registra un entrenamiento realizado por un usuario.
   */
  async create(userId: number, data: WorkoutInput): Promise<number> {
    const db = this.database.getConnection();
    const res = await db.run(
      `INSERT INTO workout_logs (userId, routineId, routineName, durationMin, loggedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        data.routineId,
        data.routineName.trim(),
        data.durationMin,
        data.loggedAt,
      ]
    );

    await this.database.persist();
    return res.changes?.lastId ?? 0;
  }

  /**
   * Obtiene todos los entrenamientos de un usuario, ordenados del más reciente al más antiguo.
   */
  async findByUser(userId: number): Promise<WorkoutLog[]> {
    const db = this.database.getConnection();
    const res = await db.query(
      `SELECT * FROM workout_logs
       WHERE userId = ?
       ORDER BY loggedAt DESC, id DESC`,
      [userId]
    );

    return (res.values ?? []).map((row) => ({
      id: row.id,
      userId: row.userId,
      routineId: row.routineId,
      routineName: row.routineName,
      durationMin: row.durationMin,
      loggedAt: row.loggedAt,
    }));
  }

  /**
   * Elimina un registro del historial de entrenamientos.
   */
  async deleteById(id: number): Promise<void> {
    const db = this.database.getConnection();
    await db.run(`DELETE FROM workout_logs WHERE id = ?`, [id]);
    await this.database.persist();
  }
}
