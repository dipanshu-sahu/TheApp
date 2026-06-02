import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import { Text, View } from 'react-native';
import BackButtonHeader from '../components/BackButtonHeader';
import { textFont } from '../utils/textFont';
import Gap from '../components/Gap';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, updateUserProfile } from '../slices/userSlice';
import { userUpdateProfileRequest } from '../types/user';
import { isFieldValid, validateField } from '../utils/validators';
import { useNavigation } from '@react-navigation/native';

const ProfileUpdate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user, fetchUserApi, updateProfileApi } = useSelector(
    (state: RootState) => state.user,
  );
  const currentUser = useMemo(() => user, [user]);

  const [formValues, setFormValues] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName: currentUser?.lastName ?? '',
    phoneNumber: currentUser?.phoneNumber ?? '',
    type: currentUser?.userType ?? '',
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
      firstName: currentUser?.firstName ?? '',
      lastName: currentUser?.lastName ?? '',
      phoneNumber: currentUser?.phoneNumber ?? '',
      type: currentUser?.userType ?? '',
    });
  }, [currentUser]);

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

  const extractErrorMessage = (err: unknown) => {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as any).response?.data?.message === 'string'
    ) {
      return (err as any).response.data.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Unable to update profile. Please try again.';
  };

  const handleSubmit = async () => {
    if (isSubmitting || !currentUser?.id) {
      return;
    }
    setFormError('');
    const isValid = validateForm();
    if (!isValid) {
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
      await dispatch(
        updateUserProfile({ userId: currentUser.id, payload }),
      ).unwrap();
      navigation.goBack();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = () => {
    return (
      !!formValues.firstName.trim() &&
      !!formValues.lastName.trim() &&
      !!formValues.phoneNumber.trim() &&
      !!formValues.type.trim() &&
      !isSubmitting
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ flex: 1, padding: 16 }}>
        <BackButtonHeader />
        <Text style={{ ...textFont.boldXL, color: colors.textPrimary }}>
          Update Profile
        </Text>
        <Gap type="s" />
        <Text style={{ ...textFont.regularM, color: colors.textSecondary }}>
          Modify your personal information below.
        </Text>
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
      <View style={{ padding: 16 }}>
        {formError || updateProfileApi.error ? (
          <>
            <Text style={{ ...textFont.regularS, color: colors.error }}>
              {formError || updateProfileApi.error}
            </Text>
            <Gap type="s" />
          </>
        ) : null}
        <ActionButton
          title={isSubmitting ? 'Updating...' : 'Update Profile'}
          onPress={handleSubmit}
          isDisable={!isSubmitEnabled()}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileUpdate;

