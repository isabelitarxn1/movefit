import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  DayOfWeek,
  Routine,
  RoutineDetail,
  RoutineExerciseInput,
  RoutineSummary,
} from '../models/routine.model';
import { Exercise } from '../models/exercise.model';

/** Datos de una rutina ya validados, listos para guardar. */
export interface NewRoutine {
  name: string;
  days: DayOfWeek[];
  durationMin: number;
  exercises: RoutineExerciseInput[];
}

/**
 * Maneja el guardado y la consulta de rutinas en la base de datos (RF03/RF04).
 * Es el único lugar que escribe SQL sobre `routines` y `routine_exercises`.
 */
@Injectable({ providedIn: 'root' })
export class RoutineRepository {
  private readonly database = inject(DatabaseService);

  /**
   * Crea una rutina con sus ejercicios y persiste. Devuelve el id generado.
   */
  async create(userId: number, data: NewRoutine): Promise<number> {
    const db = this.database.getConnection();
    const createdAt = new Date().toISOString();

    const res = await db.run(
      `INSERT INTO routines (userId, name, days, durationMin, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [userId, data.name, this.serializeDays(data.days), data.durationMin, createdAt]
    );
    const routineId = res.changes?.lastId ?? 0;

    await this.insertExercises(routineId, data.exercises);
    await this.database.persist();
    return routineId;
  }

  /**
   * Reemplaza el contenido de una rutina existente (nombre, días y ejercicios).
   */
  async update(routineId: number, data: NewRoutine): Promise<void> {
    const db = this.database.getConnection();

    await db.run(`UPDATE routines SET name = ?, days = ?, durationMin = ? WHERE id = ?`, [
      data.name,
      this.serializeDays(data.days),
      data.durationMin,
      routineId,
    ]);

    // Forma simple y segura: borrar los ejercicios anteriores y reinsertar.
    await db.run(`DELETE FROM routine_exercises WHERE routineId = ?`, [routineId]);
    await this.insertExercises(routineId, data.exercises);
    await this.database.persist();
  }

  /**
   * Lista las rutinas de un usuario (con el conteo de ejercicios de cada una),
   * de la más reciente a la más antigua.
   */
  async findByUser(userId: number): Promise<RoutineSummary[]> {
    const db = this.database.getConnection();
    const res = await db.query(
      `SELECT r.*,
              (SELECT COUNT(*) FROM routine_exercises re WHERE re.routineId = r.id) AS exerciseCount
       FROM routines r
       WHERE r.userId = ?
       ORDER BY r.createdAt DESC`,
      [userId]
    );
    return (res.values ?? []).map((row) => ({
      ...this.toRoutine(row),
      exerciseCount: row.exerciseCount ?? 0,
    }));
  }

  /** Devuelve una rutina con sus ejercicios enlazados al catálogo, o null. */
  async findDetail(routineId: number): Promise<RoutineDetail | null> {
    const db = this.database.getConnection();
    const res = await db.query('SELECT * FROM routines WHERE id = ? LIMIT 1', [routineId]);
    const row = res.values?.[0];
    if (!row) {
      return null;
    }

    const exRes = await db.query(
      `SELECT re.id, re.exerciseId, re.series, re.reps, re.durationSec, re.position,
              e.name, e.description, e.instructions, e.category
       FROM routine_exercises re
       JOIN exercises e ON e.id = re.exerciseId
       WHERE re.routineId = ?
       ORDER BY re.position`,
      [routineId]
    );

    const exercises = (exRes.values ?? []).map((r) => this.toRoutineExercise(r));
    return { ...this.toRoutine(row), exercises };
  }

  /** Elimina una rutina y sus ejercicios asociados. */
  async deleteById(routineId: number): Promise<void> {
    const db = this.database.getConnection();
    await db.run(`DELETE FROM routine_exercises WHERE routineId = ?`, [routineId]);
    await db.run(`DELETE FROM routines WHERE id = ?`, [routineId]);
    await this.database.persist();
  }

  // --- Helpers --------------------------------------------------------------

  private async insertExercises(
    routineId: number,
    exercises: RoutineExerciseInput[]
  ): Promise<void> {
    const db = this.database.getConnection();
    let position = 0;
    for (const ex of exercises) {
      await db.run(
        `INSERT INTO routine_exercises
           (routineId, exerciseId, series, reps, durationSec, position)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [routineId, ex.exerciseId, ex.series, ex.reps, ex.durationSec, position++]
      );
    }
  }

  /** Los días se guardan como texto CSV ("lun,mie,vie"); aquí se (de)serializan. */
  private serializeDays(days: DayOfWeek[]): string {
    return days.join(',');
  }

  private deserializeDays(csv: string): DayOfWeek[] {
    return csv ? (csv.split(',') as DayOfWeek[]) : [];
  }

  private toRoutine(row: any): Routine {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      days: this.deserializeDays(row.days),
      durationMin: row.durationMin ?? 0,
      createdAt: row.createdAt,
    };
  }

  private toRoutineExercise(row: any): RoutineDetail['exercises'][number] {
    const exercise: Exercise = {
      id: row.exerciseId,
      name: row.name,
      description: row.description,
      instructions: row.instructions,
      category: row.category,
    };
    return {
      id: row.id,
      exerciseId: row.exerciseId,
      series: row.series,
      reps: row.reps,
      durationSec: row.durationSec,
      position: row.position,
      exercise,
    };
  }
}
