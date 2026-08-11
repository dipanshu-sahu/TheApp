import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AuthInput from '../components/auth/AuthInput';
import PasswordStrength from '../components/auth/PasswordStrength';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import ForgotPasswordLayout from '../components/auth/ForgotPasswordLayout';
import Button from '../components/ui/Button';
import AppText from '../components/ui/AppText';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { validateField, isFieldValid } from '../utils/validators';
import { resetPasswordWithOtpApi } from '../apis/userAPI';
import { extractErrorMessage } from '../utils/extractErrorMessage';

type AuthStackParamList = {
  Login: undefined;
  ForgotPasswordReset: { email: string; otp: string };
};

type FormField = 'newPassword' | 'confirmPassword';

const ForgotPasswordReset = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route =
    useRoute<RouteProp<AuthStackParamList, 'ForgotPasswordReset'>>();
  const { email, otp } = route.params;

  const [formValues, setFormValues] = useState<Record<FormField, string>>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<FormField, string>>({
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: FormField, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (formError) {
      setFormError('');
    }
  };

  const validateForm = () => {
    const validationErrors: Record<FormField, string> = {
      newPassword: validateField('newPassword', formValues.newPassword),
      confirmPassword: validateField(
        'confirmPassword',
        formValues.confirmPassword,
        { password: formValues.newPassword },
      ),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every(message => !message);
  };

  const handleReset = async () => {
    if (isSubmitting) {
      return;
    }

    setFormError('');
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordWithOtpApi({
        email,
        otp,
        newPassword: formValues.newPassword,
        confirmPassword: formValues.confirmPassword,
      });
      navigation.navigate('Login');
    } catch (err) {
      setFormError(
        extractErrorMessage(err, 'Unable to reset password. Please try again.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnabled =
    isFieldValid('newPassword', formValues.newPassword) &&
    isFieldValid('confirmPassword', formValues.confirmPassword, {
      password: formValues.newPassword,
    }) &&
    !isSubmitting;

  return (
    <ForgotPasswordLayout
      step={3}
      icon="lock-key"
      title="Set New Password"
      description={
        <AppText variant="bodyLg" color={colors.textSecondary}>
          Create a strong new password for your account.
        </AppText>
      }
    >
      <AuthInput
        label="New Password"
        icon="password-lock"
        placeholder="New password"
        isPassword
        maxLength={30}
        value={formValues.newPassword}
        onChangeText={value => handleChange('newPassword', value)}
        errorMessage={errors.newPassword}
        hint={
          !errors.newPassword ? (
            <PasswordStrength
              password={formValues.newPassword}
              hint="Min. 8 chars, uppercase, number"
            />
          ) : undefined
        }
      />

      <AuthInput
        label="Confirm New Password"
        icon="password-lock"
        placeholder="Confirm password"
        isPassword
        maxLength={30}
        value={formValues.confirmPassword}
        onChangeText={value => handleChange('confirmPassword', value)}
        errorMessage={errors.confirmPassword}
      />

      <PasswordRequirements password={formValues.newPassword} />

      {formError ? (
        <AppText variant="body" color={colors.error} style={styles.formError}>
          {formError}
        </AppText>
      ) : null}

      <Button
        title="Reset Password"
        onPress={handleReset}
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

export default ForgotPasswordReset;
