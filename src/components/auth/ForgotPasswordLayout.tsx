import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Screen from '../ui/Screen';
import AppText from '../ui/AppText';
import GlassCard from '../ui/GlassCard';
import { enterFade, enterUp } from '../ui/motion';
import { spacing } from '../../themes/spacing';
import AuthBackLink from './AuthBackLink';
import AuthIconBadge from './AuthIconBadge';
import ForgotPasswordStepper from './ForgotPasswordStepper';
import { IconName } from '../Icon';

type ForgotPasswordStep = 1 | 2 | 3;

type ForgotPasswordLayoutProps = {
  step: ForgotPasswordStep;
  icon: IconName;
  iconVariant?: 'gold' | 'blue';
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Single-column grid: back → badge → title → stepper → form → footer. */
const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({
  step,
  icon,
  iconVariant = 'gold',
  title,
  description,
  children,
  footer,
  contentStyle,
}) => (
  <Screen
    scroll
    keyboardAvoiding
    edges={['top', 'bottom']}
    contentContainerStyle={[styles.container, contentStyle]}
  >
    <View style={styles.column}>
      <AuthBackLink />

      <Animated.View entering={enterFade(0)} style={styles.badgeWrap}>
        <AuthIconBadge icon={icon} variant={iconVariant} />
      </Animated.View>

      <Animated.View entering={enterUp(1)} style={styles.copy}>
        <AppText variant="h1" style={styles.title}>
          {title}
        </AppText>
        <View style={styles.description}>{description}</View>
      </Animated.View>

      <ForgotPasswordStepper currentStep={step} />

      <Animated.View entering={enterUp(2)}>
        <GlassCard variant="soft" sheen={false} style={styles.formCard}>
          {children}
        </GlassCard>
      </Animated.View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  </Screen>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  column: {
    width: '100%',
    alignItems: 'stretch',
  },
  badgeWrap: {
    alignItems: 'flex-start',
  },
  copy: {
    width: '100%',
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.xl,
  },
  formCard: {
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});

export default ForgotPasswordLayout;
