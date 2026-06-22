export const ALLOWED_GENDERS = ["Male", "Female"] as const;
export const ALLOWED_BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const ALLOWED_ALERT_TYPES = ["Oxygen", "Temperature", "Respiration", "System", "Cardiac"] as const;
export const ALLOWED_ALERT_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

export const MIN_BIRTH_WEIGHT_KG = 0.5;
export const MAX_BIRTH_WEIGHT_KG = 6;

export function isOptionalEnumValue(value: unknown, allowed: readonly string[]) {
  return value === undefined || value === null || value === "" || isEnumValue(value, allowed);
}

export function isEnumValue(value: unknown, allowed: readonly string[]) {
  return typeof value === "string" && allowed.includes(value);
}

export function parseOptionalBirthWeight(value: unknown) {
  if (value === undefined || value === null || value === "") return null;

  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return Number.NaN;

  return parsed;
}

export function isBirthWeightInRange(value: number | null) {
  return value === null || (value >= MIN_BIRTH_WEIGHT_KG && value <= MAX_BIRTH_WEIGHT_KG);
}
