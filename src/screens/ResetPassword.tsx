import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import BackButtonHeader from '../components/BackButtonHeader';
import { enterUp } from '../components/ui/motion';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { validateField, isFieldValid } from '../utils/validators';
import { extractErrorMessage } from '../utils/extractErrorMessage';
import { userResetPasswordApi } from '../apis/userAPI';
import { userResetPasswordRequest } from '../types/user';

type FormField = 'email' | 'newPassword' | 'confirmPassword';

const initialValues: Record<FormField, string> = {
  email: '',
  newPassword: '',
  confirmPassword: '',
};

const ResetPassword = () => {
  const navigation = useNavigation();

  const [formValues, setFormValues] = useState<Record<FormField, string>>(initialValues);
  const [errors, setErrors] = useState<Record<FormField, string>>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      email: validateField('email', formValues.email),
      newPassword: validateField('newPassword', formValues.newPassword),
      confirmPassword: validateField('confirmPassword', formValues.confirmPassword, {
        password: formValues.newPassword,
      }),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every(message => !message);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setFormError('');
    if (!validateForm()) {
      return;
    }

    const payload: userResetPasswordRequest = {
      email: formValues.email.trim(),
      newPassword: formValues.newPassword,
      confirmPassword: formValues.confirmPassword,
    };

    setIsSubmitting(true);
    try {
      await userResetPasswordApi(payload);
      navigation.navigate('Login' as never);
    } catch (error) {
      setFormError(extractErrorMessage(error, 'Unable to reset password. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled =
    isFieldValid('email', formValues.email) &&
    isFieldValid('newPassword', formValues.newPassword) &&
    isFieldValid('confirmPassword', formValues.confirmPassword, {
      password: formValues.newPassword,
    }) &&
    !isSubmitting;

  return (
    <Screen edges={['top']} scroll keyboardAvoiding contentContainerStyle={styles.content}>
      <Animated.View entering={enterUp(0)}>
        <BackButtonHeader />
        <AppText variant="h1">Reset the Password!</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Please enter your email to reset your password
        </AppText>
      </Animated.View>

      <Animated.View entering={enterUp(1)} style={styles.form}>
        <TextField
          label="Email"
          icon="mail"
          placeholder="Enter Email"
          maxLength={50}
          value={formValues.email}
          onChangeText={value => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={errors.email}
        />
        <TextField
          label="New Password"
          icon="password-lock"
          placeholder="New Password"
          maxLength={30}
          isPassword
          value={formValues.newPassword}
          onChangeText={value => handleChange('newPassword', value)}
          errorMessage={errors.newPassword}
        />
        <TextField
          label="Confirm Password"
          icon="password-lock"
          placeholder="Re-enter New Password"
          maxLength={30}
          isPassword
          value={formValues.confirmPassword}
          onChangeText={value => handleChange('confirmPassword', value)}
          errorMessage={errors.confirmPassword}
        />
      </Animated.View>

      <Animated.View entering={enterUp(2)} style={styles.footer}>
        {formError ? (
          <AppText variant="caption" color={colors.error} style={styles.formError}>
            {formError}
          </AppText>
        ) : null}
        <Button
          title="Submit"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!isSubmitEnabled}
        />
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  form: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: spacing.sm,
  },
  formError: {
    marginBottom: spacing.sm,
  },
});

export default ResetPassword;
