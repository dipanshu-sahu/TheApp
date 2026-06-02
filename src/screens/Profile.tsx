import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import Icon, { IconName } from '../components/Icon';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, logout } from '../slices/userSlice';
import { mergeWithMockHomeDevices } from '../mocks/homeDevices';
import { isDeviceOnline } from '../utils/deviceDisplay';

type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  App: undefined;
};

type ProfileMenuItemProps = {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  label,
  value,
  onPress,
  destructive = false,
  showChevron = true,
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={onPress ? 0.75 : 1}
    disabled={!onPress}
  >
    <View style={[styles.menuIconBox, destructive && styles.menuIconBoxDanger]}>
      <Icon
        name={icon}
        width={20}
        height={20}
        fill={destructive ? colors.error : colors.accent}
        stroke={destructive ? colors.error : colors.accent}
      />
    </View>
    <View style={styles.menuTextWrap}>
      <Text style={[styles.menuLabel, destructive && styles.menuLabelDanger]}>
        {label}
      </Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
    </View>
    {showChevron && onPress ? (
      <Icon name="arrow-next" width={18} height={18} fill={colors.textGrey} />
    ) : null}
  </TouchableOpacity>
);

const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, fetchUserApi } = useSelector((state: RootState) => state.user);
  const { devices: apiDevices } = useSelector(
    (state: RootState) => state.devices,
  );

  useEffect(() => {
    if (!user) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const displayDevices = useMemo(
    () => mergeWithMockHomeDevices(apiDevices ?? []),
    [apiDevices],
  );

  const onlineCount = useMemo(
    () => displayDevices.filter(device => isDeviceOnline(device)).length,
    [displayDevices],
  );

  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User'
    : 'Guest User';
  const email = user?.email ?? 'Not signed in';
  const phone = user?.phoneNumber ?? 'Add phone number';
  const accountType = user?.userType ?? 'Home Owner';
  const avatarLabel = (user?.firstName?.charAt(0) || 'U').toUpperCase();

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigation.getParent()?.getParent()?.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };

  const resetToLogin = () => {
    navigation.getParent()?.getParent()?.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      {fetchUserApi.loading && !user ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : null}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLabel}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{accountType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{displayDevices.length}</Text>
          <Text style={styles.statLabel}>Devices</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{onlineCount}</Text>
          <Text style={styles.statLabel}>Online</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Homes</Text>
        </View>
      </View>

      <ProfileSection title="Account">
        <ProfileMenuItem
          icon="profile"
          label="Edit Profile"
          value={displayName}
          onPress={() => navigation.navigate('ProfileUpdate' as never)}
        />
        <View style={styles.divider} />
        <ProfileMenuItem
          icon="mail"
          label="Email"
          value={email}
          showChevron={false}
        />
        <View style={styles.divider} />
        <ProfileMenuItem
          icon="phone"
          label="Phone"
          value={phone}
          onPress={() => navigation.navigate('ProfileUpdate' as never)}
        />
        <View style={styles.divider} />
        <ProfileMenuItem
          icon="lock-key"
          label="Change Password"
          onPress={() => navigation.navigate('ChangePassword' as never)}
        />
      </ProfileSection>

      <ProfileSection title="Preferences">
        <ProfileMenuItem
          icon="settings"
          label="App Settings"
          value="Notifications, theme"
          onPress={() => navigation.navigate('AutoTab' as never)}
        />
        <View style={styles.divider} />
        <ProfileMenuItem
          icon="devices"
          label="Manage Devices"
          value={`${displayDevices.length} connected`}
          onPress={() =>
            navigation.getParent()?.navigate('DevicesTab' as never)
          }
        />
      </ProfileSection>

      <ProfileSection title="Support">
        <ProfileMenuItem
          icon="mail-otp"
          label="Help & Support"
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <ProfileMenuItem
          icon="check-circle"
          label="About App"
          value="v0.0.1"
          onPress={() => {}}
        />
      </ProfileSection>

      <View style={styles.section}>
        <View style={styles.sectionCard}>
          <ProfileMenuItem
            icon="power-button"
            label="Log Out"
            onPress={handleLogout}
            destructive
            showChevron={false}
          />
        </View>
      </View>

      {!user ? (
        <TouchableOpacity style={styles.signInBtn} onPress={resetToLogin}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeBg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  screenTitle: {
    ...textFont.boldXXL,
    color: colors.textPrimary,
  },
  loader: {
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...textFont.boldXL,
    color: colors.textPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  email: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: `${colors.accent}22`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    ...textFont.regularS,
    color: colors.link,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  statLabel: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    ...textFont.boldM,
    color: colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBoxDanger: {
    backgroundColor: `${colors.error}18`,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuLabel: {
    ...textFont.boldM,
    color: colors.textPrimary,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  menuValue: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.inputBorder,
    marginLeft: 62,
  },
  signInBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  signInText: {
    ...textFont.boldM,
    color: colors.link,
  },
});

export default Profile;
