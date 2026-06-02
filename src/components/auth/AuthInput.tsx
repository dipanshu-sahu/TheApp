import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Text,
} from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import Icon, { IconName } from '../Icon';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: IconName;
  isPassword?: boolean;
  errorMessage?: string;
  hint?: React.ReactNode;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon = 'mail',
  isPassword = false,
  errorMessage,
  hint,
  placeholder,
  ...props
}) => {
  const [secureText, setSecureText] = useState<boolean>(!!isPassword);
  const hasError = !!errorMessage;
  const iconColor = isPassword ? colors.passwordLock : colors.textSecondary;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.container, hasError && styles.containerError]}>
        <Icon
          name={icon}
          size={20}
          fill={iconColor}
          stroke={iconColor}
          color={iconColor}
        />
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
            <Icon
              name={secureText ? 'eye-close' : 'eye-open'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        hint ?? null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    ...textFont.boldXS,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  container: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  containerError: {
    borderColor: colors.error,
  },
  input: {
    ...textFont.regularM,
    color: colors.textPrimary,
    flex: 1,
    padding: 0,
  },
  errorText: {
    ...textFont.regularS,
    color: colors.error,
    marginTop: 6,
  },
});

export default AuthInput;
