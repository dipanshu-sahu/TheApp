import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import BackButtonHeader from '../components/BackButtonHeader';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <BackButtonHeader />
        <Text style={styles.title}>Change Password</Text>
        <Gap type="s" />
        <Text style={styles.subtitle}>Enter your current password and set a new one.</Text>
        <Gap type="l" />
        <CustomInput
          icon="password-lock"
          placeholder="Current Password"
          maxLength={30}
          isPassword
          value={formValues.currentPassword}
          onChangeText={value => handleChange('currentPassword', value)}
          errorMessage={errors.currentPassword}
        />
        <Gap type="m" />
        <CustomInput
          icon="password-lock"
          placeholder="New Password"
          maxLength={30}
          isPassword
          value={formValues.newPassword}
          onChangeText={value => handleChange('newPassword', value)}
          errorMessage={errors.newPassword}
        />
        <Gap type="m" />
        <CustomInput
          icon="password-lock"
          placeholder="Confirm New Password"
          maxLength={30}
          isPassword
          value={formValues.confirmPassword}
          onChangeText={value => handleChange('confirmPassword', value)}
          errorMessage={errors.confirmPassword}
        />
      </View>

      <View style={styles.footer}>
        {formError ? (
          <>
            <Text style={styles.formError}>{formError}</Text>
            <Gap type="s" />
          </>
        ) : null}
        <ActionButton
          title="Update Password"
          onPress={handleSubmit}
          isDisable={!isSubmitEnabled}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  title: {
    ...textFont.boldXL,
    color: colors.textPrimary,
  },
  subtitle: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
  },
  formError: {
    ...textFont.regularS,
    color: colors.error,
  },
});

export default ChangePassword;
