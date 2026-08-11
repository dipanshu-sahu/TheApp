import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import AnimatedPressable from '../ui/AnimatedPressable';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { durations, easings } from '../../themes/motion';
import Icon from '../Icon';

type TermsCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
};

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onToggle }) => {
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: durations.fast,
      easing: easings.standard,
    });
  }, [checked, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', colors.secondary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.borderStrong, colors.secondary]),
    transform: [{ scale: 0.9 + progress.value * 0.1 }],
  }));

  const checkStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <AnimatedPressable
      style={styles.wrapper}
      onPress={onToggle}
      pressScale={0.98}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View style={[styles.box, boxStyle]}>
        <Animated.View style={checkStyle}>
          <Icon name="check" width={12} height={12} color={colors.white} />
        </Animated.View>
      </Animated.View>
      <AppText variant="body" color={colors.textSecondary} style={styles.text}>
        I agree to the <AppText variant="bodyStrong" color={colors.link}>Terms of Service</AppText>
        {' & '}
        <AppText variant="bodyStrong" color={colors.link}>Privacy Policy</AppText>
      </AppText>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radii.xs,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  text: {
    flex: 1,
  },
});

export default TermsCheckbox;
