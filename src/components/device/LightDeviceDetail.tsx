import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../Icon';
import ToggleSwitch from '../home/ToggleSwitch';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { DeviceInfo } from '../../types/device';
import DeviceDetailHeader from './DeviceDetailHeader';
import EditNameModal from './EditNameModal';

type LightDeviceDetailProps = {
  device: DeviceInfo;
  onClose: () => void;
};

const LightDeviceDetail: React.FC<LightDeviceDetailProps> = ({
  device,
  onClose,
}) => {
  const [deviceName, setDeviceName] = useState(device.name);
  const [isOn, setIsOn] = useState(device.status?.toLowerCase() === 'online');
  const [brightness] = useState('65%');
  const [editVisible, setEditVisible] = useState(false);
  const [editValue, setEditValue] = useState(deviceName);

  const handleConfirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      setDeviceName(trimmed);
    }
    setEditVisible(false);
  };

  return (
    <View style={styles.container}>
      <DeviceDetailHeader
        title={deviceName}
        onClose={onClose}
        onMore={() => {
          setEditValue(deviceName);
          setEditVisible(true);
        }}
      />

      <View style={styles.hero}>
        <View style={[styles.iconRing, isOn && styles.iconRingOn]}>
          <Icon
            name="intro-lightbulb"
            width={56}
            height={56}
            fill={isOn ? colors.passwordLock : colors.textGrey}
          />
        </View>
        <Text style={styles.status}>{isOn ? `On · ${brightness}` : 'Off'}</Text>
        {device.location ? (
          <Text style={styles.location}>{device.location}</Text>
        ) : null}
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.controlLabel}>Power</Text>
        <ToggleSwitch value={isOn} onValueChange={setIsOn} />
      </View>

      <TouchableOpacity
        style={styles.editRow}
        onPress={() => {
          setEditValue(deviceName);
          setEditVisible(true);
        }}
      >
        <Text style={styles.editRowText}>Edit device name</Text>
        <Icon name="arrow-next" width={16} height={16} fill={colors.textGrey} />
      </TouchableOpacity>

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
    paddingBottom: 24,
  },
  iconRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconRingOn: {
    backgroundColor: `${colors.passwordLock}22`,
    borderColor: colors.passwordLock,
  },
  status: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  location: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 6,
  },
  controlCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  controlLabel: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
  editRow: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editRowText: {
    ...textFont.regularM,
    color: colors.textPrimary,
  },
});

export default LightDeviceDetail;
