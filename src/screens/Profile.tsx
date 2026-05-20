import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ArrowNextIcon, ProfileIcon } from '../assets/icons';
import { textFont } from '../utils/textFont';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/userSlice';
import { AppDispatch, RootState } from '../store/store';
import { useEffect } from 'react';

const UserProfileActionContent = ({
  title,
  value,
  onPress,
}: {
  title: string;
  value?: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ flex: 1, ...textFont.boldM, color: colors.textPrimary }}>
        {title}
      </Text>
      {value ? (
        <Text
          style={{
            ...textFont.regularM,
            color: colors.textSecondary,
            marginRight: 8,
          }}
        >
          {value}
        </Text>
      ) : null}
      <ArrowNextIcon width={24} height={24} fill={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading } = useSelector((state: RootState) => state.user);
  const currentUser = users?.[0];

  useEffect(() => {
    if (!users?.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users?.length]);

  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : 'Guest';
  const email = currentUser?.email ?? 'guest@example.com';

  return (
    <SafeAreaView style={{ backgroundColor: colors.bgPrimary, flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
        <View>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: colors.textGrey,
              backgroundColor: colors.greyLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ProfileIcon width={75} height={75} />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          {isLoading ? (
            <ActivityIndicator
              color={colors.secondary}
              style={{ marginBottom: 12 }}
            />
          ) : null}
          <Text style={{ ...textFont.boldL, color: colors.textPrimary }}>
            {displayName}
          </Text>
          <Text style={{ ...textFont.boldM, color: colors.textSecondary }}>
            {email}
          </Text>
        </View>
        <View
          style={{
            marginTop: 50,
            alignItems: 'center',
            backgroundColor: colors.bgSecondary,
            width: '100%',
            borderRadius: 16,
          }}
        >
          <UserProfileActionContent title={'Name'} value={displayName} />
          <UserProfileActionContent
            title={'Change Password'}
            onPress={() => {
              navigation.navigate('ChangePassword' as never);
            }}
          />
          <UserProfileActionContent
            title={'Update Profile'}
            onPress={() => {
              navigation.navigate('ProfileUpdate' as never);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
