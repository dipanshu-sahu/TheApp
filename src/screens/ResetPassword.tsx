import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import { Text, View } from 'react-native';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import { useNavigation } from '@react-navigation/native';
import BackButtonHeader from '../components/BackButtonHeader';
import { validateField, isFieldValid } from '../utils/validators';
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
  const [formValues, setFormValues] = useState<Record<FormField, string>>(
    initialValues,
  );
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
    return 'Unable to reset password. Please try again.';
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
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = () => {
    return (
      isFieldValid('email', formValues.email) &&
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
          Reset the Password!
        </Text>
        <Gap type="s" />
        <Text style={{ ...textFont.boldS, color: colors.textPrimary }}>
          Please enter your email to reset your password
        </Text>
        <Gap type="l" />
        <CustomInput
          icon="mail"
          placeholder="Enter Email"
          maxLength={50}
          value={formValues.email}
          onChangeText={value => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={errors.email}
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
          placeholder="Re-enter New Password"
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
          title="Submit"
          onPress={handleSubmit}
          isDisable={!isSubmitEnabled()}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
