import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange }) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const digits = value.padEnd(OTP_LENGTH, ' ').slice(0, OTP_LENGTH).split('');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const updateValue = (index: number, digit: string) => {
    const sanitized = digit.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? sanitized : d.trim())).join('');
    onChange(next.replace(/\s/g, ''));
    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.wrapper}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref;
          }}
          style={styles.box}
          value={digit.trim()}
          onChangeText={text => updateValue(index, text)}
          onKeyPress={event => handleKeyPress(index, event)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          caretHidden
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 48,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    textAlign: 'center',
    ...textFont.boldL,
    color: colors.textPrimary,
  },
});

export default OtpInput;
