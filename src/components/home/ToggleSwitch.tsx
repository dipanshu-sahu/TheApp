import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => onValueChange(!value)}
    style={[styles.track, value ? styles.trackOn : styles.trackOff]}
  >
    <View style={styles.thumb} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.switchTrackOff,
    padding: 3,
    justifyContent: 'center',
  },
  trackOff: {
    alignItems: 'flex-start',
  },
  trackOn: {
    backgroundColor: colors.accent,
    alignItems: 'flex-end',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.switchThumb,
  },
});

export default ToggleSwitch;
