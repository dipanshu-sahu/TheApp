import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';
import { enterDown } from '../ui/motion';
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
  size = 34,
}) => (
  <Animated.View
    entering={enterDown(0)}
    style={[
      styles.badge,
      shadows.md,
      { backgroundColor: variant === 'gold' ? colors.authBadgeGold : colors.authBadgeBlue },
    ]}
  >
    <Icon
      name={icon}
      width={size}
      height={size}
      color={variant === 'gold' ? colors.cta : colors.primary}
      strokeWidth={1.7}
    />
  </Animated.View>
);

const styles = StyleSheet.create({
  badge: {
    width: 76,
    height: 76,
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
});

export default AuthIconBadge;
