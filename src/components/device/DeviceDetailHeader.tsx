import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type DeviceDetailHeaderProps = {
  title: string;
  onClose: () => void;
  onMore?: () => void;
};

const DeviceDetailHeader: React.FC<DeviceDetailHeaderProps> = ({
  title,
  onClose,
  onMore,
}) => (
  <View style={styles.header}>
    <View style={styles.side} />
    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>
    <View style={[styles.side, styles.sideRight]}>
      {onMore ? (
        <TouchableOpacity onPress={onMore} hitSlop={10} style={styles.iconBtn}>
          <Icon name="more" width={20} height={20} fill={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity onPress={onClose} hitSlop={10} style={styles.iconBtn}>
        <Icon name="close" width={18} height={18} fill={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  side: {
    width: 72,
  },
  sideRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...textFont.boldM,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DeviceDetailHeader;
