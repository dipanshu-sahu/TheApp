import React from 'react';
import { TextInputProps } from 'react-native';
import TextField from './ui/TextField';
import { IconName } from './Icon';

interface CustomInputProps extends TextInputProps {
  icon?: IconName;
  isPassword?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

/** Legacy input API, now backed by the shared animated TextField. */
const CustomInput: React.FC<CustomInputProps> = ({ icon = 'mail', ...props }) => (
  <TextField icon={icon} {...props} />
);

export default CustomInput;
