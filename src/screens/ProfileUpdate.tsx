import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import BackButtonHeader from '../components/BackButtonHeader';
import { enterUp } from '../components/ui/motion';
import { colors } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, updateUserProfile } from '../slices/userSlice';
import { userUpdateProfileRequest } from '../types/user';
import { validateField } from '../utils/validators';
import { extractErrorMessage } from '../utils/extractErrorMessage';

const ProfileUpdate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user, updateProfileApi } = useSelector((state: RootState) => state.user);

  const [formValues, setFormValues] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    type: user?.userType ?? '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    type: '',
  });
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setFormValues({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      type: user?.userType ?? '',
    });
  }, [user]);

  const handleChange = (field: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (formError) {
      setFormError('');
    }
  };

  const validateForm = () => {
    const validationErrors = {
      firstName: validateField('firstName', formValues.firstName),
      lastName: validateField('lastName', formValues.lastName),
      phoneNumber: validateField('phoneNumber', formValues.phoneNumber),
      type: validateField('type', formValues.type),
    };
    setErrors(validationErrors);
    return Object.values(validationErrors).every(message => !message);
  };

  const handleSubmit = async () => {
    if (isSubmitting || !user?.id) {
      return;
    }
    setFormError('');
    if (!validateForm()) {
      return;
    }

    const payload: userUpdateProfileRequest = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      type: formValues.type.trim(),
    };

    setIsSubmitting(true);
    try {
      await dispatch(updateUserProfile({ userId: user.id, payload })).unwrap();
      navigation.goBack();
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Unable to update profile. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled =
    !!formValues.firstName.trim() &&
    !!formValues.lastName.trim() &&
    !!formValues.phoneNumber.trim() &&
    !!formValues.type.trim() &&
    !isSubmitting;

  return (
    <Screen edges={['top']} scroll keyboardAvoiding contentContainerStyle={styles.content}>
      <Animated.View entering={enterUp(0)}>
        <BackButtonHeader />
        <AppText variant="h1">Update Profile</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Modify your personal information below.
        </AppText>
      </Animated.View>

      <Animated.View entering={enterUp(1)} style={styles.form}>
        <TextField
          label="First Name"
          icon="profile"
          placeholder="First Name"
          maxLength={30}
          value={formValues.firstName}
          onChangeText={value => handleChange('firstName', value)}
          errorMessage={errors.firstName}
          autoCapitalize="words"
        />
        <TextField
          label="Last Name"
          icon="profile"
          placeholder="Last Name"
          maxLength={30}
          value={formValues.lastName}
          onChangeText={value => handleChange('lastName', value)}
          errorMessage={errors.lastName}
          autoCapitalize="words"
        />
        <TextField
          label="Phone Number"
          icon="phone"
          placeholder="Phone Number"
          maxLength={15}
          value={formValues.phoneNumber}
          onChangeText={value => handleChange('phoneNumber', value)}
          errorMessage={errors.phoneNumber}
          keyboardType="phone-pad"
        />
        <TextField
          label="User Type"
          icon="profile"
          placeholder="User Type"
          maxLength={30}
          value={formValues.type}
          onChangeText={value => handleChange('type', value)}
          errorMessage={errors.type}
        />
      </Animated.View>

      <Animated.View entering={enterUp(2)} style={styles.footer}>
        {formError || updateProfileApi.error ? (
          <AppText variant="caption" color={colors.error} style={styles.formError}>
            {formError || updateProfileApi.error}
          </AppText>
        ) : null}
        <Button
          title={isSubmitting ? 'Updating...' : 'Update Profile'}
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

export default ProfileUpdate;
