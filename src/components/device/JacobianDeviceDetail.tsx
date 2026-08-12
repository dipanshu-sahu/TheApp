import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from '../Icon';
import AppText from '../ui/AppText';
import { colors, withAlpha } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { DeviceInfo } from '../../types/device';
import { ChannelView, CurtainAction, useJacobianDevice } from '../../hooks/useJacobianDevice';
import DeviceDetailHeader from './DeviceDetailHeader';
import EditNameModal from './EditNameModal';
import ChannelTile from './channels/ChannelTile';

type JacobianDeviceDetailProps = {
  device: DeviceInfo;
  onClose: () => void;
};

const DOORBELL_PULSE_MS = 900;

const isWideChannel = (view: ChannelView): boolean =>
  view.channel.kind === 'curtain' || view.channel.kind === 'doorbell';

/**
 * Control panel for any Jacobian product. The decoded product code decides
 * which tile each gang gets: on/off for switches and sockets, a +/- range for
 * fans and dimmers, direction buttons for curtains, and a chime card for
 * doorbells.
 */
const JacobianDeviceDetail: React.FC<JacobianDeviceDetailProps> = ({ device, onClose }) => {
  const {
    profile,
    channels,
    activeCount,
    isLoading,
    isSending,
    toggleChannel,
    setChannelOn,
    stepChannelLevel,
    setCurtain,
    setAll,
  } = useJacobianDevice(device);

  const defaultNames = useMemo(
    () =>
      channels.reduce<Record<string, string>>((acc, view) => {
        acc[view.channel.id] = view.channel.label;
        return acc;
      }, {}),
    [channels],
  );

  const [names, setNames] = useState<Record<string, string>>(defaultNames);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNames(current => ({ ...defaultNames, ...current }));
  }, [defaultNames]);

  useEffect(
    () => () => {
      if (pulseTimer.current) {
        clearTimeout(pulseTimer.current);
      }
    },
    [],
  );

  const openRename = useCallback(
    (channelId: string, currentName: string) => {
      setEditingId(channelId);
      setEditValue(currentName);
    },
    [],
  );

  const confirmRename = useCallback(() => {
    const trimmed = editValue.trim();
    if (editingId && trimmed) {
      setNames(current => ({ ...current, [editingId]: trimmed }));
    }
    setEditingId(null);
  }, [editValue, editingId]);

  const ringDoorbell = useCallback(
    (channelId: string) => {
      setChannelOn(channelId, true);
      if (pulseTimer.current) {
        clearTimeout(pulseTimer.current);
      }
      pulseTimer.current = setTimeout(
        () => setChannelOn(channelId, false),
        DOORBELL_PULSE_MS,
      );
    },
    [setChannelOn],
  );

  const rows = useMemo(() => {
    const result: ChannelView[][] = [];
    let pending: ChannelView[] = [];

    channels.forEach(view => {
      if (isWideChannel(view)) {
        if (pending.length) {
          result.push(pending);
          pending = [];
        }
        result.push([view]);
        return;
      }
      pending.push(view);
      if (pending.length === 2) {
        result.push(pending);
        pending = [];
      }
    });

    if (pending.length) {
      result.push(pending);
    }
    return result;
  }, [channels]);

  const controlsDisabled = isLoading || isSending;
  const hasToggleableChannels = channels.some(
    view => view.channel.kind !== 'curtain' && view.channel.kind !== 'doorbell',
  );

  const handleChannelPress = useCallback(
    (view: ChannelView) => {
      if (view.channel.kind === 'doorbell') {
        ringDoorbell(view.channel.id);
        return;
      }
      toggleChannel(view.channel.id);
    },
    [ringDoorbell, toggleChannel],
  );

  return (
    <View style={styles.container}>
      <DeviceDetailHeader
        title={device.name}
        onClose={onClose}
        onMore={
          channels.length
            ? () => openRename(channels[0].channel.id, names[channels[0].channel.id] ?? '')
            : undefined
        }
      />

      <View style={styles.metaRow}>
        {profile.code ? (
          <View style={styles.codeChip}>
            <AppText variant="micro" color={colors.primary}>
              {profile.code.toUpperCase()}
            </AppText>
          </View>
        ) : null}
        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1} style={styles.summary}>
          {profile.summary || 'No controls detected'}
        </AppText>
        <AppText variant="caption" color={activeCount ? colors.secondary : colors.textTertiary}>
          {`${activeCount} on`}
        </AppText>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
          <AppText variant="body" color={colors.textSecondary}>
            Loading device state…
          </AppText>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {rows.map(row => (
            <View key={row.map(view => view.channel.id).join('-')} style={styles.gridRow}>
              {row.map(view => (
                <ChannelTile
                  key={view.channel.id}
                  view={view}
                  name={names[view.channel.id] ?? view.channel.label}
                  style={styles.tile}
                  onToggle={() => handleChannelPress(view)}
                  onStep={(direction: 1 | -1) => stepChannelLevel(view.channel, direction)}
                  onCurtain={(action: CurtainAction) => setCurtain(view.channel.id, action)}
                  onRename={() =>
                    openRename(view.channel.id, names[view.channel.id] ?? view.channel.label)
                  }
                />
              ))}
              {row.length === 1 && !isWideChannel(row[0]) ? (
                <View style={styles.tileSpacer} />
              ) : null}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setAll(true)}
          activeOpacity={0.85}
          disabled={controlsDisabled || !hasToggleableChannels}
        >
          <View style={[styles.bottomCircle, styles.bottomCircleOn]}>
            <AppText variant="bodyLgStrong" color={colors.bgPrimary}>
              ON
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            All On
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.85} disabled>
          <View style={styles.bottomCircle}>
            <Icon name="clock" width={22} height={22} color={colors.textSecondary} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            Timer
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBtn}
          activeOpacity={0.85}
          disabled={!channels.length}
          onPress={() =>
            channels.length &&
            openRename(channels[0].channel.id, names[channels[0].channel.id] ?? '')
          }
        >
          <View style={styles.bottomCircle}>
            <Icon name="settings" width={22} height={22} color={colors.textSecondary} />
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            Setting
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setAll(false)}
          activeOpacity={0.85}
          disabled={controlsDisabled || !hasToggleableChannels}
        >
          <View style={[styles.bottomCircle, styles.bottomCircleOff]}>
            <AppText variant="bodyLgStrong" color={colors.textSecondary}>
              OFF
            </AppText>
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            All Off
          </AppText>
        </TouchableOpacity>
      </View>

      {isSending ? (
        <View style={styles.sendingBar}>
          <ActivityIndicator color={colors.accent} size="small" />
          <AppText variant="caption" color={colors.textSecondary}>
            Sending command…
          </AppText>
        </View>
      ) : null}

      <EditNameModal
        visible={editingId !== null}
        value={editValue}
        onChangeText={setEditValue}
        onCancel={() => setEditingId(null)}
        onConfirm={confirmRename}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  codeChip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radii.pill,
    backgroundColor: withAlpha(colors.primary, 0.16),
  },
  summary: {
    flex: 1,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
  },
  tileSpacer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  bottomBtn: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  bottomCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCircleOn: {
    backgroundColor: colors.textPrimary,
  },
  bottomCircleOff: {
    backgroundColor: colors.lineGrey,
  },
  sendingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xxs,
  },
});

export default JacobianDeviceDetail;
