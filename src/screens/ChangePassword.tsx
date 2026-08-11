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
import { userChangePasswordApi } from '../apis/userAPI';
import { userChangePasswordRequest } from '../types/user';

type FormField = 'currentPassword' | 'newPassword' | 'confirmPassword';

const initialValues: Record<FormField, string> = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ChangePassword = () => {
  const navigation = useNavigation();

  const [formValues, setFormValues] = useState<Record<FormField, string>>(initialValues);
  const [errors, setErrors] = useState<Record<FormField, string>>({
    currentPassword: '',
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
      currentPassword: validateField('currentPassword', formValues.currentPassword),
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

    const payload: userChangePasswordRequest = {
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword,
      confirmPassword: formValues.confirmPassword,
    };

    setIsSubmitting(true);
    try {
      await userChangePasswordApi(payload);
      navigation.goBack();
    } catch (error) {
      setFormError(extractErrorMessage(error, 'Unable to change password. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled =
    isFieldValid('currentPassword', formValues.currentPassword) &&
    isFieldValid('newPassword', formValues.newPassword) &&
    isFieldValid('confirmPassword', formValues.confirmPassword, {
      password: formValues.newPassword,
    }) &&
    !isSubmitting;

  return (
    <Screen edges={['top']} scroll keyboardAvoiding contentContainerStyle={styles.content}>
      <Animated.View entering={enterUp(0)}>
        <BackButtonHeader />
        <AppText variant="h1">Change Password</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Enter your current password and set a new one.
        </AppText>
      </Animated.View>

      <Animated.View entering={enterUp(1)} style={styles.form}>
        <TextField
          label="Current Password"
          icon="password-lock"
          placeholder="Current Password"
          maxLength={30}
          isPassword
          value={formValues.currentPassword}
          onChangeText={value => handleChange('currentPassword', value)}
          errorMessage={errors.currentPassword}
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
          label="Confirm New Password"
          icon="password-lock"
          placeholder="Confirm New Password"
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
          title="Update Password"
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

export default ChangePassword;
