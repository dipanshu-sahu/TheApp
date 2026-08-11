import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import { enterUp } from '../components/ui/motion';
import BackButtonHeader from '../components/BackButtonHeader';
import AuthHeader from '../components/auth/AuthHeader';
import AuthInput from '../components/auth/AuthInput';
import EmailValidHint from '../components/auth/EmailValidHint';
import PasswordStrength from '../components/auth/PasswordStrength';
import TermsCheckbox from '../components/auth/TermsCheckbox';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { userRegisterApi } from '../apis/userAPI';
import { userRegisterRequest } from '../types/user';
import { validateField, isFieldValid } from '../utils/validators';
import { splitFullName } from '../utils/passwordStrength';
import { extractErrorMessage } from '../utils/extractErrorMessage';

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
      setFormError(extractErrorMessage(error, 'Unable to register. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showEmailHint =
    formValues.email.length > 0 &&
    !errors.email &&
    isFieldValid('email', formValues.email);

  const isSubmitEnabled =
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
    <Screen scroll keyboardAvoiding edges={['top', 'bottom']}>
      <BackButtonHeader />

      <AuthHeader
        variant="signup"
        title="Create Account"
        subtitle="Join millions managing their smart homes"
      />

      <Animated.View entering={enterUp(2)}>
        <GlassCard variant="soft" sheen={false} style={styles.formCard}>
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
            !errors.password ? <PasswordStrength password={formValues.password} /> : undefined
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
          <AppText variant="body" color={colors.error} style={styles.formError}>
            {formError}
          </AppText>
        ) : null}

        <Button
          title="Sign Up"
          variant="secondary"
          onPress={handleRegister}
          disabled={!isSubmitEnabled}
          loading={isSubmitting}
        />
        </GlassCard>

        <View style={styles.footer}>
          <AppText variant="bodyLg" color={colors.textSecondary}>
            Already have an account?{' '}
          </AppText>
          <AnimatedPressable pressScale={0.96} onPress={() => navigation.navigate('Login' as never)}>
            <AppText variant="bodyLgStrong" color={colors.link}>
              Sign In
            </AppText>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: {
    padding: spacing.lg,
  },
  formError: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});

export default SignUp;
