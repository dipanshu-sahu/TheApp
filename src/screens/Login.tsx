import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import Button from '../components/ui/Button';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import GlassCard from '../components/ui/GlassCard';
import { enterFade, enterUp } from '../components/ui/motion';
import AuthHeader from '../components/auth/AuthHeader';
import AuthInput from '../components/auth/AuthInput';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { userLogin } from '../slices/userSlice';
import { AppDispatch } from '../store/store';
import { userLoginRequest } from '../types/user';
import { validateField, isFieldValid } from '../utils/validators';
import { extractErrorMessage } from '../utils/extractErrorMessage';

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

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }
    setFormError('');
    if (!validateFields()) {
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
      setFormError(extractErrorMessage(error, 'Unable to login. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnabled =
    isFieldValid('email', email) && isFieldValid('password', password) && !isSubmitting;

  return (
    <Screen scroll keyboardAvoiding edges={['top', 'bottom']} contentContainerStyle={styles.scroll}>
      <Animated.View entering={enterFade(0)}>
        <AuthHeader
          variant="login"
          title="Welcome Back"
          subtitle="Sign in to control your smart home"
        />
      </Animated.View>

      <Animated.View entering={enterUp(1)}>
        <GlassCard variant="soft" sheen={false} style={styles.formCard}>
          <AuthInput
            label="Email Address"
            icon="mail"
            placeholder="you@example.com"
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

          <AnimatedPressable
            style={styles.forgotPassword}
            pressScale={0.98}
            onPress={() => navigation.navigate('ForgotPassword' as never)}
          >
            <AppText variant="bodyStrong" color={colors.link}>
              Forgot Password?
            </AppText>
          </AnimatedPressable>

          {formError ? (
            <AppText variant="body" color={colors.error} style={styles.formError}>
              {formError}
            </AppText>
          ) : null}

          <Button
            title="Sign In"
            onPress={handleLogin}
            disabled={!isEnabled}
            loading={isSubmitting}
            rightIcon="arrow-next"
          />
        </GlassCard>
      </Animated.View>

      <Animated.View entering={enterUp(2)} style={styles.footer}>
        <AppText variant="bodyLg" color={colors.textSecondary}>
          Don&apos;t have an account?{' '}
        </AppText>
        <AnimatedPressable pressScale={0.98} onPress={() => navigation.navigate('SignUp' as never)}>
          <AppText variant="bodyLgStrong" color={colors.link}>
            Sign Up
          </AppText>
        </AnimatedPressable>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  formCard: {
    padding: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.xs,
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

export default Login;
