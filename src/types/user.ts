export type userLoginRequest = {
  email: string;
  password: string;
};

export type userLoginResponse = {
  message: string;
  token: string;
};

export type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userType?: string;
};

export type userUpdateProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  type: string;
};

export type userRegisterRequest = {
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export type userResetPasswordRequest = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export type forgotPasswordOtpRequest = {
  email: string;
};

export type verifyForgotPasswordOtpRequest = {
  email: string;
  otp: string;
};

export type resetPasswordWithOtpRequest = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export type userChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};