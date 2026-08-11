import { createMMKV } from 'react-native-mmkv';
import { MMKV_ENCRYPTION_KEY } from '../constants/appConfig';

export const storage = createMMKV({
  id: 'user-storage',
  encryptionKey: MMKV_ENCRYPTION_KEY,
});

export const STORAGE_KEYS = {
  authToken: 'authToken',
  selectedSite: 'selectedSite',
} as const;

export const setStorage = (key: string, value: string | number | boolean): void => {
  if (key) {
    storage.set(key, value);
  }
};

/**
 * Typed overloads so callers receive the exact primitive type they requested
 * without needing a cast at the call site.
 */
export function getStorage(key: string, type: 'string'): string | undefined;
export function getStorage(key: string, type: 'number'): number | undefined;
export function getStorage(key: string, type: 'boolean'): boolean | undefined;
export function getStorage(key: string): string | undefined;
export function getStorage(
  key: string,
  type?: 'string' | 'number' | 'boolean',
): string | number | boolean | undefined {
  if (!key) {
    return undefined;
  }
  switch (type) {
    case 'number':
      return storage.getNumber(key);
    case 'boolean':
      return storage.getBoolean(key);
    default:
      return storage.getString(key);
  }
}
