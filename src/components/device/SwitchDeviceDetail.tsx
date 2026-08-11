import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { useSmartSwitchControl } from '../../hooks/useSmartSwitchControl';
import { getSwitchGangCountFromDevice } from '../../utils/deviceMapper';
import { DeviceInfo } from '../../types/device';
import DeviceDetailHeader from './DeviceDetailHeader';
import EditNameModal from './EditNameModal';

type SwitchDeviceDetailProps = {
  device: DeviceInfo;
  onClose: () => void;
};

const SwitchDeviceDetail: React.FC<SwitchDeviceDetailProps> = ({
  device,
  onClose,
}) => {
  const {
    gangStates,
    sortedPins,
    isLoading,
    isSending,
    setGangAtIndex,
    setAllGangs,
  } = useSmartSwitchControl(device, { refreshOnMount: true });

  const gangCount = sortedPins.length || getSwitchGangCountFromDevice(device);
  const defaultNames = useMemo(
    () =>
      Array.from({ length: gangCount }, (_, i) => {
        const pin = sortedPins[i];
        return pin ? `Pin ${pin.pinNumber}` : `Switch ${i + 1}`;
      }),
    [gangCount, sortedPins],
  );

  const [gangNames, setGangNames] = useState(defaultNames);

  useEffect(() => {
    setGangNames(defaultNames);
  }, [defaultNames]);

  const [editVisible, setEditVisible] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(gangNames[index]);
    setEditVisible(true);
  };

  const handleConfirmEdit = () => {
    if (editingIndex === null) {
      return;
    }
    const trimmed = editValue.trim();
    if (trimmed) {
      setGangNames(prev => {
        const next = [...prev];
        next[editingIndex] = trimmed;
        return next;
      });
    }
    setEditVisible(false);
    setEditingIndex(null);
  };

  const toggleGang = (index: number) => {
    if (isLoading || isSending) {
      return;
    }
    setGangAtIndex(index, !gangStates[index]);
  };

  const gridRows = useMemo(() => {
    const rows: number[][] = [];
    for (let i = 0; i < gangCount; i += 2) {
      rows.push([i, i + 1].filter(index => index < gangCount));
    }
    return rows;
  }, [gangCount]);

  const controlsDisabled = isLoading || isSending;

  return (
    <View style={styles.container}>
      <DeviceDetailHeader title={device.name} onClose={onClose} />

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading switch state…</Text>
        </View>
      ) : (
        <View style={[styles.grid, controlsDisabled && styles.gridDisabled]}>
          {gridRows.map(row => (
            <View key={row.join('-')} style={styles.gridRow}>
              {row.map(index => {
                const isOn = gangStates[index] ?? false;
                return (
                  <Pressable
                    key={index}
                    style={[styles.tile, isOn && styles.tileOn]}
                    onPress={() => toggleGang(index)}
                    onLongPress={() => openEdit(index)}
                    delayLongPress={400}
                    disabled={controlsDisabled}
                  >
                    <Text style={[styles.tileLabel, isOn && styles.tileLabelOn]}>
                      {gangNames[index] ?? `Switch ${index + 1}`}
                    </Text>
                    {isOn ? <View style={styles.tileGlowLine} /> : null}
                  </Pressable>
                );
              })}
              {row.length === 1 ? <View style={styles.tileSpacer} /> : null}
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setAllGangs(true)}
          activeOpacity={0.85}
          disabled={controlsDisabled}
        >
          <View style={[styles.bottomCircle, styles.bottomCircleOn]}>
            <Text style={styles.bottomOnText}>ON</Text>
          </View>
          <Text style={styles.bottomLabel}>All On</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.85} disabled>
          <View style={styles.bottomCircle}>
            <Text style={styles.timerEmoji}>⏱</Text>
          </View>
          <Text style={styles.bottomLabel}>Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => openEdit(0)}
          activeOpacity={0.85}
        >
          <View style={styles.bottomCircle}>
            <Icon name="settings" width={22} height={22} stroke={colors.textSecondary} />
          </View>
          <Text style={styles.bottomLabel}>Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setAllGangs(false)}
          activeOpacity={0.85}
          disabled={controlsDisabled}
        >
          <View style={[styles.bottomCircle, styles.bottomCircleOff]}>
            <Text style={styles.bottomOffText}>OFF</Text>
          </View>
          <Text style={styles.bottomLabel}>All Off</Text>
        </TouchableOpacity>
      </View>

      {isSending ? (
        <View style={styles.sendingBar}>
          <ActivityIndicator color={colors.accent} size="small" />
          <Text style={styles.sendingText}>Sending command…</Text>
        </View>
      ) : null}

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
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
  grid: {
    flex: 1,
    gap: 12,
    paddingTop: 8,
  },
  gridDisabled: {
    opacity: 0.75,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
    minHeight: 140,
  },
  tileOn: {
    backgroundColor: '#1A3A6B',
    borderColor: colors.link,
  },
  tileSpacer: {
    flex: 1,
  },
  tileLabel: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
  tileLabelOn: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
  tileGlowLine: {
    position: 'absolute',
    bottom: 20,
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.link,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 8,
  },
  bottomBtn: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  bottomCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
  bottomOnText: {
    ...textFont.boldM,
    color: colors.bgPrimary,
  },
  bottomOffText: {
    ...textFont.boldM,
    color: colors.textSecondary,
  },
  timerEmoji: {
    fontSize: 22,
  },
  bottomLabel: {
    ...textFont.regularS,
    color: colors.textSecondary,
  },
  sendingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 4,
  },
  sendingText: {
    ...textFont.regularS,
    color: colors.textSecondary,
  },
});

export default SwitchDeviceDetail;
