import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import GlassCard from '../ui/GlassCard';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { durations, easings } from '../../themes/motion';
import Icon from '../Icon';

const REQUIREMENTS = [
  { key: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'number', label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', label: 'One special character', test: (p: string) => /[#?!@$%^&*-]/.test(p) },
] as const;

const RequirementRow: React.FC<{ label: string; met: boolean }> = ({ label, met }) => {
  const progress = useSharedValue(met ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(met ? 1 : 0, {
      duration: durations.fast,
      easing: easings.standard,
    });
  }, [met, progress]);

  const dotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.glass, colors.successSoft]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.borderStrong, colors.success]),
    transform: [{ scale: 0.85 + progress.value * 0.15 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.dot, dotStyle]}>
        <Animated.View style={iconStyle}>
          <Icon name="check" width={11} height={11} color={colors.success} />
        </Animated.View>
      </Animated.View>
      <AppText variant="body" color={met ? colors.textSecondary : colors.textTertiary}>
        {label}
      </AppText>
    </View>
  );
};

type PasswordRequirementsProps = {
  password: string;
};

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => (
  <GlassCard variant="soft" radius={radii.md} style={styles.wrapper} sheen={false}>
    <AppText variant="bodyStrong" style={styles.title}>
      Password Requirements
    </AppText>
    {REQUIREMENTS.map(({ key, label, test }) => (
      <RequirementRow key={key} label={label} met={test(password)} />
    ))}
  </GlassCard>
);

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PasswordRequirements;
