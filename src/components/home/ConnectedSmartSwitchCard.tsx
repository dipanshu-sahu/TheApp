import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { colors } from '../../themes/colors';
import { useSmartSwitchControl } from '../../hooks/useSmartSwitchControl';
import { DeviceInfo } from '../../types/device';
import SmartSwitchDeviceCard from './SmartSwitchDeviceCard';

type ConnectedSmartSwitchCardProps = {
  device: DeviceInfo;
  onPress: () => void;
};

const ConnectedSmartSwitchCard: React.FC<ConnectedSmartSwitchCardProps> = ({
  device,
  onPress,
}) => {
  const {
    gangStates,
    mainOn,
    isSending,
    setGangAtIndex,
    setMainToggle,
  } = useSmartSwitchControl(device);

  const subtitle = device.location ? ` · ${device.location}` : '';

  return (
    <View style={styles.wrapper}>
      <SmartSwitchDeviceCard
        name={`${device.name}${subtitle}`}
        isOn={mainOn}
        gangStates={gangStates}
        disabled={isSending}
        onMainToggle={value => setMainToggle(value)}
        onGangToggle={(index, value) => setGangAtIndex(index, value)}
        onPress={onPress}
      />
      {isSending ? (
        <View style={styles.sendingOverlay}>
          <ActivityIndicator color={colors.accent} size="small" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  sendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 26, 0.35)',
    borderRadius: 16,
    marginBottom: 12,
  },
});

export default ConnectedSmartSwitchCard;
