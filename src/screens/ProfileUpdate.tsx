import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import BackButtonHeader from '../components/BackButtonHeader';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, updateUserProfile } from '../slices/userSlice';
import { userUpdateProfileRequest } from '../types/user';
import { isFieldValid, validateField } from '../utils/validators';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <BackButtonHeader />
        <Text style={styles.title}>Update Profile</Text>
        <Gap type="s" />
        <Text style={styles.subtitle}>Modify your personal information below.</Text>
        <Gap type="l" />
        <CustomInput
          icon="profile"
          placeholder="First Name"
          maxLength={30}
          value={formValues.firstName}
          onChangeText={value => handleChange('firstName', value)}
          errorMessage={errors.firstName}
          autoCapitalize="words"
        />
        <Gap type="m" />
        <CustomInput
          icon="profile"
          placeholder="Last Name"
          maxLength={30}
          value={formValues.lastName}
          onChangeText={value => handleChange('lastName', value)}
          errorMessage={errors.lastName}
          autoCapitalize="words"
        />
        <Gap type="m" />
        <CustomInput
          icon="profile"
          placeholder="Phone Number"
          maxLength={15}
          value={formValues.phoneNumber}
          onChangeText={value => handleChange('phoneNumber', value)}
          errorMessage={errors.phoneNumber}
          keyboardType="phone-pad"
        />
        <Gap type="m" />
        <CustomInput
          icon="profile"
          placeholder="User Type"
          maxLength={30}
          value={formValues.type}
          onChangeText={value => handleChange('type', value)}
          errorMessage={errors.type}
        />
      </View>

      <View style={styles.footer}>
        {formError || updateProfileApi.error ? (
          <>
            <Text style={styles.formError}>{formError || updateProfileApi.error}</Text>
            <Gap type="s" />
          </>
        ) : null}
        <ActionButton
          title={isSubmitting ? 'Updating...' : 'Update Profile'}
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

export default ProfileUpdate;
