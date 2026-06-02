import axios from '../apis/axios';
import {
  clearAuthSession,
  formatBearerToken,
  getAuthToken,
  saveAuthToken,
} from './secureStorage';

export const applyAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = formatBearerToken(token);
};

export const clearAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

export const persistAuthToken = async (token: string) => {
  await saveAuthToken(token);
  applyAuthHeader(token);
};

export const loadStoredAuthToken = async (): Promise<string | null> => {
  const token = await getAuthToken();
  if (token) {
    applyAuthHeader(token);
  }
  return token;
};

export const signOut = async () => {
  clearAuthHeader();
  await clearAuthSession();
};
