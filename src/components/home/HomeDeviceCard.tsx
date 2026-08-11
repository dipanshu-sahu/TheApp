import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { IconName } from '../Icon';
import ToggleSwitch from './ToggleSwitch';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors, withAlpha } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';

type HomeDeviceCardProps = {
  name: string;
  statusLabel: string;
  icon: IconName;
  isOn: boolean;
  accent?: string;
  onToggle: (value: boolean) => void;
  onPress: () => void;
};

const HomeDeviceCard: React.FC<HomeDeviceCardProps> = ({
  name,
  statusLabel,
  icon,
  isOn,
  accent = colors.primary,
  onToggle,
  onPress,
}) => (
  <AnimatedPressable
    style={[styles.card, shadows.sm]}
    onPress={onPress}
    pressScale={0.97}
    enforceTouchTarget={false}
  >
    <View style={styles.topRow}>
      <View style={[styles.iconBox, { backgroundColor: isOn ? withAlpha(accent, 0.18) : colors.surfaceSubtle }]}>
        <Icon name={icon} width={22} height={22} color={isOn ? accent : colors.textSecondary} />
      </View>
      <ToggleSwitch value={isOn} onValueChange={onToggle} />
    </View>

    <AppText variant="bodyLgStrong" numberOfLines={1} style={styles.name}>
      {name}
    </AppText>

    <View style={styles.statusRow}>
      <View style={[styles.statusDot, { backgroundColor: isOn ? colors.success : colors.textTertiary }]} />
      <AppText variant="caption" color={isOn ? colors.textSecondary : colors.textTertiary} numberOfLines={1}>
        {statusLabel}
      </AppText>
    </View>
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    padding: spacing.md,
    minHeight: 132,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginBottom: spacing.xxs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});

export default HomeDeviceCard;
