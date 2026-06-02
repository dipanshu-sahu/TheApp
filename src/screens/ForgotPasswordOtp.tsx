import React, { useState } from 'react';
import { Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import OtpInput from '../components/auth/OtpInput';
import AuthFooterLink from '../components/auth/AuthFooterLink';
import ForgotPasswordLayout from '../components/auth/ForgotPasswordLayout';
import GradientButton from '../components/GradientButton';
import Gap from '../components/Gap';
import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
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
        <Text style={{ ...textFont.regularM, color: colors.textSecondary, lineHeight: 22 }}>
          We sent a 6-digit code to{' '}
          <Text style={{ ...textFont.boldM, color: colors.textPrimary }}>
            {email}
          </Text>
        </Text>
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
        <Text style={{ ...textFont.regularS, color: colors.error, marginBottom: 8 }}>
          {error}
        </Text>
      ) : (
        <Text style={{ ...textFont.regularM, color: colors.textSecondary, marginBottom: 20 }}>
          Code expires in{' '}
          <Text style={{ ...textFont.boldM, color: colors.timer }}>{formatted}</Text>
        </Text>
      )}

      {formError ? (
        <>
          <Text style={{ ...textFont.regularS, color: colors.error }}>{formError}</Text>
          <Gap type="s" />
        </>
      ) : null}

      <GradientButton
        title="Verify Code"
        onPress={handleVerify}
        isDisable={!isEnabled}
      />
    </ForgotPasswordLayout>
  );
};

export default ForgotPasswordOtp;
