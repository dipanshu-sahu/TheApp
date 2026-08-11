import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AppText from './AppText';
import Icon, { IconName } from '../Icon';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { durations, easings } from '../../themes/motion';
import { typography } from '../../themes/typography';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  isPassword?: boolean;
  errorMessage?: string;
  hint?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const AnimatedView = Animated.View;

const TextField: React.FC<TextFieldProps> = ({
  label,
  icon,
  isPassword = false,
  errorMessage,
  hint,
  placeholder,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [secure, setSecure] = useState<boolean>(!!isPassword);
  const focus = useSharedValue(0);
  const hasError = !!errorMessage;

  const fieldStyle = useAnimatedStyle(() => ({
    borderColor: hasError
      ? colors.error
      : interpolateColor(focus.value, [0, 1], [colors.surfaceElevated, colors.inputBorderFocused]),
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [colors.surfaceElevated, colors.surfaceCard],
    ),
  }));

  const iconColor = hasError ? colors.error : colors.textSecondary;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <AppText variant="labelCaps" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <AnimatedView style={[styles.field, fieldStyle]}>
        {icon ? <Icon name={icon} size={20} color={iconColor} strokeWidth={1.8} /> : null}
        <TextInput
          style={styles.input}
          numberOfLines={1}
          secureTextEntry={secure}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onFocus={e => {
            focus.value = withTiming(1, { duration: durations.fast, easing: easings.standard });
            onFocus?.(e);
          }}
          onBlur={e => {
            focus.value = withTiming(0, { duration: durations.fast, easing: easings.standard });
            onBlur?.(e);
          }}
          {...props}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setSecure(v => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Show password' : 'Hide password'}
          >
            <Icon
              name={secure ? 'eye-close' : 'eye-open'}
              size={20}
              color={colors.textSecondary}
              strokeWidth={1.8}
            />
          </Pressable>
        ) : null}
      </AnimatedView>

      {hasError ? (
        <AppText variant="caption" color={colors.error} style={styles.helper}>
          {errorMessage}
        </AppText>
      ) : (
        hint ?? null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  field: {
    minHeight: 54,
    borderWidth: 1.5,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    flex: 1,
    padding: 0,
    paddingVertical: spacing.sm,
  },
  helper: {
    marginTop: spacing.xxs,
  },
});

export default TextField;
