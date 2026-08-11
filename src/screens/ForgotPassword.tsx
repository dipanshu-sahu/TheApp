import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AuthInput from '../components/auth/AuthInput';
import AuthFooterLink from '../components/auth/AuthFooterLink';
import ForgotPasswordLayout from '../components/auth/ForgotPasswordLayout';
import Button from '../components/ui/Button';
import AppText from '../components/ui/AppText';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { validateField, isFieldValid } from '../utils/validators';
import { sendForgotPasswordOtpApi } from '../apis/userAPI';
import { extractErrorMessage } from '../utils/extractErrorMessage';

type AuthStackParamList = {
  Login: undefined;
  ForgotPasswordOtp: { email: string };
};

const ForgotPassword = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendLink = async () => {
    if (isSubmitting) {
      return;
    }

    const emailError = validateField('email', email);
    setError(emailError);
    if (emailError) {
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    try {
      await sendForgotPasswordOtpApi({ email: email.trim() });
      navigation.navigate('ForgotPasswordOtp', { email: email.trim() });
    } catch (err) {
      setFormError(
        extractErrorMessage(err, 'Unable to send reset link. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnabled = isFieldValid('email', email) && !isSubmitting;

  return (
    <ForgotPasswordLayout
      step={1}
      icon="key"
      title="Forgot Password?"
      description={
        <AppText variant="bodyLg" color={colors.textSecondary}>
          No worries! Enter your email and we&apos;ll send a reset link.
        </AppText>
      }
      footer={
        <AuthFooterLink
          prefix="Remembered it? "
          linkText="Sign In"
          onPress={() => navigation.navigate('Login')}
        />
      }
    >
      <AuthInput
        label="Email Address"
        icon="mail"
        placeholder="rahul@example.com"
        maxLength={50}
        value={email}
        onChangeText={value => {
          setEmail(value);
          if (error) {
            setError('');
          }
          if (formError) {
            setFormError('');
          }
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        errorMessage={error}
      />

      {formError ? (
        <AppText variant="body" color={colors.error} style={styles.formError}>
          {formError}
        </AppText>
      ) : null}

      <Button
        title="Send Reset Link"
        onPress={handleSendLink}
        disabled={!isEnabled}
        loading={isSubmitting}
      />
    </ForgotPasswordLayout>
  );
};

const styles = StyleSheet.create({
  formError: {
    marginBottom: spacing.sm,
  },
});

export default ForgotPassword;
