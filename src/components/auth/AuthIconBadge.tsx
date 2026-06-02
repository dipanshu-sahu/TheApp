import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import Icon, { IconName } from '../Icon';

type AuthIconBadgeVariant = 'gold' | 'blue';

type AuthIconBadgeProps = {
  icon: IconName;
  variant?: AuthIconBadgeVariant;
  size?: number;
};

const AuthIconBadge: React.FC<AuthIconBadgeProps> = ({
  icon,
  variant = 'gold',
  size = 32,
}) => (
  <View
    style={[
      styles.badge,
      variant === 'gold' ? styles.badgeGold : styles.badgeBlue,
    ]}
  >
    <Icon name={icon} width={size} height={size} />
  </View>
);

const styles = StyleSheet.create({
  badge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  badgeGold: {
    backgroundColor: colors.authBadgeGold,
    shadowColor: colors.passwordLock,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeBlue: {
    backgroundColor: colors.authBadgeBlue,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
});

export default AuthIconBadge;
