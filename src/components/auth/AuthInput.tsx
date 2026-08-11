import React from 'react';
import { TextInputProps } from 'react-native';
import TextField from '../ui/TextField';
import { IconName } from '../Icon';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: IconName;
  isPassword?: boolean;
  errorMessage?: string;
  hint?: React.ReactNode;
}

/** Thin wrapper preserving the AuthInput API on top of the shared TextField. */
const AuthInput: React.FC<AuthInputProps> = ({ icon = 'mail', ...props }) => (
  <TextField icon={icon} {...props} />
);

export default AuthInput;
