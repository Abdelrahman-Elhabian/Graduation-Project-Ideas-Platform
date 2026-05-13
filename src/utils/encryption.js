/**
 * Encryption Utility
 * Encrypts/decrypts sensitive text fields before storing in Firestore
 * so data appears encrypted in the Firebase console.
 *
 * Uses AES encryption from crypto-js.
 * - encryptText / decryptText: random salt (non-deterministic) for general text
 * - encryptDeterministic / decryptDeterministic: fixed IV for queryable fields like teamId
 */

import CryptoJS from 'crypto-js';

// Secret key for encryption — change this to your own unique value
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'GradIdeas_S3cur3_K3y_2026!@#';

// Fixed IV for deterministic encryption (must be exactly 16 bytes)
const FIXED_IV = CryptoJS.enc.Utf8.parse('GrAdIdEaS_FxdIV!');
// Derived key for deterministic encryption (must be 32 bytes for AES-256)
const DERIVED_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY.padEnd(32, '0').slice(0, 32));

/**
 * Encrypt a string value (non-deterministic — different output each time)
 * Use for text that does NOT need to be queried (names, descriptions, etc.)
 */
export const encryptText = (text) => {
  if (!text || typeof text !== 'string') return text;
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

/**
 * Decrypt a non-deterministic encrypted string
 */
export const decryptText = (cipherText) => {
  if (!cipherText || typeof cipherText !== 'string') return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || cipherText;
  } catch {
    return cipherText;
  }
};

/**
 * Deterministic encryption — same input always produces the same output.
 * Use for fields that must be queryable in Firestore (e.g., teamId).
 */
export const encryptDeterministic = (text) => {
  if (!text || typeof text !== 'string') return text;
  try {
    return CryptoJS.AES.encrypt(text, DERIVED_KEY, {
      iv: FIXED_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  } catch {
    return text;
  }
};

/**
 * Decrypt a deterministically encrypted string
 */
export const decryptDeterministic = (cipherText) => {
  if (!cipherText || typeof cipherText !== 'string') return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, DERIVED_KEY, {
      iv: FIXED_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || cipherText;
  } catch {
    return cipherText;
  }
};

/**
 * Encrypt specific fields of an object (non-deterministic)
 */
export const encryptFields = (data, fields) => {
  const encrypted = { ...data };
  for (const field of fields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encryptText(encrypted[field]);
    }
  }
  return encrypted;
};

/**
 * Decrypt specific fields of an object (non-deterministic)
 */
export const decryptFields = (data, fields) => {
  const decrypted = { ...data };
  for (const field of fields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = decryptText(decrypted[field]);
    }
  }
  return decrypted;
};
