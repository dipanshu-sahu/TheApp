import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import GlassCard from '../components/ui/GlassCard';
import Icon from '../components/Icon';
import { enterFade, enterUp } from '../components/ui/motion';
import { colors, withAlpha } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';
import { AppDispatch, RootState } from '../store/store';
import { fetchDevices } from '../slices/deviceSlice';
import HomeDeviceCard from '../components/home/HomeDeviceCard';
import { getDeviceIcon, getDeviceStatusLabel, getDeviceTint, isDeviceOnline } from '../utils/deviceDisplay';
import { DeviceInfo } from '../types/device';
import { MyHomeStackParamList } from '../navigation';

const Devices: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyHomeStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { devices, isLoading, error } = useSelector((state: RootState) => state.devices);

  const [toggleState, setToggleState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (devices?.length) {
      setToggleState(prev => {
        const next = { ...prev };
        devices.forEach((device, index) => {
          if (next[device.id] === undefined) {
            next[device.id] = isDeviceOnline(device) || index % 2 === 0;
          }
        });
        return next;
      });
    }
  }, [devices]);

  const devicePairs = useMemo(() => {
    const list = devices ?? [];
    const pairs: DeviceInfo[][] = [];
    for (let i = 0; i < list.length; i += 2) {
      pairs.push(list.slice(i, i + 2));
    }
    return pairs;
  }, [devices]);

  const totalCount = devices?.length ?? 0;
  const onlineCount = useMemo(
    () => (devices ?? []).filter(d => toggleState[d.id] ?? isDeviceOnline(d)).length,
    [devices, toggleState],
  );

  return (
    <Screen edges={['top']} scroll contentContainerStyle={styles.scrollContent}>
      <Animated.View entering={enterFade(0)} style={styles.header}>
        <AppText variant="h1">My Devices</AppText>
        <AppText variant="bodyLg" color={colors.textSecondary} style={styles.subtitle}>
          {totalCount > 0
            ? `${onlineCount} of ${totalCount} devices active`
            : 'Manage all your connected hardware'}
        </AppText>
      </Animated.View>

      {totalCount > 0 ? (
        <Animated.View entering={enterUp(1)} style={styles.summaryRow}>
          <GlassCard variant="soft" sheen={false} style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: withAlpha(colors.secondary, 0.16) }]}>
              <Icon name="wifi" width={18} height={18} color={colors.secondary} />
            </View>
            <View>
              <AppText variant="title" color={colors.secondary}>
                {onlineCount}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Online
              </AppText>
            </View>
          </GlassCard>
          <GlassCard variant="soft" sheen={false} style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: withAlpha(colors.primary, 0.16) }]}>
              <Icon name="devices" width={18} height={18} color={colors.primary} />
            </View>
            <View>
              <AppText variant="title" color={colors.primary}>
                {totalCount}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Total
              </AppText>
            </View>
          </GlassCard>
        </Animated.View>
      ) : null}

      {isLoading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

      {error && !totalCount ? (
        <Animated.View entering={enterUp(1)} style={styles.errorChip}>
          <Icon name="wifi" width={16} height={16} color={colors.error} />
          <AppText variant="caption" color={colors.error} style={styles.errorText}>
            {error}
          </AppText>
        </Animated.View>
      ) : null}

      {!isLoading && !totalCount && !error ? (
        <GlassCard style={styles.emptyCard}>
          <Icon name="plug" width={32} height={32} color={colors.textTertiary} />
          <AppText variant="bodyLg" color={colors.textSecondary} align="center">
            No devices yet. Tap + to add your first device.
          </AppText>
        </GlassCard>
      ) : null}

      {devicePairs.map((pair, rowIndex) => (
        <Animated.View
          key={pair.map(d => d.id).join('-')}
          entering={enterUp(rowIndex + 2)}
          style={styles.row}
        >
          {pair.map((device, colIndex) => {
            const isOn = toggleState[device.id] ?? isDeviceOnline(device);
            const icon = getDeviceIcon(device.name);
            return (
              <View key={device.id} style={styles.col}>
                <HomeDeviceCard
                  name={device.name}
                  statusLabel={
                    isOn
                      ? getDeviceStatusLabel({ ...device, status: 'online' }, colIndex)
                      : 'Off'
                  }
                  icon={icon}
                  accent={getDeviceTint(icon)}
                  isOn={isOn}
                  onToggle={value => setToggleState(prev => ({ ...prev, [device.id]: value }))}
                  onPress={() => navigation.navigate('Device', { deviceId: device.id })}
                />
              </View>
            );
          })}
          {pair.length === 1 ? <View style={styles.col} /> : null}
        </Animated.View>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xxs,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  col: {
    flex: 1,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  errorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.errorSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  errorText: {
    flexShrink: 1,
  },
  emptyCard: {
    marginTop: spacing.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export default Devices;
