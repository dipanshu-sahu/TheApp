import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { durations } from '../../themes/motion';
import { typography } from '../../themes/typography';

const OTP_LENGTH = 6;
const AnimatedView = Animated.View;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange }) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
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
        <OtpBox
          key={index}
          active={focusedIndex === index}
          filled={!!digit.trim()}
        >
          <TextInput
            ref={ref => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            value={digit.trim()}
            onChangeText={text => updateValue(index, text)}
            onKeyPress={event => handleKeyPress(index, event)}
            onFocus={() => setFocusedIndex(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            caretHidden
          />
        </OtpBox>
      ))}
    </View>
  );
};

const OtpBox: React.FC<{ active: boolean; filled: boolean; children: React.ReactNode }> = ({
  active,
  filled,
  children,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(active || filled ? 1 : 0, { duration: durations.fast });
  }, [active, filled, progress]);

  const style = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [colors.inputBorder, colors.primary]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.inputBackground, colors.primarySoft]),
    transform: [{ scale: 1 + progress.value * 0.04 }],
  }));

  return <AnimatedView style={[styles.box, style]}>{children}</AnimatedView>;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    borderWidth: 1.5,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
});

export default OtpInput;
