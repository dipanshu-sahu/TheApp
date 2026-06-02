import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { getSwitchGangCount } from '../../utils/deviceDisplay';
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
  const gangCount = getSwitchGangCount(device.name);
  const defaultNames = useMemo(
    () => Array.from({ length: gangCount }, (_, i) => `Switch ${i + 1}`),
    [gangCount],
  );

  const [gangNames, setGangNames] = useState(defaultNames);
  const [gangStates, setGangStates] = useState<boolean[]>(() =>
    Array.from({ length: gangCount }, () => device.status?.toLowerCase() === 'online'),
  );
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
    setGangStates(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const setAllGangs = (value: boolean) => {
    setGangStates(Array.from({ length: gangCount }, () => value));
  };

  const gridRows = useMemo(() => {
    const rows: number[][] = [];
    for (let i = 0; i < gangCount; i += 2) {
      rows.push([i, i + 1].filter(index => index < gangCount));
    }
    return rows;
  }, [gangCount]);

  return (
    <View style={styles.container}>
      <DeviceDetailHeader title={device.name} onClose={onClose} />

      <View style={styles.grid}>
        {gridRows.map(row => (
          <View key={row.join('-')} style={styles.gridRow}>
            {row.map(index => {
              const isOn = gangStates[index];
              return (
                <Pressable
                  key={index}
                  style={[styles.tile, isOn && styles.tileOn]}
                  onPress={() => toggleGang(index)}
                  onLongPress={() => openEdit(index)}
                  delayLongPress={400}
                >
                  <Text style={[styles.tileLabel, isOn && styles.tileLabelOn]}>
                    {gangNames[index]}
                  </Text>
                  {isOn ? <View style={styles.tileGlowLine} /> : null}
                </Pressable>
              );
            })}
            {row.length === 1 ? <View style={styles.tileSpacer} /> : null}
          </View>
        ))}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setAllGangs(true)}
          activeOpacity={0.85}
        >
          <View style={[styles.bottomCircle, styles.bottomCircleOn]}>
            <Text style={styles.bottomOnText}>ON</Text>
          </View>
          <Text style={styles.bottomLabel}>All On</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} activeOpacity={0.85}>
          <View style={styles.bottomCircle}>
            <Text style={styles.timerEmoji}>⏰</Text>
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
        >
          <View style={[styles.bottomCircle, styles.bottomCircleOff]}>
            <Text style={styles.bottomOffText}>OFF</Text>
          </View>
          <Text style={styles.bottomLabel}>All Off</Text>
        </TouchableOpacity>
      </View>

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
  grid: {
    flex: 1,
    gap: 12,
    paddingTop: 8,
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
});

export default SwitchDeviceDetail;
