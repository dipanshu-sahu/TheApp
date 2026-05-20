import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import { MailIcon, PasswordLockIcon } from '../assets/icons';
import CustomInput from '../components/CustomInput';
import Gap from '../components/Gap';
import ActionButton from '../components/ActionButton';
import BackButtonHeader from '../components/BackButtonHeader';
import axios from '../apis/axios';
import { userLogin } from '../slices/userSlice';
import { AppDispatch } from '../store/store';
import { userLoginRequest } from '../types/user';
import { validateField, isFieldValid } from '../utils/validators';
import { getStorage, STORAGE_KEYS } from '../utils/storage';

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

  useEffect(() => {
    const storedToken = getStorage(STORAGE_KEYS.authToken);
    if (typeof storedToken === 'string' && storedToken.length > 0) {
      axios.defaults.headers.common['Authorization'] = storedToken;
    }
  }, []);

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
      navigation.navigate('App' as never);
      setIsSubmitting(false);
    }
  };

  const isEnabled = () => {
    return (
      isFieldValid('email', email) &&
      isFieldValid('password', password) &&
      !isSubmitting
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 16 }}>
        <BackButtonHeader />
        <Text style={{ ...textFont.boldXL, color: colors.textPrimary }}>
          Smart Home Welcome
        </Text>
        <View style={{ marginTop: 32 }}>
          <CustomInput
            InputIcon={MailIcon}
            placeholder="Email"
            maxLength={30}
            value={email}
            onChangeText={value => {
              setEmail(value);
              clearFieldError('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email}
          />
          <Gap type="m" />
          <CustomInput
            InputIcon={PasswordLockIcon}
            placeholder="Password"
            isPassword
            maxLength={30}
            value={password}
            onChangeText={value => {
              setPassword(value);
              clearFieldError('password');
            }}
            errorMessage={errors.password}
          />
          <Gap type="l" />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword' as never)}
          >
            <Text style={{ ...textFont.regularM, color: colors.textPrimary }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
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
          title="Log In"
          onPress={handleLogin}
          isDisable={!isEnabled()}
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
});
export default Login;
