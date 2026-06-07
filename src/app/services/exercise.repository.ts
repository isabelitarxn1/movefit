import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { Exercise } from '../models/exercise.model';
import { EXERCISE_CATALOG } from '../data/exercise-catalog';

/**
 * Acceso a datos del catálogo de ejercicios (RF05).
 * Es el único lugar que consulta la tabla `exercises`.
 */
@Injectable({ providedIn: 'root' })
export class ExerciseRepository {
  private readonly database = inject(DatabaseService);

  /** Devuelve todos los ejercicios del catálogo, ordenados por categoría y nombre. */
  async findAll(): Promise<Exercise[]> {
    const db = this.database.getConnection();
    const res = await db.query('SELECT * FROM exercises ORDER BY category, name');
    return (res.values ?? []) as Exercise[];
  }

  /** Busca un ejercicio por id. Devuelve null si no existe. */
  async findById(id: number): Promise<Exercise | null> {
    const db = this.database.getConnection();
    const res = await db.query('SELECT * FROM exercises WHERE id = ? LIMIT 1', [id]);
    const row = res.values?.[0];
    return row ? (row as Exercise) : null;
  }

  /**
   * Siembra el catálogo predefinido si la tabla está vacía. Idempotente:
   * en arranques posteriores no hace nada.
   */
  async seedCatalog(): Promise<void> {
    const db = this.database.getConnection();
    const countRes = await db.query('SELECT COUNT(*) AS total FROM exercises');
    const total = Number(countRes.values?.[0]?.total ?? 0);
    if (total > 0) {
      return;
    }

    for (const ex of EXERCISE_CATALOG) {
      await db.run(
        `INSERT INTO exercises (name, description, instructions, category)
         VALUES (?, ?, ?, ?)`,
        [ex.name, ex.description, ex.instructions, ex.category]
      );
    }

    await this.database.persist();
  }
}
