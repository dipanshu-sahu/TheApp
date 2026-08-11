import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import { durations, easings } from '../../themes/motion';
import { getPasswordStrength } from '../../utils/passwordStrength';

type PasswordStrengthProps = {
  password: string;
  hint?: string;
};

const TIER_COLORS = [colors.error, colors.warning, colors.warning, colors.success];

const Bar: React.FC<{ index: number; strength: number }> = ({ index, strength }) => {
  const active = index < strength;
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(active ? 1 : 0, {
      duration: durations.fast,
      easing: easings.standard,
    });
  }, [active, fill]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.2 + fill.value * 0.8,
    transform: [{ scaleY: 0.6 + fill.value * 0.4 }],
    backgroundColor: active ? TIER_COLORS[Math.max(0, strength - 1)] : colors.lineGrey,
  }));

  return <Animated.View style={[styles.bar, style]} />;
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  hint = 'Enter a strong password',
}) => {
  const strength = getPasswordStrength(password);

  return (
    <View style={styles.wrapper}>
      <View style={styles.bars}>
        {[0, 1, 2, 3].map(index => (
          <Bar key={index} index={index} strength={strength} />
        ))}
      </View>
      <AppText variant="caption" color={colors.textTertiary}>
        {hint}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.xs,
  },
  bars: {
    flexDirection: 'row',
    gap: spacing.xxs + 2,
    marginBottom: spacing.xxs + 2,
  },
  bar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
});

export default PasswordStrength;
