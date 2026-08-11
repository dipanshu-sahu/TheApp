import { AxiosResponse } from 'axios';
import axios from './axios';
import {
  UserLoginRequest,
  UserRegisterRequest,
  UserResetPasswordRequest,
  UserChangePasswordRequest,
  UserInfo,
  UserUpdateProfileRequest,
  ForgotPasswordOtpRequest,
  VerifyForgotPasswordOtpRequest,
  ResetPasswordWithOtpRequest,
} from '../types/user';
import { persistAuthToken } from '../utils/authSession';

export const userLoginApi = async (payload: UserLoginRequest): Promise<void> => {
  const response = await axios.post<{ token?: string }>('/api/auth/login', payload);
  const token = response?.data?.token;
  if (token) {
    await persistAuthToken(token);
  }
};

export const userRegisterApi = async (
  payload: UserRegisterRequest,
): Promise<AxiosResponse<void>> =>
  axios.post('/api/Auth/register', payload);

export const userResetPasswordApi = async (
  payload: UserResetPasswordRequest,
): Promise<AxiosResponse<void>> =>
  axios.post('/api/Auth/reset-password', payload);

export const sendForgotPasswordOtpApi = async (
  payload: ForgotPasswordOtpRequest,
): Promise<AxiosResponse<void>> =>
  axios.post('/api/Auth/forgot-password', payload);

export const verifyForgotPasswordOtpApi = async (
  payload: VerifyForgotPasswordOtpRequest,
): Promise<AxiosResponse<void>> =>
  axios.post('/api/Auth/verify-otp', payload);

export const resetPasswordWithOtpApi = async (
  payload: ResetPasswordWithOtpRequest,
): Promise<AxiosResponse<void>> =>
  axios.post('/api/Auth/reset-password', payload);

export const userChangePasswordApi = async (
  payload: UserChangePasswordRequest,
): Promise<AxiosResponse<void>> =>
  axios.post('/api/Auth/change-password', payload);

export const getUsersApi = async (): Promise<UserInfo[]> => {
  const response = await axios.get<UserInfo[]>('/api/users');
  return response.data;
};

/**
 * Updates a user profile and returns the server-confirmed `UserInfo`.
 * Typed end-to-end so the slice does not need to cast `response.data`.
 */
export const updateUserProfileApi = async (
  userId: string,
  payload: UserUpdateProfileRequest,
): Promise<UserInfo> => {
  const response = await axios.put<UserInfo>(`/api/Users/${userId}`, payload);
  return response.data;
};
