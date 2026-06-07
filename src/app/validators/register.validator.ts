import { RegisterInput } from '../models/user.model';

const MIN_PASSWORD_LENGTH = 8;
const WEIGHT_RANGE_KG = { min: 20, max: 300 };
const HEIGHT_RANGE_CM = { min: 50, max: 250 };

/**
 * Datos del registro ya validados y normalizados (nombre recortado, correo en
 * minúsculas, peso/altura como number garantizado). Listos para guardar.
 */
export interface ValidRegisterData {
  fullName: string;
  email: string;
  password: string;
  weightKg: number;
  heightCm: number;
}

/** Resultado de parsear el formulario de registro. */
export type RegisterResult =
  | { ok: true; data: ValidRegisterData }
  | { ok: false; error: string };

/**
 * Valida y normaliza los datos del formulario de registro.
 *
 * Reglas:
 *  - Nombre obligatorio.
 *  - Contraseña de al menos 8 caracteres, con mayúscula, minúscula y número.
 *  - Peso y altura obligatorios, numéricos y dentro de un rango razonable.
 *  - El formato del correo se delega al input type="email".
 *
 * @param input Datos crudos del formulario.
 * @returns Los datos validados, o un mensaje de error a mostrar.
 */
export function parseRegister(input: RegisterInput): RegisterResult {
  if (!input.fullName?.trim()) {
    return { ok: false, error: 'El nombre es obligatorio.' };
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) {
    return { ok: false, error: passwordError };
  }

  const weight = parseNumericRange(input.weightKg, WEIGHT_RANGE_KG, 'El peso', 'kg');
  if (!weight.ok) {
    return { ok: false, error: weight.error };
  }

  const height = parseNumericRange(input.heightCm, HEIGHT_RANGE_CM, 'La altura', 'cm');
  if (!height.ok) {
    return { ok: false, error: height.error };
  }

  return {
    ok: true,
    data: {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      weightKg: weight.value,
      heightCm: height.value,
    },
  };
}

/**
 * Valida la contraseña: longitud mínima y fortaleza.
 * @returns Mensaje de error, o null si es válida.
 */
function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasUpper || !hasLower || !hasNumber) {
    return 'La contraseña debe incluir mayúscula, minúscula y número.';
  }

  return null;
}

/** Resultado de parsear un valor numérico: el number validado o un error. */
type NumericResult = { ok: true; value: number } | { ok: false; error: string };

/**
 * Valida un valor numérico obligatorio dentro de un rango y, si es válido,
 * lo devuelve ya tipado como `number` (eso es lo que elimina los `!` aguas arriba).
 *
 * @param value Valor ingresado, o null/undefined si se omitió.
 * @param range Rango aceptable { min, max }.
 * @param label Nombre con artículo para el mensaje (ej: "El peso", "La altura").
 * @param unit  Unidad para el mensaje (ej: "kg", "cm").
 */
function parseNumericRange(
  value: number | null | undefined,
  range: { min: number; max: number },
  label: string,
  unit: string
): NumericResult {
  if (value === null || value === undefined) {
    return { ok: false, error: `${label} es un dato obligatorio.` };
  }
  if (!Number.isFinite(value)) {
    return { ok: false, error: `${label} debe ser un valor numérico.` };
  }
  if (value < range.min || value > range.max) {
    return { ok: false, error: `${label} debe estar entre ${range.min} y ${range.max} ${unit}.` };
  }
  return { ok: true, value };
}
