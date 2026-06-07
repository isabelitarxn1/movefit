import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

/**
 * Gestiona el ciclo de vida de la base de datos SQLite local.
 *
 * Funciona en navegador (vía jeep-sqlite + WASM) y en dispositivo (SQLite nativo).
 * Centraliza la conexión para que el resto de servicios (AuthService, etc.)
 * no toquen la API de bajo nivel directamente.
 */
@Injectable({ providedIn: 'root' })
export class DatabaseService {
  /** Nombre del archivo de base de datos. */
  private static readonly DB_NAME = 'movefit';
  /** Versión del esquema; subir este número al migrar tablas. */
  private static readonly DB_VERSION = 1;

  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db?: SQLiteDBConnection;
  private initialized = false;

  /**
   * Prepara la conexión y crea el esquema si no existe.
   * Es idempotente: llamarlo varias veces no reabre la conexión.
   * Debe ejecutarse una vez al arrancar la app (APP_INITIALIZER).
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // En navegador hay que inicializar el almacén web (jeep-sqlite) antes de conectar.
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.initWebStore();
    }

    this.db = await this.openConnection();
    await this.db.open();
    await this.createSchema();
    this.initialized = true;
  }

  /**
   * Devuelve la conexión abierta. Lanza si se usa antes de initialize().
   */
  getConnection(): SQLiteDBConnection {
    if (!this.db) {
      throw new Error('DatabaseService no inicializado. Llama a initialize() primero.');
    }
    return this.db;
  }

  /**
   * Persiste los cambios al almacén permanente.
   *
   * En navegador, jeep-sqlite mantiene la base de datos en memoria y solo la
   * vuelca a IndexedDB cuando se llama a saveToStore; sin esto, los datos se
   * pierden al recargar la página. En dispositivo nativo no hace falta (SQLite
   * escribe directo al archivo), así que es un no-op.
   *
   * Debe llamarse después de cada operación de escritura (INSERT/UPDATE/DELETE).
   */
  async persist(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(DatabaseService.DB_NAME);
    }
  }

  /**
   * Crea o recupera la conexión, manejando el caso en que ya exista.
   */
  private async openConnection(): Promise<SQLiteDBConnection> {
    const { DB_NAME, DB_VERSION } = DatabaseService;

    const isConn = (await this.sqlite.isConnection(DB_NAME, false)).result;
    if (isConn) {
      return this.sqlite.retrieveConnection(DB_NAME, false);
    }

    return this.sqlite.createConnection(
      DB_NAME,
      false,
      'no-encryption',
      DB_VERSION,
      false
    );
  }

  /**
   * Define las tablas de la aplicación. Usa IF NOT EXISTS para ser idempotente:
   * tablas nuevas se crean también sobre una base ya existente.
   */
  private async createSchema(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName      TEXT    NOT NULL,
        email         TEXT    NOT NULL UNIQUE,
        passwordHash  TEXT    NOT NULL,
        salt          TEXT    NOT NULL,
        weightKg      REAL    NOT NULL,
        heightCm      REAL    NOT NULL,
        createdAt     TEXT    NOT NULL
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT    NOT NULL,
        description   TEXT    NOT NULL,
        instructions  TEXT    NOT NULL,
        category      TEXT    NOT NULL
      );

      CREATE TABLE IF NOT EXISTS routines (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        userId        INTEGER NOT NULL,
        name          TEXT    NOT NULL,
        days          TEXT    NOT NULL,
        createdAt     TEXT    NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS routine_exercises (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        routineId     INTEGER NOT NULL,
        exerciseId    INTEGER NOT NULL,
        series        INTEGER NOT NULL,
        reps          INTEGER NOT NULL,
        durationSec   INTEGER NOT NULL,
        position      INTEGER NOT NULL,
        FOREIGN KEY (routineId) REFERENCES routines(id) ON DELETE CASCADE,
        FOREIGN KEY (exerciseId) REFERENCES exercises(id)
      );
    `;
    await this.getConnection().execute(schema);
  }
}
