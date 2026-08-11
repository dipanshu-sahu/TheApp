import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import AppText from '../ui/AppText';
import Icon from '../Icon';
import { IconName } from '../../types/icons';
import { enterDown, enterUp } from '../ui/motion';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';

type AuthHeaderVariant = 'login' | 'signup';

type AuthHeaderProps = {
  variant: AuthHeaderVariant;
  title: string;
  subtitle: string;
};

const GRADIENTS: Record<AuthHeaderVariant, [string, string]> = {
  login: [colors.gradPrimaryStart, colors.gradPrimaryEnd],
  signup: [colors.gradSuccessStart, colors.gradSuccessEnd],
};

const BADGE_ICON: Record<AuthHeaderVariant, IconName> = {
  login: 'home',
  signup: 'profile',
};

const AuthHeader: React.FC<AuthHeaderProps> = ({ variant, title, subtitle }) => {
  const stops = GRADIENTS[variant];
  return (
    <View style={styles.wrapper}>
      <Animated.View entering={enterDown(0)} style={[styles.badge, shadows.glow]}>
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id={`authBadge-${variant}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={stops[0]} />
              <Stop offset="1" stopColor={stops[1]} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={radii.lg} fill={`url(#authBadge-${variant})`} />
        </Svg>
        <Icon name={BADGE_ICON[variant]} width={28} height={28} color={colors.white} strokeWidth={1.7} />
      </Animated.View>
      <Animated.View entering={enterUp(1)}>
        <AppText variant="h1" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="bodyLg" color={colors.textSecondary}>
          {subtitle}
        </AppText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xxl,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  title: {
    marginBottom: spacing.xs,
  },
});

export default AuthHeader;
