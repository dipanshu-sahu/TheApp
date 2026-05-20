import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({
  id: `user-storage`,
  path: `user/storage`,
  encryptionKey: 'hunter2',
  encryptionType: 'AES-256',
  mode: 'multi-process',
  readOnly: false,
  compareBeforeSet: false,
})

export const STORAGE_KEYS = {
  authToken: 'authToken',
};

export const setStorage = (key: string, value: any) => {
  try {
    if (!!key && !!value) {
      return storage.set(key, value);
    } else {
      return null;
    }
  } catch (error) {
    console.log({ error })
  }

};

export const getStorage = (
  key: string,
  typeOf?: 'string' | 'number' | 'array' | 'boolean',
) => {
  if (!!key && !typeOf) {
    return storage.getString(key);
  } else if (!!key && !!typeOf) {
    switch (typeOf) {
      case 'string':
        return storage.getString(key);
      case 'number':
        return storage.getNumber(key);
      case 'boolean':
        return storage.getBoolean(key);
      case 'array':
        return storage.getBuffer(key);
      default:
        return null;
    }
  } else {
    return null;
  }
};
