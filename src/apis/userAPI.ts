import axios from './axios';
import {
  userLoginRequest,
  userRegisterRequest,
  userResetPasswordRequest,
  userChangePasswordRequest,
  UserInfo,
  userUpdateProfileRequest,
} from '../types/user';
import { setStorage, STORAGE_KEYS } from '../utils/storage';

export const userLoginApi = async (payload: userLoginRequest) => {
  const response = await axios.post('/api/auth/login', payload);
  const token = response?.data?.token;
  if (token) {
    const bearerToken = `Bearer ${token}`;
    console.log(STORAGE_KEYS.authToken, bearerToken)
    // setStorage(STORAGE_KEYS.authToken, bearerToken);
    console.log({bearerToken})
    axios.defaults.headers.common['Authorization'] = bearerToken;
  }
  return response.data;
};

export const userRegisterApi = async (payload: userRegisterRequest) => {
  return axios.post('/api/Auth/register', payload);
};

export const userResetPasswordApi = async (
  payload: userResetPasswordRequest,
) => {
  return axios.post('/api/Auth/reset-password', payload);
};

export const userChangePasswordApi = async (
  payload: userChangePasswordRequest,
) => {
  return axios.post('/api/Auth/change-password', payload);
};

export const getUsersApi = async (): Promise<UserInfo[]> => {
  const response = await axios.get('/api/Users');
  return response.data;
};

export const updateUserProfileApi = async (
  userId: string,
  payload: userUpdateProfileRequest,
) => {
  return axios.put(`/api/Users/${userId}`, payload);
};
