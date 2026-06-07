/**
 * Entidad de usuario tal como se almacena en SQLite (RF01, RF02).
 *
 * @property id           Identificador autoincremental asignado por la base de datos.
 * @property fullName     Nombre completo del usuario.
 * @property email        Correo electrónico, único. Se usa como credencial de login.
 * @property passwordHash Hash de la contraseña (nunca se guarda en texto plano).
 * @property salt         Sal aleatoria usada al derivar el hash de la contraseña.
 * @property weightKg     Peso en kilogramos. Opcional al registrarse.
 * @property heightCm     Altura en centímetros. Opcional al registrarse.
 * @property createdAt    Fecha de creación en formato ISO 8601.
 */
export interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  weightKg: number | null;
  heightCm: number | null;
  createdAt: string;
}

/**
 * Datos que envía el formulario de registro antes de procesar la contraseña.
 */
export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  weightKg?: number | null;
  heightCm?: number | null;
}

/**
 * Credenciales que envía el formulario de inicio de sesión.
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Vista pública del usuario: nunca expone el hash ni la sal de la contraseña.
 * Es lo que circula por la app una vez autenticado.
 */
export type PublicUser = Omit<User, 'passwordHash' | 'salt'>;

/**
 * Convierte una entidad User a su versión pública, descartando los campos sensibles.
 */
export function toPublicUser(user: User): PublicUser {
  const { passwordHash, salt, ...publicUser } = user;
  return publicUser;
}
