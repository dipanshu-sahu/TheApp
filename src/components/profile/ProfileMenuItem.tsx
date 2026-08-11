import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
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
}) => {
  const accent = destructive ? colors.error : colors.primary;

  return (
    <AnimatedPressable
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}
      pressScale={onPress ? 0.98 : 1}
      enforceTouchTarget={false}
    >
      <View style={[styles.menuIconBox, { backgroundColor: destructive ? colors.errorSoft : colors.primarySoft }]}>
        <Icon name={icon} width={20} height={20} fill={accent} stroke={accent} />
      </View>
      <View style={styles.menuTextWrap}>
        <AppText variant="bodyLgStrong" color={destructive ? colors.error : colors.textPrimary}>
          {label}
        </AppText>
        {value ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.menuValue} numberOfLines={1}>
            {value}
          </AppText>
        ) : null}
      </View>
      {showChevron && onPress ? (
        <Icon name="arrow-next" width={18} height={18} fill={colors.textTertiary} />
      ) : null}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuValue: {
    marginTop: 2,
  },
});

export default ProfileMenuItem;
