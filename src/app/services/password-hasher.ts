import { Injectable } from '@angular/core';

/**
 * Deriva y verifica contraseñas de forma segura (PBKDF2-SHA256 + sal).
 * Encapsula toda la cripto: quien lo use no maneja sal, bytes ni hex,
 * solo pide "hashea esta contraseña" o "¿esta contraseña coincide?".
 */
@Injectable({ providedIn: 'root' })
export class PasswordHasher {
  private static readonly ITERATIONS = 100_000;
  private static readonly SALT_BYTES = 16;
  private static readonly KEY_BITS = 256;

  /**
   * Deriva el hash de una contraseña nueva, generando una sal aleatoria.
   * @returns El hash y la sal (ambos en hex) para guardarlos juntos.
   */
  async hash(password: string): Promise<{ hash: string; salt: string }> {
    const salt = this.generateSalt();
    const hash = await this.derive(password, salt);
    return { hash, salt };
  }

  /**
   * Verifica una contraseña contra el hash y la sal almacenados.
   * @returns true si la contraseña coincide.
   */
  async verify(password: string, salt: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.derive(password, salt);
    return actualHash === expectedHash;
  }

  /** Genera una sal aleatoria en formato hexadecimal. */
  private generateSalt(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(PasswordHasher.SALT_BYTES));
    return this.bytesToHex(bytes);
  }

  /** Deriva el hash de la contraseña con la sal dada (PBKDF2-SHA256). */
  private async derive(password: string, saltHex: string): Promise<string> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password) as BufferSource,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const derived = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: this.hexToBytes(saltHex) as BufferSource,
        iterations: PasswordHasher.ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      PasswordHasher.KEY_BITS
    );
    return this.bytesToHex(new Uint8Array(derived));
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }
}
