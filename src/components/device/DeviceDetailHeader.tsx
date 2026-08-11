import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';

type DeviceDetailHeaderProps = {
  title: string;
  onClose: () => void;
  onMore?: () => void;
};

const IconButton: React.FC<{ icon: 'more' | 'close'; onPress: () => void; size: number }> = ({
  icon,
  onPress,
  size,
}) => (
  <AnimatedPressable style={styles.iconBtn} onPress={onPress} pressScale={0.88}>
    <Icon name={icon} width={size} height={size} fill={colors.textSecondary} />
  </AnimatedPressable>
);

const DeviceDetailHeader: React.FC<DeviceDetailHeaderProps> = ({ title, onClose, onMore }) => (
  <View style={styles.header}>
    <View style={styles.side} />
    <AppText variant="title" numberOfLines={1} style={styles.title}>
      {title}
    </AppText>
    <View style={[styles.side, styles.sideRight]}>
      {onMore ? <IconButton icon="more" onPress={onMore} size={20} /> : null}
      <IconButton icon="close" onPress={onClose} size={18} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  side: {
    width: 76,
  },
  sideRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DeviceDetailHeader;
