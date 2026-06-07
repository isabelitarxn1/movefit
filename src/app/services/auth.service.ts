import { Injectable, computed, inject, signal } from '@angular/core';
import { UserRepository } from './user.repository';
import { PasswordHasher } from './password-hasher';
import { parseRegister } from '../validators/register.validator';
import {
  LoginInput,
  PublicUser,
  RegisterInput,
  toPublicUser,
} from '../models/user.model';

/**
 * Resultado uniforme de las operaciones de autenticación.
 */
export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: PublicUser;
}

/**
 * Orquesta el registro, inicio de sesión y la sesión activa (RF01).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly SESSION_KEY = 'movefit.session';

  private readonly users = inject(UserRepository);
  private readonly hasher = inject(PasswordHasher);
  private readonly _currentUser = signal<PublicUser | null>(this.readSession());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  /**
   * Registra un nuevo usuario. Deja la sesión iniciada si todo sale bien.
   */
  async register(input: RegisterInput): Promise<AuthResult> {
    const parsed = parseRegister(input);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    const { fullName, email, password, weightKg, heightCm } = parsed.data;

    if (await this.users.existsByEmail(email)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }

    const { hash: passwordHash, salt } = await this.hasher.hash(password);
    const createdAt = new Date().toISOString();

    const id = await this.users.create({
      fullName,
      email,
      passwordHash,
      salt,
      weightKg,
      heightCm,
      createdAt,
    });

    const publicUser: PublicUser = {
      id,
      fullName,
      email,
      weightKg,
      heightCm,
      createdAt,
    };

    this.startSession(publicUser);
    return { ok: true, user: publicUser };
  }

  /**
   * Inicia sesión validando correo + contraseña contra el hash almacenado.
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) {
      return { ok: false, error: 'Ingresa tu correo y contraseña.' };
    }

    const user = await this.users.findByEmail(email);
    if (!user) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    const valid = await this.hasher.verify(input.password, user.salt, user.passwordHash);
    if (!valid) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    const publicUser = toPublicUser(user);
    this.startSession(publicUser);
    return { ok: true, user: publicUser };
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(AuthService.SESSION_KEY);
  }

  private startSession(user: PublicUser): void {
    this._currentUser.set(user);
    localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(user));
  }

  private readSession(): PublicUser | null {
    const raw = localStorage.getItem(AuthService.SESSION_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as PublicUser;
    } catch {
      return null;
    }
  }

}
