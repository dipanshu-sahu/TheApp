export type UserLoginRequest = {
  readonly email: string;
  readonly password: string;
};

export type UserLoginResponse = {
  readonly message: string;
  readonly token: string;
};

export type UserInfo = {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly userType?: string;
};

export type UserUpdateProfileRequest = {
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
  readonly type: string;
};

export type UserRegisterRequest = {
  readonly firstName: string;
  readonly lastName: string;
  readonly type: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly confirmPassword: string;
};

export type UserResetPasswordRequest = {
  readonly email: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
};

export type ForgotPasswordOtpRequest = {
  readonly email: string;
};

export type VerifyForgotPasswordOtpRequest = {
  readonly email: string;
  readonly otp: string;
};

export type ResetPasswordWithOtpRequest = {
  readonly email: string;
  readonly otp: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
};

export type UserChangePasswordRequest = {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
};

// ---------------------------------------------------------------------------
// Legacy camelCase aliases — kept for zero-churn migration; prefer PascalCase
// ---------------------------------------------------------------------------
/** @deprecated Use {@link UserLoginRequest} */
export type userLoginRequest = UserLoginRequest;
/** @deprecated Use {@link UserLoginResponse} */
export type userLoginResponse = UserLoginResponse;
/** @deprecated Use {@link UserUpdateProfileRequest} */
export type userUpdateProfileRequest = UserUpdateProfileRequest;
/** @deprecated Use {@link UserRegisterRequest} */
export type userRegisterRequest = UserRegisterRequest;
/** @deprecated Use {@link UserResetPasswordRequest} */
export type userResetPasswordRequest = UserResetPasswordRequest;
/** @deprecated Use {@link ForgotPasswordOtpRequest} */
export type forgotPasswordOtpRequest = ForgotPasswordOtpRequest;
/** @deprecated Use {@link VerifyForgotPasswordOtpRequest} */
export type verifyForgotPasswordOtpRequest = VerifyForgotPasswordOtpRequest;
/** @deprecated Use {@link ResetPasswordWithOtpRequest} */
export type resetPasswordWithOtpRequest = ResetPasswordWithOtpRequest;
/** @deprecated Use {@link UserChangePasswordRequest} */
export type userChangePasswordRequest = UserChangePasswordRequest;
