import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { User } from '../models/user.model';


export interface NewUserRecord {
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  weightKg: number;
  heightCm: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly database = inject(DatabaseService);

  /**
   * Inserta un usuario y persiste el cambio. Devuelve el id generado.
   */
  async create(record: NewUserRecord): Promise<number> {
    const db = this.database.getConnection();
    const result = await db.run(
      `INSERT INTO users (fullName, email, passwordHash, salt, weightKg, heightCm, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        record.fullName,
        record.email,
        record.passwordHash,
        record.salt,
        record.weightKg,
        record.heightCm,
        record.createdAt,
      ]
    );

    // Vuelca a IndexedDB para que el usuario sobreviva a recargas (navegador).
    await this.database.persist();

    return result.changes?.lastId ?? 0;
  }

  /**
   * Busca un usuario por correo. Devuelve null si no existe.
   */
  async findByEmail(email: string): Promise<User | null> {
    const db = this.database.getConnection();
    const res = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const row = res.values?.[0];
    return row ? (row as User) : null;
  }

  /**
   * Indica si ya existe un usuario registrado con ese correo.
   */
  async existsByEmail(email: string): Promise<boolean> {
    const db = this.database.getConnection();
    const res = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    return (res.values?.length ?? 0) > 0;
  }

  /**
   * Actualiza los datos del perfil de un usuario y persiste los cambios.
   */
  async updateProfile(id: number, fullName: string, weightKg: number, heightCm: number): Promise<void> {
    const db = this.database.getConnection();
    await db.run(
      `UPDATE users SET fullName = ?, weightKg = ?, heightCm = ? WHERE id = ?`,
      [fullName, weightKg, heightCm, id]
    );
    await this.database.persist();
  }
}

