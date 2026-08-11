import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from '../Icon';
import ToggleSwitch from '../home/ToggleSwitch';
import AppText from '../ui/AppText';
import GlassCard from '../ui/GlassCard';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors, withAlpha } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { durations } from '../../themes/motion';
import { DeviceInfo } from '../../types/device';
import DeviceDetailHeader from './DeviceDetailHeader';
import EditNameModal from './EditNameModal';

type PlugDeviceDetailProps = {
  device: DeviceInfo;
  onClose: () => void;
};

const ACCENT = colors.secondary;

const StatBox: React.FC<{ value: string; label: string; icon: 'zap' | 'power-button' }> = ({
  value,
  label,
  icon,
}) => (
  <GlassCard variant="soft" style={styles.statBox}>
    <View style={styles.statIcon}>
      <Icon name={icon} width={18} height={18} color={ACCENT} />
    </View>
    <View>
      <AppText variant="h3">{value}</AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
    </View>
  </GlassCard>
);

const PlugDeviceDetail: React.FC<PlugDeviceDetailProps> = ({ device, onClose }) => {
  const [deviceName, setDeviceName] = useState(device.name);
  const [isOn, setIsOn] = useState(device.status?.toLowerCase() === 'online');
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editValue, setEditValue] = useState(deviceName);

  const glow = useSharedValue(0);

  useEffect(() => {
    if (isOn) {
      glow.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    } else {
      glow.value = withTiming(0, { duration: durations.base });
    }
  }, [isOn, glow]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.45,
  }));

  const handleConfirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      setDeviceName(trimmed);
    }
    setEditVisible(false);
  };

  const openEdit = () => {
    setEditValue(deviceName);
    setEditVisible(true);
  };

  return (
    <View style={styles.container}>
      <DeviceDetailHeader title={deviceName} onClose={onClose} onMore={openEdit} />

      <View style={styles.hero}>
        <View style={styles.ringWrap}>
          {isOn ? (
            <Animated.View style={[styles.glow, { backgroundColor: ACCENT }, glowStyle]} />
          ) : null}
          <View style={[styles.iconRing, isOn && { backgroundColor: withAlpha(ACCENT, 0.16) }]}>
            <Icon name="plug" width={52} height={52} color={isOn ? ACCENT : colors.textTertiary} strokeWidth={1.6} />
          </View>
        </View>
        <AppText variant="h3">{isOn ? 'On · Powered' : 'Off'}</AppText>
        {device.location ? (
          <AppText variant="body" color={colors.textSecondary} style={styles.location}>
            {device.location}
          </AppText>
        ) : null}
      </View>

      <GlassCard variant="soft" style={styles.controlCard}>
        <View style={styles.controlIcon}>
          <Icon name="power-button" width={20} height={20} color={isOn ? ACCENT : colors.textSecondary} />
        </View>
        <AppText variant="title" style={styles.controlLabel}>
          Outlet
        </AppText>
        <ToggleSwitch value={isOn} onValueChange={setIsOn} />
      </GlassCard>

      <View style={styles.statsRow}>
        <StatBox value="0.4 A" label="Current" icon="zap" />
        <StatBox value="92 W" label="Power" icon="power-button" />
      </View>

      <GlassCard variant="soft" style={styles.controlCard} sheen={false}>
        <View style={styles.controlIcon}>
          <Icon name="clock" width={20} height={20} color={autoEnabled ? colors.cta : colors.textSecondary} />
        </View>
        <View style={styles.controlLabel}>
          <AppText variant="title">Automation</AppText>
          <AppText variant="micro" color={colors.textTertiary}>
            {autoEnabled ? 'Scheduled rules active' : 'Schedule on/off times'}
          </AppText>
        </View>
        <ToggleSwitch value={autoEnabled} onValueChange={setAutoEnabled} />
      </GlassCard>

      <AnimatedPressable style={styles.editRow} onPress={openEdit} pressScale={0.98} enforceTouchTarget={false}>
        <AppText variant="bodyLg">Edit device name</AppText>
        <Icon name="arrow-next" width={16} height={16} color={colors.textTertiary} />
      </AnimatedPressable>

      <EditNameModal
        visible={editVisible}
        value={editValue}
        onChangeText={setEditValue}
        onCancel={() => setEditVisible(false)}
        onConfirm={handleConfirmEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  iconRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    marginTop: spacing.xxs,
  },
  controlCard: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlLabel: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statBox: {
    flex: 1,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: withAlpha(ACCENT, 0.16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  editRow: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default PlugDeviceDetail;
