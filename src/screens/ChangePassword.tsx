import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BackButtonHeader from '../components/BackButtonHeader';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import { validateField, isFieldValid } from '../utils/validators';
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

  const [formValues, setFormValues] = useState<Record<FormField, string>>(
    initialValues,
  );
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
      confirmPassword: validateField(
        'confirmPassword',
        formValues.confirmPassword,
        { password: formValues.newPassword },
      ),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every(message => !message);
  };

  const extractErrorMessage = (error: unknown) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response?.data?.message === 'string'
    ) {
      return (error as any).response.data.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unable to change password. Please try again.';
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setFormError('');
    const isValid = validateForm();
    if (!isValid) {
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
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = () => {
    return (
      isFieldValid('currentPassword', formValues.currentPassword) &&
      isFieldValid('newPassword', formValues.newPassword) &&
      isFieldValid(
        'confirmPassword',
        formValues.confirmPassword,
        { password: formValues.newPassword },
      ) &&
      !isSubmitting
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ flex: 1, padding: 16 }}>
        <BackButtonHeader />
        <Text style={{ ...textFont.boldXL, color: colors.textPrimary }}>
          Change Password
        </Text>
        <Gap type="s" />
        <Text style={{ ...textFont.regularM, color: colors.textSecondary }}>
          Enter your current password and set a new one.
        </Text>
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
      <View style={{ padding: 16 }}>
        {formError ? (
          <>
            <Text style={{ ...textFont.regularS, color: colors.error }}>
              {formError}
            </Text>
            <Gap type="s" />
          </>
        ) : null}
        <ActionButton
          title="Update Password"
          onPress={handleSubmit}
          isDisable={!isSubmitEnabled()}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

