import { createMMKV } from 'react-native-mmkv';
import { MMKV_ENCRYPTION_KEY } from '../constants/appConfig';

export const storage = createMMKV({
  id: 'user-storage',
  encryptionKey: MMKV_ENCRYPTION_KEY,
});

export const STORAGE_KEYS = {
  authToken: 'authToken',
  selectedSite: 'selectedSite',
};

export const setStorage = (key: string, value: string | number | boolean): void => {
  if (key) {
    storage.set(key, value);
  }
};

export const getStorage = (
  key: string,
  typeOf?: 'string' | 'number' | 'boolean',
): string | number | boolean | undefined => {
  if (!key) {
    return undefined;
  }
  switch (typeOf) {
    case 'number':
      return storage.getNumber(key);
    case 'boolean':
      return storage.getBoolean(key);
    default:
      return storage.getString(key);
  }
};
