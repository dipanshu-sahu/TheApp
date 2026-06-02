import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import Icon from '../Icon';

const STEPS = ['Email', 'OTP', 'Reset'] as const;

type ForgotPasswordStep = 1 | 2 | 3;

type ForgotPasswordStepperProps = {
  currentStep: ForgotPasswordStep;
};

const ForgotPasswordStepper: React.FC<ForgotPasswordStepperProps> = ({
  currentStep,
}) => (
  <View style={styles.wrapper}>
    {STEPS.map((label, index) => {
      const stepNumber = (index + 1) as ForgotPasswordStep;
      const isCompleted = stepNumber < currentStep;
      const isActive = stepNumber === currentStep;

      return (
        <React.Fragment key={label}>
          <View style={styles.stepItem}>
            <View
              style={[
                styles.circle,
                isCompleted && styles.circleCompleted,
                isActive && styles.circleActive,
                !isCompleted && !isActive && styles.circleInactive,
              ]}
            >
              {isCompleted ? (
                <Icon name="check" width={14} height={14} />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    isActive && styles.stepNumberActive,
                  ]}
                >
                  {stepNumber}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                (isActive || isCompleted) && styles.stepLabelActive,
              ]}
            >
              {label}
            </Text>
          </View>
          {index < STEPS.length - 1 && (
            <View
              style={[
                styles.connector,
                stepNumber < currentStep && styles.connectorActive,
              ]}
            />
          )}
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
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    width: 56,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  circleCompleted: {
    backgroundColor: colors.secondary,
    borderWidth: 0,
  },
  circleActive: {
    backgroundColor: colors.secondary,
    borderWidth: 0,
  },
  circleInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.lineGrey,
  },
  stepNumber: {
    ...textFont.boldS,
    color: colors.textGrey,
  },
  stepNumberActive: {
    color: colors.textPrimary,
  },
  stepLabel: {
    ...textFont.regularXS,
    color: colors.textGrey,
  },
  stepLabelActive: {
    color: colors.textPrimary,
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: colors.lineGrey,
    marginTop: 15,
    marginHorizontal: 4,
  },
  connectorActive: {
    backgroundColor: colors.secondary,
  },
});

export default ForgotPasswordStepper;
