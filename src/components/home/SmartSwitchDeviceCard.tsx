import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import Icon from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors, withAlpha } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { durations, easings } from '../../themes/motion';
import { SWITCH_GANG_COLORS } from '../../utils/deviceDisplay';

type SmartSwitchDeviceCardProps = {
  name: string;
  isOn: boolean;
  gangStates: boolean[];
  disabled?: boolean;
  onMainToggle: (value: boolean) => void;
  onGangToggle: (index: number, value: boolean) => void;
  onPress: () => void;
};

const PowerButton: React.FC<{ isOn: boolean; disabled?: boolean; onPress: () => void }> = ({
  isOn,
  disabled,
  onPress,
}) => {
  const progress = useSharedValue(isOn ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isOn ? 1 : 0, { duration: durations.base, easing: easings.standard });
  }, [isOn, progress]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surfaceSubtle, colors.secondary]),
  }));

  return (
    <AnimatedPressable onPress={onPress} disabled={disabled} pressScale={0.92}>
      <Animated.View style={[styles.mainPowerBtn, isOn ? shadows.glow : shadows.none, style]}>
        <Icon name="power-button" width={20} height={20} color={isOn ? colors.white : colors.textSecondary} />
      </Animated.View>
    </AnimatedPressable>
  );
};

const SmartSwitchDeviceCard: React.FC<SmartSwitchDeviceCardProps> = ({
  name,
  isOn,
  gangStates,
  disabled = false,
  onMainToggle,
  onGangToggle,
  onPress,
}) => (
  <AnimatedPressable
    style={[styles.card, shadows.sm, disabled && styles.cardDisabled]}
    onPress={onPress}
    pressScale={0.99}
    enforceTouchTarget={false}
  >
    <View style={styles.header}>
      <View style={[styles.deviceIconBox, isOn && styles.deviceIconBoxOn]}>
        <Icon name="switch" width={20} height={20} color={isOn ? colors.secondary : colors.textSecondary} />
      </View>
      <View style={styles.headerText}>
        <AppText variant="title" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="caption" color={isOn ? colors.secondary : colors.textTertiary}>
          {isOn ? 'Active' : 'Standby'}
        </AppText>
      </View>
      <PowerButton isOn={isOn} disabled={disabled} onPress={() => !disabled && onMainToggle(!isOn)} />
    </View>

    <View style={styles.gangRow}>
      {gangStates.map((gangOn, index) => {
        const gangColor = SWITCH_GANG_COLORS[index % SWITCH_GANG_COLORS.length];
        return (
          <AnimatedPressable
            key={`gang-${index}`}
            style={styles.gangCol}
            onPress={() => !disabled && onGangToggle(index, !gangOn)}
            disabled={disabled}
            pressScale={0.95}
            enforceTouchTarget={false}
          >
            <View
              style={[
                styles.gangIcon,
                { backgroundColor: gangOn ? withAlpha(gangColor, 0.16) : colors.surfaceSubtle },
              ]}
            >
              <Icon name="power-button" width={18} height={18} color={gangOn ? gangColor : colors.textTertiary} />
            </View>
            <AppText variant="caption" color={colors.textSecondary} align="center" numberOfLines={1}>
              Switch {index + 1}
            </AppText>
            <AppText
              variant="micro"
              color={gangOn ? gangColor : colors.textTertiary}
              align="center"
            >
              {gangOn ? 'ON' : 'OFF'}
            </AppText>
          </AnimatedPressable>
        );
      })}
    </View>
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardDisabled: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  deviceIconBox: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceIconBoxOn: {
    backgroundColor: colors.secondarySoft,
  },
  headerText: {
    flex: 1,
  },
  mainPowerBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gangRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  gangCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  gangIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
});

export default SmartSwitchDeviceCard;
