import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import { Text, View, TouchableOpacity } from 'react-native';
import { textFont } from '../utils/textFont';
import CustomInput from '../components/CustomInput';
import { MailIcon, PasswordLockIcon, ProfileIcon } from '../assets/icons';
import Gap from '../components/Gap';
import ActionButton from '../components/ActionButton';
import { useNavigation } from '@react-navigation/native';
import BackButtonHeader from '../components/BackButtonHeader';
import { userRegisterApi } from '../apis/userAPI';
import { userRegisterRequest } from '../types/user';
import { validateField, isFieldValid } from '../utils/validators';

type FormField =
  | 'firstName'
  | 'lastName'
  | 'type'
  | 'email'
  | 'phoneNumber'
  | 'password'
  | 'confirmPassword';

const initialValues: Record<FormField, string> = {
  firstName: '',
  lastName: '',
  type: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const navigation = useNavigation();

  const [formValues, setFormValues] = useState<Record<FormField, string>>(
    initialValues,
  );
  const [errors, setErrors] = useState<Record<FormField, string>>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: '' }),
      {} as Record<FormField, string>,
    ),
  );
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
      firstName: validateField('firstName', formValues.firstName),
      lastName: validateField('lastName', formValues.lastName),
      type: validateField('type', formValues.type),
      email: validateField('email', formValues.email),
      phoneNumber: validateField('phoneNumber', formValues.phoneNumber),
      password: validateField('password', formValues.password),
      confirmPassword: validateField(
        'confirmPassword',
        formValues.confirmPassword,
        { password: formValues.password },
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
    return 'Unable to register. Please try again.';
  };

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    setFormError('');
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const payload: userRegisterRequest = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      type: formValues.type.trim(),
      email: formValues.email.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
    };

    setIsSubmitting(true);
    try {
      await userRegisterApi(payload);
      navigation.navigate('Login' as never);
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = () => {
    return (
      isFieldValid('firstName', formValues.firstName) &&
      isFieldValid('lastName', formValues.lastName) &&
      isFieldValid('type', formValues.type) &&
      isFieldValid('email', formValues.email) &&
      isFieldValid('phoneNumber', formValues.phoneNumber) &&
      isFieldValid('password', formValues.password) &&
      isFieldValid(
        'confirmPassword',
        formValues.confirmPassword,
        { password: formValues.password },
      ) &&
      !isSubmitting
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ flex: 1, padding: 16 }}>
        <BackButtonHeader />
        <Text style={{ ...textFont.boldXL, color: colors.textPrimary }}>
          Register for Smart Living
        </Text>
        <Gap type="l" />
        <CustomInput
          InputIcon={ProfileIcon}
          placeholder="First Name"
          maxLength={30}
          value={formValues.firstName}
          onChangeText={value => handleChange('firstName', value)}
          errorMessage={errors.firstName}
          autoCapitalize="words"
        />
        <Gap type="m" />
        <CustomInput
          InputIcon={ProfileIcon}
          placeholder="Last Name"
          maxLength={30}
          value={formValues.lastName}
          onChangeText={value => handleChange('lastName', value)}
          errorMessage={errors.lastName}
          autoCapitalize="words"
        />
        <Gap type="m" />
        <CustomInput
          InputIcon={ProfileIcon}
          placeholder="User Type"
          maxLength={30}
          value={formValues.type}
          onChangeText={value => handleChange('type', value)}
          errorMessage={errors.type}
          autoCapitalize="words"
        />
        <Gap type="m" />
        <CustomInput
          InputIcon={MailIcon}
          placeholder="Email"
          maxLength={40}
          value={formValues.email}
          onChangeText={value => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={errors.email}
        />
        <Gap type="m" />
        <CustomInput
          InputIcon={ProfileIcon}
          placeholder="Phone Number"
          maxLength={15}
          value={formValues.phoneNumber}
          onChangeText={value => handleChange('phoneNumber', value)}
          keyboardType="phone-pad"
          errorMessage={errors.phoneNumber}
        />
        <Gap type="m" />
        <CustomInput
          InputIcon={PasswordLockIcon}
          placeholder="Password"
          isPassword
          maxLength={30}
          value={formValues.password}
          onChangeText={value => handleChange('password', value)}
          errorMessage={errors.password}
        />
        <Gap type="m" />
        <CustomInput
          InputIcon={PasswordLockIcon}
          placeholder="Confirm Password"
          isPassword
          maxLength={30}
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
          title="Register"
          onPress={handleRegister}
          isDisable={!isSubmitEnabled()}
        />
        <Gap type="m" />
        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
          <Text style={{ ...textFont.regularM, color: colors.textPrimary }}>
            Already have an account? Log In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
