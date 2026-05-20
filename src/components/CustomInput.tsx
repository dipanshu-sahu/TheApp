import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Text,
} from 'react-native';
import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import { MailIcon, EyeOpenIcon, EyeCloseIcon } from '../assets/icons';

interface CustomInputProps extends TextInputProps {
  InputIcon?: React.ComponentType<{ height: number; width: number }>;
  isPassword?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  InputIcon = MailIcon,
  isPassword = false,
  placeholder,
  errorMessage,
  ...props
}) => {
  const [secureText, setSecureText] = useState<boolean>(!!isPassword);
  const hasError = !!errorMessage;
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, hasError && styles.containerError]}>
        <InputIcon height={24} width={24} />
        <TextInput
          numberOfLines={1}
          style={styles.input}
          secureTextEntry={secureText}
          placeholder={placeholder}
          placeholderTextColor={colors.textGrey}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            {secureText ? (
              <EyeCloseIcon height={24} width={24} />
            ) : (
              <EyeOpenIcon height={24} width={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    borderWidth: 1,
    borderColor: colors.lineGrey,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  containerError: {
    borderColor: colors.error,
  },
  input: {
    ...textFont.regularL,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  errorText: {
    ...textFont.regularS,
    color: colors.error,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default CustomInput;
