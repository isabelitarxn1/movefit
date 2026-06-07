import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { RoutineRepository } from './routine.repository';
import { parseRoutine } from '../validators/routine.validator';
import { Routine, RoutineDetail, RoutineInput } from '../models/routine.model';

/** Resultado de crear o editar una rutina. */
export interface RoutineResult {
  ok: boolean;
  error?: string;
  id?: number;
}

/**
 * Orquesta la gestión de rutinas (RF03/RF04): valida la entrada, resuelve el
 * usuario en sesión y delega el acceso a datos en RoutineRepository.
 */
@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly auth = inject(AuthService);
  private readonly routines = inject(RoutineRepository);

  /** Crea una rutina para el usuario en sesión. */
  async create(input: RoutineInput): Promise<RoutineResult> {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return { ok: false, error: 'No hay una sesión activa.' };
    }

    const parsed = parseRoutine(input);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }

    const id = await this.routines.create(userId, parsed.data);
    return { ok: true, id };
  }

  /** Actualiza una rutina existente. */
  async update(routineId: number, input: RoutineInput): Promise<RoutineResult> {
    const parsed = parseRoutine(input);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }

    await this.routines.update(routineId, parsed.data);
    return { ok: true, id: routineId };
  }

  /** Lista las rutinas del usuario en sesión. */
  async listForCurrentUser(): Promise<Routine[]> {
    const userId = this.auth.currentUser()?.id;
    return userId ? this.routines.findByUser(userId) : [];
  }

  /** Obtiene una rutina con sus ejercicios. */
  getDetail(routineId: number): Promise<RoutineDetail | null> {
    return this.routines.findDetail(routineId);
  }

  /** Elimina una rutina. */
  delete(routineId: number): Promise<void> {
    return this.routines.deleteById(routineId);
  }
}
