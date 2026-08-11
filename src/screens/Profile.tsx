import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import GlassCard from '../components/ui/GlassCard';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import Icon from '../components/Icon';
import { IconName } from '../types/icons';
import { enterFade, enterUp } from '../components/ui/motion';
import { colors, withAlpha } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, logout } from '../slices/userSlice';
import { isDeviceOnline } from '../utils/deviceDisplay';
import ProfileCard from '../components/profile/ProfileCard';

type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  App: undefined;
};

type ActionTile = {
  icon: IconName;
  label: string;
  value?: string;
  accent: string;
  onPress?: () => void;
  destructive?: boolean;
};

const ActionBlock: React.FC<{ tile: ActionTile }> = ({ tile }) => (
  <AnimatedPressable
    onPress={tile.onPress}
    disabled={!tile.onPress}
    pressScale={tile.onPress ? 0.97 : 1}
    enforceTouchTarget={false}
    style={styles.actionWrap}
  >
    <GlassCard variant="soft" sheen={false} style={styles.actionCard}>
      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: withAlpha(
              tile.destructive ? colors.error : tile.accent,
              0.16,
            ),
          },
        ]}
      >
        <Icon
          name={tile.icon}
          width={22}
          height={22}
          color={tile.destructive ? colors.error : tile.accent}
        />
      </View>
      <AppText
        variant="bodyLgStrong"
        color={tile.destructive ? colors.error : colors.textPrimary}
        numberOfLines={1}
      >
        {tile.label}
      </AppText>
      {tile.value ? (
        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
          {tile.value}
        </AppText>
      ) : null}
      {tile.onPress && !tile.destructive ? (
        <View style={styles.chevron}>
          <Icon name="chevron-right" width={16} height={16} color={colors.textTertiary} />
        </View>
      ) : null}
    </GlassCard>
  </AnimatedPressable>
);

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, fetchUserApi } = useSelector((state: RootState) => state.user);
  const { devices: apiDevices } = useSelector((state: RootState) => state.devices);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const onlineCount = useMemo(
    () => (apiDevices ?? []).filter(device => isDeviceOnline(device)).length,
    [apiDevices],
  );

  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User'
    : 'Guest User';
  const email = user?.email ?? 'Not signed in';
  const phone = user?.phoneNumber ?? 'Add phone';
  const accountType = user?.userType ?? 'Home Owner';
  const avatarLabel = (user?.firstName?.charAt(0) || 'U').toUpperCase();
  const deviceCount = apiDevices?.length ?? 0;

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigation.getParent()?.getParent()?.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }),
    );
  };

  const accountTiles: ActionTile[] = [
    {
      icon: 'profile',
      label: 'Edit Profile',
      value: displayName,
      accent: colors.primary,
      onPress: () => navigation.navigate('ProfileUpdate' as never),
    },
    {
      icon: 'mail',
      label: 'Email',
      value: email,
      accent: colors.gradPrimaryEnd,
    },
    {
      icon: 'phone',
      label: 'Phone',
      value: phone,
      accent: colors.secondary,
      onPress: () => navigation.navigate('ProfileUpdate' as never),
    },
    {
      icon: 'lock-key',
      label: 'Password',
      value: 'Change',
      accent: colors.cta,
      onPress: () => navigation.navigate('ChangePassword' as never),
    },
  ];

  const prefTiles: ActionTile[] = [
    {
      icon: 'settings',
      label: 'Settings',
      value: 'Prefs',
      accent: colors.primary,
      onPress: () => navigation.navigate('AutoTab' as never),
    },
    {
      icon: 'devices',
      label: 'Devices',
      value: `${deviceCount} linked`,
      accent: colors.secondary,
      onPress: () => navigation.getParent()?.navigate('DevicesTab' as never),
    },
    {
      icon: 'bell',
      label: 'Support',
      value: 'Help',
      accent: colors.gradPrimaryEnd,
      onPress: () => {},
    },
    {
      icon: 'power-button',
      label: 'Log Out',
      accent: colors.error,
      destructive: true,
      onPress: handleLogout,
    },
  ];

  return (
    <Screen edges={['top']} scroll contentContainerStyle={styles.scrollContent}>
      <Animated.View entering={enterFade(0)} style={styles.header}>
        <AppText variant="h1">Profile</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Account & preferences
        </AppText>
      </Animated.View>

      {fetchUserApi.loading && !user ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : null}

      <Animated.View entering={enterUp(1)}>
        <ProfileCard
          avatarLabel={avatarLabel}
          displayName={displayName}
          email={email}
          accountType={accountType}
        />
      </Animated.View>

      {/* Stats bento */}
      <Animated.View entering={enterUp(2)} style={styles.statsRow}>
        {[
          { value: deviceCount, label: 'Devices', accent: colors.primary },
          { value: onlineCount, label: 'Online', accent: colors.success },
          { value: 1, label: 'Homes', accent: colors.cta },
        ].map(stat => (
          <GlassCard key={stat.label} variant="soft" sheen={false} style={styles.statCard}>
            <AppText variant="h2" color={stat.accent}>
              {stat.value}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {stat.label}
            </AppText>
          </GlassCard>
        ))}
      </Animated.View>

      <Animated.View entering={enterUp(3)}>
        <AppText variant="labelCaps" color={colors.textTertiary} style={styles.sectionLabel}>
          Account
        </AppText>
        <View style={styles.grid}>
          {accountTiles.map(tile => (
            <ActionBlock key={tile.label} tile={tile} />
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={enterUp(4)}>
        <AppText variant="labelCaps" color={colors.textTertiary} style={styles.sectionLabel}>
          Preferences
        </AppText>
        <View style={styles.grid}>
          {prefTiles.map(tile => (
            <ActionBlock key={tile.label} tile={tile} />
          ))}
        </View>
      </Animated.View>

      {!user ? (
        <AnimatedPressable
          style={styles.signInBtn}
          pressScale={0.97}
          onPress={() =>
            navigation.getParent()?.getParent()?.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }),
            )
          }
        >
          <AppText variant="bodyLgStrong" color={colors.link}>
            Sign In
          </AppText>
        </AnimatedPressable>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xxs,
  },
  loader: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xxs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  actionWrap: {
    width: '48.2%',
  },
  actionCard: {
    padding: spacing.md,
    minHeight: 118,
    gap: spacing.xs,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxs,
  },
  chevron: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  signInBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});

export default Profile;
