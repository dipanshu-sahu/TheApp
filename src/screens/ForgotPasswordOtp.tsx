import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import OtpInput from '../components/auth/OtpInput';
import AuthFooterLink from '../components/auth/AuthFooterLink';
import ForgotPasswordLayout from '../components/auth/ForgotPasswordLayout';
import Button from '../components/ui/Button';
import AppText from '../components/ui/AppText';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { validateField, isFieldValid } from '../utils/validators';
import {
  sendForgotPasswordOtpApi,
  verifyForgotPasswordOtpApi,
} from '../apis/userAPI';
import { extractErrorMessage } from '../utils/extractErrorMessage';
import { useCountdown } from '../hooks/useCountdown';

const OTP_EXPIRY_SECONDS = 5 * 60;

type AuthStackParamList = {
  ForgotPasswordReset: { email: string; otp: string };
  ForgotPasswordOtp: { email: string };
};

const ForgotPasswordOtp = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ForgotPasswordOtp'>>();
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { formatted, reset, isExpired } = useCountdown(OTP_EXPIRY_SECONDS);

  const handleVerify = async () => {
    if (isSubmitting) {
      return;
    }

    const otpError = validateField('otp', otp);
    setError(otpError);
    if (otpError) {
      return;
    }

    if (isExpired) {
      setFormError('Code has expired. Please resend OTP.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      await verifyForgotPasswordOtpApi({ email, otp });
      navigation.navigate('ForgotPasswordReset', { email, otp });
    } catch (err) {
      setFormError(
        extractErrorMessage(err, 'Invalid verification code. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) {
      return;
    }

    setFormError('');
    setIsResending(true);
    try {
      await sendForgotPasswordOtpApi({ email });
      setOtp('');
      setError('');
      reset(OTP_EXPIRY_SECONDS);
    } catch (err) {
      setFormError(
        extractErrorMessage(err, 'Unable to resend code. Please try again.'),
      );
    } finally {
      setIsResending(false);
    }
  };

  const isEnabled = isFieldValid('otp', otp) && !isSubmitting && !isExpired;

  return (
    <ForgotPasswordLayout
      step={2}
      icon="mail-otp"
      iconVariant="blue"
      title="Check Your Email"
      description={
        <AppText variant="bodyLg" color={colors.textSecondary}>
          We sent a 6-digit code to{' '}
          <AppText variant="bodyLgStrong" color={colors.textPrimary}>
            {email}
          </AppText>
        </AppText>
      }
      footer={
        <AuthFooterLink
          prefix="Didn't receive code? "
          linkText="Resend OTP"
          onPress={handleResend}
        />
      }
    >
      <OtpInput
        value={otp}
        onChange={value => {
          setOtp(value);
          if (error) {
            setError('');
          }
          if (formError) {
            setFormError('');
          }
        }}
      />

      {error ? (
        <AppText variant="body" color={colors.error} style={styles.spacer}>
          {error}
        </AppText>
      ) : (
        <AppText variant="bodyLg" color={colors.textSecondary} style={styles.spacer}>
          Code expires in{' '}
          <AppText variant="bodyLgStrong" color={colors.timer}>
            {formatted}
          </AppText>
        </AppText>
      )}

      {formError ? (
        <AppText variant="body" color={colors.error} style={styles.spacer}>
          {formError}
        </AppText>
      ) : null}

      <Button
        title="Verify Code"
        onPress={handleVerify}
        disabled={!isEnabled}
        loading={isSubmitting}
      />
    </ForgotPasswordLayout>
  );
};

const styles = StyleSheet.create({
  spacer: {
    marginBottom: spacing.lg,
  },
});

export default ForgotPasswordOtp;
