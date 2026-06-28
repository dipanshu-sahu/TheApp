import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { IconName } from '../../types/icons';

export type ProfileMenuItemProps = {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  value,
  onPress,
  destructive = false,
  showChevron = true,
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={onPress ? 0.75 : 1}
    disabled={!onPress}
  >
    <View style={[styles.menuIconBox, destructive && styles.menuIconBoxDanger]}>
      <Icon
        name={icon}
        width={20}
        height={20}
        fill={destructive ? colors.error : colors.accent}
        stroke={destructive ? colors.error : colors.accent}
      />
    </View>
    <View style={styles.menuTextWrap}>
      <Text style={[styles.menuLabel, destructive && styles.menuLabelDanger]}>
        {label}
      </Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
    </View>
    {showChevron && onPress ? (
      <Icon name="arrow-next" width={18} height={18} fill={colors.textGrey} />
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBoxDanger: {
    backgroundColor: `${colors.error}18`,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  menuValue: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default ProfileMenuItem;
