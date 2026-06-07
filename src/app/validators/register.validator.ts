import { RegisterInput } from '../models/user.model';

const MIN_PASSWORD_LENGTH = 8;
const WEIGHT_RANGE_KG = { min: 20, max: 300 };
const HEIGHT_RANGE_CM = { min: 50, max: 250 };

/**
 * Valida los datos del formulario de registro.
 *
 * Reglas:
 *  - Nombre obligatorio.
 *  - Contraseña de al menos 8 caracteres, con mayúscula, minúscula y número.
 *  - Peso y altura obligatorios, numéricos y dentro de un rango razonable.
 *  - El formato del correo se delega al input type="email".
 *
 * @param input Datos crudos del formulario de registro.
 * @returns Mensaje de error a mostrar, o null si los datos son válidos.
 */
export function validateRegister(input: RegisterInput): string | null {
  if (!input.fullName?.trim()) {
    return 'El nombre es obligatorio.';
  }

  const passwordError = validatePassword(input.password);
  if (passwordError) {
    return passwordError;
  }

  const weightError = validateNumericRange(input.weightKg, WEIGHT_RANGE_KG, 'El peso', 'kg');
  if (weightError) {
    return weightError;
  }

  const heightError = validateNumericRange(input.heightCm, HEIGHT_RANGE_CM, 'La altura', 'cm');
  if (heightError) {
    return heightError;
  }

  return null;
}

/**
 * Valida la contraseña: longitud mínima y fortaleza.
 *
 * @param password Contraseña ingresada.
 * @returns Mensaje de error a mostrar, o null si es válida.
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

/**
 * Valida un valor numérico obligatorio dentro de un rango específico.
 *
 * @param value Valor ingresado, o null/undefined si se omitió.
 * @param range Rango aceptable { min, max }.
 * @param label Nombre con artículo para el mensaje (ej: "El peso", "La altura").
 * @param unit  Unidad para el mensaje (ej: "kg", "cm").
 */
function validateNumericRange(
  value: number | null | undefined,
  range: { min: number; max: number },
  label: string,
  unit: string
): string | null {
  if (value === null || value === undefined) {
    return `${label} es un dato obligatorio.`;
  }
  if (!Number.isFinite(value)) {
    return `${label} debe ser un valor numérico.`;
  }
  if (value < range.min || value > range.max) {
    return `${label} debe estar entre ${range.min} y ${range.max} ${unit}.`;
  }
  return null;
}
