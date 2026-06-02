import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon, { IconName } from '../Icon';
import ToggleSwitch from './ToggleSwitch';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type HomeDeviceCardProps = {
  name: string;
  statusLabel: string;
  icon: IconName;
  isOn: boolean;
  onToggle: (value: boolean) => void;
  onPress: () => void;
};

const HomeDeviceCard: React.FC<HomeDeviceCardProps> = ({
  name,
  statusLabel,
  icon,
  isOn,
  onToggle,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.topRow}>
      <View style={styles.iconBox}>
        <Icon name={icon} width={20} height={20} color={colors.accent} />
      </View>
      <ToggleSwitch value={isOn} onValueChange={onToggle} />
    </View>
    <Text style={styles.name} numberOfLines={1}>
      {name}
    </Text>
    <Text style={[styles.status, isOn && styles.statusOn]}>{statusLabel}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 14,
    minHeight: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.accent}22`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...textFont.boldM,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  status: {
    ...textFont.regularS,
    color: colors.textGrey,
  },
  statusOn: {
    color: colors.accent,
  },
});

export default HomeDeviceCard;
