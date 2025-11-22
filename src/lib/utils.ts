import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "default_secret"; // use env variable

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Encrypt data before saving
export function secureSetItem(key: string, value: any) {
  const stringValue = JSON.stringify(value);
  const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
  localStorage.setItem(key, encrypted);
}

// ✅ Decrypt data when reading
export function secureGetItem<T = any>(key: string): T | null {
  const encrypted = localStorage.getItem(key);
  
  if (!encrypted) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// ✅ Remove securely stored data
export function secureRemoveItem(key: string) {
  localStorage.removeItem(key);
}

