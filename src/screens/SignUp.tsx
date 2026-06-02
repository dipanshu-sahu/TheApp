import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import GradientButton from '../components/GradientButton';
import BackButtonHeader from '../components/BackButtonHeader';
import AuthHeader from '../components/auth/AuthHeader';
import AuthInput from '../components/auth/AuthInput';
import EmailValidHint from '../components/auth/EmailValidHint';
import PasswordStrength from '../components/auth/PasswordStrength';
import TermsCheckbox from '../components/auth/TermsCheckbox';
import { userRegisterApi } from '../apis/userAPI';
import { userRegisterRequest } from '../types/user';
import { validateField, isFieldValid } from '../utils/validators';
import { splitFullName } from '../utils/passwordStrength';

type FormField =
  | 'fullName'
  | 'email'
  | 'phoneNumber'
  | 'password'
  | 'confirmPassword';

const initialValues: Record<FormField, string> = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const SignUp = () => {
  const navigation = useNavigation();

  const [formValues, setFormValues] =
    useState<Record<FormField, string>>(initialValues);
  const [errors, setErrors] = useState<Record<FormField, string>>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: '' }),
      {} as Record<FormField, string>,
    ),
  );
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);

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
      fullName: validateField('fullName', formValues.fullName),
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

    if (!agreedToTerms) {
      setFormError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setFormError('');
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const { firstName, lastName } = splitFullName(formValues.fullName);

    const payload: userRegisterRequest = {
      firstName,
      lastName,
      type: 'Homeowner',
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

  const showEmailHint =
    formValues.email.length > 0 &&
    !errors.email &&
    isFieldValid('email', formValues.email);

  const isSubmitEnabled = () =>
    isFieldValid('fullName', formValues.fullName) &&
    isFieldValid('email', formValues.email) &&
    isFieldValid('phoneNumber', formValues.phoneNumber) &&
    isFieldValid('password', formValues.password) &&
    isFieldValid('confirmPassword', formValues.confirmPassword, {
      password: formValues.password,
    }) &&
    agreedToTerms &&
    !isSubmitting;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButtonHeader />

          <AuthHeader
            variant="signup"
            title="Create Account 🎉"
            subtitle="Join millions managing their smart homes"
          />

          <AuthInput
            label="Full Name"
            icon="profile"
            placeholder="Rahul Sharma"
            maxLength={60}
            value={formValues.fullName}
            onChangeText={value => handleChange('fullName', value)}
            autoCapitalize="words"
            errorMessage={errors.fullName}
          />

          <AuthInput
            label="Email Address"
            icon="mail"
            placeholder="rahul@example.com"
            maxLength={50}
            value={formValues.email}
            onChangeText={value => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email}
            hint={showEmailHint ? <EmailValidHint /> : undefined}
          />

          <AuthInput
            label="Phone Number"
            icon="phone"
            placeholder="+91 98765 43210"
            maxLength={16}
            value={formValues.phoneNumber}
            onChangeText={value => handleChange('phoneNumber', value)}
            keyboardType="phone-pad"
            errorMessage={errors.phoneNumber}
          />

          <AuthInput
            label="Password"
            icon="password-lock"
            placeholder="Create password"
            isPassword
            maxLength={30}
            value={formValues.password}
            onChangeText={value => handleChange('password', value)}
            errorMessage={errors.password}
            hint={
              !errors.password ? (
                <PasswordStrength password={formValues.password} />
              ) : undefined
            }
          />

          <AuthInput
            label="Confirm Password"
            icon="password-lock"
            placeholder="Repeat password"
            isPassword
            maxLength={30}
            value={formValues.confirmPassword}
            onChangeText={value => handleChange('confirmPassword', value)}
            errorMessage={errors.confirmPassword}
          />

          <TermsCheckbox
            checked={agreedToTerms}
            onToggle={() => setAgreedToTerms(prev => !prev)}
          />

          {formError ? (
            <>
              <Text style={styles.formError}>{formError}</Text>
              <Gap type="s" />
            </>
          ) : null}

          <GradientButton
            title="Sign Up"
            onPress={handleRegister}
            isDisable={!isSubmitEnabled()}
            tone="success"
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  formError: {
    ...textFont.regularS,
    color: colors.error,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
  footerLink: {
    ...textFont.boldM,
    color: colors.link,
  },
});

export default SignUp;
