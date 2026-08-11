import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import AnimatedPressable from '../ui/AnimatedPressable';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';

type HomeHeaderProps = {
  greeting: string;
  homeTitle: string;
  avatarLabel: string;
  onProfilePress?: () => void;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  greeting,
  homeTitle,
  avatarLabel,
  onProfilePress,
}) => (
  <View style={styles.wrapper}>
    <View style={styles.textBlock}>
      <AppText variant="body" color={colors.textSecondary} style={styles.greeting}>
        {greeting}
      </AppText>
      <AppText variant="h1" numberOfLines={1}>
        {homeTitle}
      </AppText>
    </View>
    <AnimatedPressable
      style={[styles.avatar, shadows.glow]}
      onPress={onProfilePress}
      pressScale={0.92}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
    >
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.gradPrimaryStart} />
            <Stop offset="1" stopColor={colors.gradPrimaryEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={25} fill="url(#avatarGrad)" />
      </Svg>
      <AppText variant="title" color={colors.white}>
        {avatarLabel}
      </AppText>
    </AnimatedPressable>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  textBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  greeting: {
    marginBottom: spacing.xxs,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default HomeHeader;
