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
   * Define las tablas de la aplicación. Usa IF NOT EXISTS para ser idempotente.
   */
  private async createSchema(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName      TEXT    NOT NULL,
        email         TEXT    NOT NULL UNIQUE,
        passwordHash  TEXT    NOT NULL,
        salt          TEXT    NOT NULL,
        weightKg      REAL,
        heightCm      REAL,
        createdAt     TEXT    NOT NULL
      );
    `;
    await this.getConnection().execute(schema);
  }
}
