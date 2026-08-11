import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import AnimatedPressable from './AnimatedPressable';
import AppText from './AppText';
import Icon, { IconName } from '../Icon';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { PRESS_SCALE } from '../../themes/motion';

type ButtonVariant = 'primary' | 'secondary' | 'cta' | 'outline' | 'ghost' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Premium rectangular buttons — 16–20px radii, never oval pills. */
const SIZES: Record<
  ButtonSize,
  { height: number; radius: number; hPad: number; font: 'bodyStrong' | 'title' }
> = {
  sm: { height: 48, radius: radii.md, hPad: spacing.lg, font: 'bodyStrong' },
  md: { height: 52, radius: radii.md, hPad: spacing.xl, font: 'bodyStrong' },
  lg: { height: 56, radius: radii.lg, hPad: spacing.xl, font: 'title' },
};

const GRADIENTS: Record<string, [string, string]> = {
  primary: [colors.gradPrimaryStart, colors.gradPrimaryEnd],
  secondary: [colors.gradSuccessStart, colors.gradSuccessEnd],
  cta: [colors.gradAmberStart, colors.gradAmberEnd],
};

const GradientFill: React.FC<{ id: string; stops: [string, string]; radius: number }> = ({
  id,
  stops,
  radius,
}) => (
  <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={stops[0]} />
        <Stop offset="1" stopColor={stops[1]} />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100%" height="100%" rx={radius} fill={`url(#${id})`} />
  </Svg>
);

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
}) => {
  const s = SIZES[size];
  const isDisabled = disabled || loading;
  const isGradient = variant === 'primary' || variant === 'secondary' || variant === 'cta';

  const labelColor =
    variant === 'cta'
      ? colors.ctaText
      : variant === 'outline' || variant === 'ghost'
      ? colors.primary
      : colors.white;

  const containerVariant: ViewStyle =
    variant === 'outline'
      ? { backgroundColor: colors.surfaceCard }
      : variant === 'ghost'
      ? { backgroundColor: 'transparent' }
      : variant === 'glass'
      ? { backgroundColor: colors.surfaceElevated }
      : {};

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      pressScale={PRESS_SCALE}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.button,
        { height: s.height, borderRadius: s.radius },
        fullWidth ? styles.fullWidth : styles.auto,
        !isGradient ? containerVariant : null,
        isGradient && !isDisabled ? shadows.md : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {isGradient && !isDisabled ? (
        <GradientFill id={`btn-${variant}-${title.length}`} stops={GRADIENTS[variant]} radius={s.radius} />
      ) : null}

      <View style={[styles.content, { paddingHorizontal: s.hPad }]}>
        {loading ? (
          <ActivityIndicator color={labelColor} />
        ) : (
          <>
            {leftIcon ? <Icon name={leftIcon} size={20} color={labelColor} strokeWidth={1.8} /> : null}
            <AppText variant={s.font} color={labelColor}>
              {title}
            </AppText>
            {rightIcon ? <Icon name={rightIcon} size={18} color={labelColor} strokeWidth={1.8} /> : null}
          </>
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  auto: {
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  disabled: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.55,
  },
});

export default Button;
