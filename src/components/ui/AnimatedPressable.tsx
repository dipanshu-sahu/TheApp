import React, { useCallback } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PRESS_SCALE, springs, durations } from '../../themes/motion';
import { TOUCH_TARGET } from '../../themes/spacing';

const AnimatedRNPressable = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends PressableProps {
  /** Scale applied while pressed. Defaults to a subtle 0.96. */
  pressScale?: number;
  /** Opacity applied while pressed. Defaults to 1 (scale-only feedback). */
  pressOpacity?: number;
  /** Enforce the 44x44 minimum accessible touch target. Default true. */
  enforceTouchTarget?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * A spring-animated Pressable providing snappy, high-performance touch feedback
 * on the native thread. Enforces a 44x44 minimum hit target by default.
 */
const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  pressScale = PRESS_SCALE,
  pressOpacity = 1,
  enforceTouchTarget = true,
  style,
  children,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      scale.value = withSpring(pressScale, springs.press);
      if (pressOpacity !== 1) {
        opacity.value = withTiming(pressOpacity, { duration: durations.fast });
      }
      onPressIn?.(e);
    },
    [scale, opacity, pressScale, pressOpacity, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scale.value = withSpring(1, springs.press);
      if (pressOpacity !== 1) {
        opacity.value = withTiming(1, { duration: durations.base });
      }
      onPressOut?.(e);
    },
    [scale, opacity, pressOpacity, onPressOut],
  );

  return (
    <AnimatedRNPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      hitSlop={enforceTouchTarget ? 8 : undefined}
      style={[
        enforceTouchTarget ? { minWidth: TOUCH_TARGET, minHeight: TOUCH_TARGET } : null,
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </AnimatedRNPressable>
  );
};

export default AnimatedPressable;
