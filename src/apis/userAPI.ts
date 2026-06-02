import axios from './axios';
import {
  userLoginRequest,
  userRegisterRequest,
  userResetPasswordRequest,
  userChangePasswordRequest,
  UserInfo,
  userUpdateProfileRequest,
  forgotPasswordOtpRequest,
  verifyForgotPasswordOtpRequest,
  resetPasswordWithOtpRequest,
} from '../types/user';
import { persistAuthToken } from '../utils/authSession';

export const userLoginApi = async (payload: userLoginRequest) => {
  const response = await axios.post('/api/auth/login', payload);
  const token = response?.data?.token;
  if (token) {
    await persistAuthToken(token);
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

export const sendForgotPasswordOtpApi = async (
  payload: forgotPasswordOtpRequest,
) => {
  return axios.post('/api/Auth/forgot-password', payload);
};

export const verifyForgotPasswordOtpApi = async (
  payload: verifyForgotPasswordOtpRequest,
) => {
  return axios.post('/api/Auth/verify-otp', payload);
};

export const resetPasswordWithOtpApi = async (
  payload: resetPasswordWithOtpRequest,
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
