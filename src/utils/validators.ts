type ValidationField =
  | 'email'
  | 'password'
  | 'currentPassword'
  | 'newPassword'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'phoneNumber'
  | 'type'
  | 'confirmPassword'
  | 'otp';

type ValidationContext = Partial<Record<ValidationField, string>>;

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const nameRegex = /^[a-zA-Z][a-zA-Z\s'-]{1,}$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

type ValidatorFn = (value: string, context?: ValidationContext) => string;

const passwordValidator: ValidatorFn = (value): string => {
  if (!value) {
    return 'Password is required';
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!passwordRegex.test(value)) {
    return 'Use upper, lower, number and a special character';
  }
  return '';
};

const validators: Readonly<Record<ValidationField, ValidatorFn>> = {
  email: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'Email is required';
    }
    if (!emailRegex.test(trimmedValue)) {
      return 'Enter a valid email address';
    }
    return '';
  },
  password: passwordValidator,
  currentPassword: passwordValidator,
  newPassword: passwordValidator,
  firstName: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'First name is required';
    }
    if (!nameRegex.test(trimmedValue)) {
      return 'Enter a valid first name';
    }
    return '';
  },
  lastName: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'Last name is required';
    }
    if (!nameRegex.test(trimmedValue)) {
      return 'Enter a valid last name';
    }
    return '';
  },
  fullName: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'Full name is required';
    }
    if (!nameRegex.test(trimmedValue)) {
      return 'Enter a valid full name';
    }
    const parts = trimmedValue.split(/\s+/).filter(Boolean);
    if (parts.length < 2) {
      return 'Enter first and last name';
    }
    return '';
  },
  phoneNumber: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(trimmedValue)) {
      return 'Enter a valid phone number';
    }
    return '';
  },
  type: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'User type is required';
    }
    if (trimmedValue.length < 3) {
      return 'User type must have at least 3 characters';
    }
    return '';
  },
  confirmPassword: (value, context): string => {
    if (!value) {
      return 'Confirm password is required';
    }
    if (value !== context?.password) {
      return 'Passwords do not match';
    }
    return '';
  },
  otp: (value): string => {
    const trimmedValue = value?.trim() ?? '';
    if (!trimmedValue) {
      return 'Verification code is required';
    }
    if (!/^\d{6}$/.test(trimmedValue)) {
      return 'Enter a valid 6-digit code';
    }
    return '';
  },
};

export const validateField = (
  field: ValidationField,
  value: string,
  context: ValidationContext = {},
): string => validators[field](value, context);

export const isFieldValid = (
  field: ValidationField,
  value: string,
  context: ValidationContext = {},
): boolean => validateField(field, value, context) === '';

export const regexCollection = {
  email: emailRegex,
  password: passwordRegex,
  name: nameRegex,
  phone: phoneRegex,
} as const;
