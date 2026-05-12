/**
 * Encryption Utility
 * Encrypts/decrypts sensitive text fields before storing in Firestore
 * so data appears encrypted in the Firebase console.
 *
 * Uses AES encryption from crypto-js.
 * IMPORTANT: Change the SECRET_KEY to your own unique secret.
 */

import CryptoJS from 'crypto-js';

// Secret key for encryption — change this to your own unique value
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'GradIdeas_S3cur3_K3y_2026!@#';

/**
 * Encrypt a string value
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string (Base64)
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
 * Decrypt an encrypted string value
 * @param {string} cipherText - Encrypted string
 * @returns {string} Decrypted plain text
 */
export const decryptText = (cipherText) => {
  if (!cipherText || typeof cipherText !== 'string') return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // If decryption fails (not encrypted data), return original
    return decrypted || cipherText;
  } catch (error) {
    // If it fails, the data was likely not encrypted — return as-is
    return cipherText;
  }
};

/**
 * Encrypt specific fields of an object
 * @param {Object} data - Object with fields to encrypt
 * @param {string[]} fields - Array of field names to encrypt
 * @returns {Object} Object with specified fields encrypted
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
 * Decrypt specific fields of an object
 * @param {Object} data - Object with encrypted fields
 * @param {string[]} fields - Array of field names to decrypt
 * @returns {Object} Object with specified fields decrypted
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
