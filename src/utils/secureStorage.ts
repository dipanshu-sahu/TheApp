import * as Keychain from 'react-native-keychain';
import { UserInfo } from '../types/user';

const AUTH_SERVICE = 'com.theapp.auth.token';
const USER_SERVICE = 'com.theapp.auth.user';

export const saveAuthToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword('authToken', token, {
    service: AUTH_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const getAuthToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: AUTH_SERVICE,
  });
  if (!credentials || typeof credentials === 'boolean') {
    return null;
  }
  return credentials.password || null;
};

export const saveUserSession = async (user: UserInfo): Promise<void> => {
  await Keychain.setGenericPassword('userSession', JSON.stringify(user), {
    service: USER_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const getUserSession = async (): Promise<UserInfo | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: USER_SERVICE,
  });
  if (!credentials || typeof credentials === 'boolean') {
    return null;
  }
  try {
    return JSON.parse(credentials.password) as UserInfo;
  } catch {
    return null;
  }
};

export const clearAuthSession = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: AUTH_SERVICE });
  await Keychain.resetGenericPassword({ service: USER_SERVICE });
};

export const formatBearerToken = (token: string): string =>
  token.startsWith('Bearer ') ? token : `Bearer ${token}`;
