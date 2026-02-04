// ./CRYPTO/cryptoFunction.js
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "this-is-my-secret-key-for-token-of-hire-roofer-user-website";

// Encrypt data using the encryption key (expects string)
export const encryptData = (text) => {
  console.log("Token...",text)
  if (text === null || text === undefined) return null;
  try {
    const ciphertext = CryptoJS.AES.encrypt(String(text), ENCRYPTION_KEY);
    return ciphertext.toString();
  } catch (err) {
    console.error("encryptData error:", err);
    return null;
  }
};

// Decrypt data using the encryption key (returns null if invalid)
export const decryptData = (encryptedData) => {
  // Defensive: only attempt decryption on a non-empty string
  if (!encryptedData || typeof encryptedData !== "string") {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      // decryption produced an empty string => likely failed
      return null;
    }

    return decryptedData;
  } catch (err) {
    console.error("decryptData error (caught):", err);
    return null;
  }
};
