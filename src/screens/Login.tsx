import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import GradientButton from '../components/GradientButton';
import AuthHeader from '../components/auth/AuthHeader';
import AuthInput from '../components/auth/AuthInput';
import { userLogin } from '../slices/userSlice';
import { AppDispatch } from '../store/store';
import { userLoginRequest } from '../types/user';
import { validateField, isFieldValid } from '../utils/validators';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<string>('dipanshu.sahu1@gmail.com');
  const [password, setPassword] = useState<string>('Password@1');
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const clearFieldError = (field: 'email' | 'password') => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateFields = () => {
    const validationErrors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };

    setErrors(validationErrors);
    return !validationErrors.email && !validationErrors.password;
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
    return 'Unable to login. Please try again.';
  };

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    setFormError('');
    const isValid = validateFields();
    if (!isValid) {
      return;
    }

    const data: userLoginRequest = {
      email: email.trim(),
      password,
    };
    setIsSubmitting(true);
    try {
      await dispatch(userLogin(data)).unwrap();
      navigation.navigate('App' as never);
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnabled = () =>
    isFieldValid('email', email) &&
    isFieldValid('password', password) &&
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
          <AuthHeader
            variant="login"
            title="Welcome Back 👋"
            subtitle="Sign in to control your smart home"
          />

          <AuthInput
            label="Email Address"
            icon="mail"
            placeholder="rahul@example.com"
            maxLength={50}
            value={email}
            onChangeText={value => {
              setEmail(value);
              clearFieldError('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email}
          />

          <AuthInput
            label="Password"
            icon="password-lock"
            placeholder="Enter password"
            isPassword
            maxLength={30}
            value={password}
            onChangeText={value => {
              setPassword(value);
              clearFieldError('password');
            }}
            errorMessage={errors.password}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword' as never)}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {formError ? (
            <>
              <Text style={styles.formError}>{formError}</Text>
              <Gap type="s" />
            </>
          ) : null}

          <GradientButton
            title="Sign In"
            onPress={handleLogin}
            isDisable={!isEnabled()}
            tone="primary"
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp' as never)}
            >
              <Text style={styles.footerLink}>Sign Up</Text>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 24,
  },
  forgotPasswordText: {
    ...textFont.regularM,
    color: colors.link,
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

export default Login;
