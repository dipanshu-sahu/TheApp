import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import Icon from '../Icon';

const STEPS = ['Email', 'OTP', 'Reset'] as const;

type ForgotPasswordStep = 1 | 2 | 3;

type ForgotPasswordStepperProps = {
  currentStep: ForgotPasswordStep;
};

const ForgotPasswordStepper: React.FC<ForgotPasswordStepperProps> = ({ currentStep }) => (
  <View style={styles.wrapper}>
    {STEPS.map((label, index) => {
      const stepNumber = (index + 1) as ForgotPasswordStep;
      const isCompleted = stepNumber < currentStep;
      const isActive = stepNumber === currentStep;
      const isDone = isActive || isCompleted;

      return (
        <React.Fragment key={label}>
          <View style={styles.stepItem}>
            <View
              style={[
                styles.circle,
                isDone ? styles.circleActive : styles.circleInactive,
              ]}
            >
              {isCompleted ? (
                <Icon name="check" width={14} height={14} color={colors.white} />
              ) : (
                <AppText variant="bodyStrong" color={isActive ? colors.white : colors.textTertiary}>
                  {stepNumber}
                </AppText>
              )}
            </View>
            <AppText variant="caption" color={isDone ? colors.textPrimary : colors.textTertiary}>
              {label}
            </AppText>
          </View>
          {index < STEPS.length - 1 ? (
            <View style={[styles.connector, stepNumber < currentStep && styles.connectorActive]} />
          ) : null}
        </React.Fragment>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xs,
  },
  stepItem: {
    alignItems: 'center',
    width: 56,
    gap: spacing.xxs + 2,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: colors.primary,
  },
  circleInactive: {
    backgroundColor: colors.glass,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: colors.lineGrey,
    marginTop: 16,
    marginHorizontal: spacing.xxs,
    borderRadius: 1,
  },
  connectorActive: {
    backgroundColor: colors.primary,
  },
});

export default ForgotPasswordStepper;
