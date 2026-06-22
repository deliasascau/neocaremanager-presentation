import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const KEY_LENGTH = 32; // 256 bits

function getKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (32 bytes) in .env"
    );
  }
  return Buffer.from(keyHex, "hex");
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a hex-encoded string: IV (12B) + AuthTag (16B) + Ciphertext.
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:ciphertext (all hex)
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a hex-encoded ciphertext produced by encrypt().
 * If the data is not encrypted (plaintext), returns it as-is.
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(":")) {
    return encryptedData; // already plaintext
  }

  try {
    const key = getKey();
    const parts = encryptedData.split(":");

    if (parts.length !== 3) {
      return encryptedData; // not our format
    }

    const [ivHex, authTagHex, ciphertext] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return encryptedData; // decryption failed, return as-is
  }
}

/**
 * Generates a random 256-bit encryption key (hex string).
 * Run once: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
export function generateKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

/**
 * Decrypts PII fields on a patient object (used in API routes before returning to frontend).
 * Leaves medical data (birthWeight, bloodType, gender, etc.) in plaintext.
 */
export function decryptPatient<T extends { firstName: string; lastName: string }>(patient: T) {
  return {
    ...patient,
    firstName: decrypt(patient.firstName),
    lastName: decrypt(patient.lastName),
  } as T & { firstName: string; lastName: string };
}

/**
 * Decrypts PII fields on a mother object.
 */
export function decryptMother(mother: {
  phone: string;
  address: string;
  [key: string]: unknown;
}) {
  return {
    ...mother,
    phone: decrypt(mother.phone),
    address: decrypt(mother.address),
  };
}

/**
 * Decrypts PII fields on a user object.
 */
export function decryptUser(user: {
  name: string;
  [key: string]: unknown;
}) {
  return {
    ...user,
    name: decrypt(user.name),
  };
}
