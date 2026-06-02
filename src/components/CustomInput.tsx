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
import Icon, { IconName } from './Icon';

interface CustomInputProps extends TextInputProps {
  icon?: IconName;
  isPassword?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon = 'mail',
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
        <Icon name={icon} size={24} />
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
              size={24}
            />
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
