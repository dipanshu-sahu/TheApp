import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { SWITCH_GANG_COLORS } from '../../utils/deviceDisplay';

type SmartSwitchDeviceCardProps = {
  name: string;
  isOn: boolean;
  gangStates: boolean[];
  disabled?: boolean;
  onMainToggle: (value: boolean) => void;
  onGangToggle: (index: number, value: boolean) => void;
  onPress: () => void;
};

const SmartSwitchDeviceCard: React.FC<SmartSwitchDeviceCardProps> = ({
  name,
  isOn,
  gangStates,
  disabled = false,
  onMainToggle,
  onGangToggle,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, disabled && styles.cardDisabled]}
    onPress={onPress}
    activeOpacity={0.92}
  >
    <View style={styles.header}>
      <View style={styles.deviceIconBox}>
        <Icon name="power-button" width={18} height={18} fill={colors.textPrimary} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <TouchableOpacity
        style={[styles.mainPowerBtn, isOn && styles.mainPowerBtnOn]}
        onPress={() => !disabled && onMainToggle(!isOn)}
        activeOpacity={0.85}
        hitSlop={8}
        disabled={disabled}
      >
        <Icon
          name="power-button"
          width={20}
          height={20}
          fill={colors.textPrimary}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.gangRow}>
      {gangStates.map((gangOn, index) => {
        const gangColor = SWITCH_GANG_COLORS[index % SWITCH_GANG_COLORS.length];
        return (
          <TouchableOpacity
            key={`gang-${index}`}
            style={styles.gangCol}
            onPress={() => !disabled && onGangToggle(index, !gangOn)}
            activeOpacity={0.85}
            disabled={disabled}
          >
            <Icon
              name="power-button"
              width={18}
              height={18}
              fill={gangColor}
            />
            <Text style={styles.gangLabel}>Switch {index + 1}</Text>
            <Text style={[styles.gangStatus, gangOn && styles.gangStatusOn]}>
              {gangOn ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  cardDisabled: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  deviceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...textFont.boldM,
    color: colors.textPrimary,
    flex: 1,
  },
  mainPowerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.switchTrackOff,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  mainPowerBtnOn: {
    backgroundColor: colors.signupGreen,
  },
  gangRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gangCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  gangLabel: {
    ...textFont.regularS,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  gangStatus: {
    ...textFont.boldS,
    color: colors.textGrey,
    textAlign: 'center',
  },
  gangStatusOn: {
    color: colors.link,
  },
});

export default SmartSwitchDeviceCard;
