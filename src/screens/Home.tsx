import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import GlassCard from '../components/ui/GlassCard';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import Icon from '../components/Icon';
import { IconName } from '../types/icons';
import { enterFade, enterUp, layoutSpring } from '../components/ui/motion';
import { colors, withAlpha } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';
import { fetchUsers } from '../slices/userSlice';
import { AppDispatch, RootState } from '../store/store';
import { fetchDevicesBySite } from '../slices/deviceSlice';
import { fetchWeatherWithLocation } from '../slices/weatherSlice';
import { fetchSitesByUser, selectSite } from '../slices/siteSlice';
import HomeHeader from '../components/home/HomeHeader';
import WeatherWidget from '../components/home/WeatherWidget';
import SiteDropdown from '../components/site/SiteDropdown';
import CreateSiteModal from '../components/site/CreateSiteModal';
import ConnectedSmartSwitchCard from '../components/home/ConnectedSmartSwitchCard';
import { isDeviceOnline } from '../utils/deviceDisplay';
import { filterSmartSwitchDevices } from '../utils/deviceMapper';
import { MyHomeStackParamList } from '../navigation';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
};

type TileProps = {
  value: string;
  label: string;
  icon: IconName;
  accent: string;
  wide?: boolean;
};

const BentoTile: React.FC<TileProps> = ({ value, label, icon, accent, wide }) => (
  <GlassCard variant="soft" sheen={false} style={[styles.tile, wide ? styles.tileWide : styles.tileHalf]}>
    <View style={[styles.tileIcon, { backgroundColor: withAlpha(accent, 0.16) }]}>
      <Icon name={icon} width={20} height={20} color={accent} />
    </View>
    <AppText variant="displaySm" color={accent} style={styles.tileValue}>
      {value}
    </AppText>
    <AppText variant="caption" color={colors.textSecondary}>
      {label}
    </AppText>
  </GlassCard>
);

const QuickTile: React.FC<{
  icon: IconName;
  label: string;
  accent: string;
  onPress: () => void;
}> = ({ icon, label, accent, onPress }) => (
  <AnimatedPressable onPress={onPress} pressScale={0.97} enforceTouchTarget={false} style={styles.quickWrap}>
    <GlassCard variant="soft" sheen={false} style={styles.quickCard}>
      <View style={[styles.quickIcon, { backgroundColor: withAlpha(accent, 0.18) }]}>
        <Icon name={icon} width={22} height={22} color={accent} />
      </View>
      <AppText variant="captionStrong" numberOfLines={1}>
        {label}
      </AppText>
    </GlassCard>
  </AnimatedPressable>
);

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyHomeStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, fetchUserApi } = useSelector((state: RootState) => state.user);
  const { devices: apiDevices, isLoading: devicesLoading, error: devicesError } = useSelector(
    (state: RootState) => state.devices,
  );
  const { selectedSite } = useSelector((state: RootState) => state.site);

  const [showCreateSite, setShowCreateSite] = useState(false);

  const smartSwitches = useMemo(
    () => filterSmartSwitchDevices(apiDevices ?? []),
    [apiDevices],
  );

  const firstName = user?.firstName || '';
  const homeTitle = firstName ? `${firstName}'s Home` : 'My Home';
  const avatarLabel = (firstName.charAt(0) || 'H').toUpperCase();

  useEffect(() => {
    if (!user) {
      dispatch(fetchUsers());
    } else if (user.id) {
      dispatch(fetchSitesByUser(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedSite?.siteId) {
      dispatch(fetchDevicesBySite(selectedSite.siteId));
    }
  }, [dispatch, selectedSite?.siteId]);

  useEffect(() => {
    dispatch(fetchWeatherWithLocation());
  }, [dispatch]);

  const onlineCount = useMemo(
    () => smartSwitches.filter(device => isDeviceOnline(device)).length,
    [smartSwitches],
  );

  return (
    <Screen edges={['top']} scroll contentContainerStyle={styles.scrollContent}>
      <CreateSiteModal
        visible={showCreateSite}
        onClose={() => setShowCreateSite(false)}
        onCreated={site => {
          dispatch(selectSite(site));
          setShowCreateSite(false);
        }}
      />

      <Animated.View entering={enterFade(0)}>
        <HomeHeader
          greeting={getGreeting()}
          homeTitle={homeTitle}
          avatarLabel={avatarLabel}
          onProfilePress={() => navigation.getParent()?.navigate('Profile' as never)}
        />
      </Animated.View>

      <Animated.View entering={enterUp(1)}>
        <SiteDropdown onAddSite={() => setShowCreateSite(true)} />
      </Animated.View>

      {/* Hero weather — full-bleed bento cell */}
      <Animated.View entering={enterUp(2)}>
        <WeatherWidget />
      </Animated.View>

      {/* Asymmetric stats bento */}
      <Animated.View entering={enterUp(3)} style={styles.bentoRow}>
        <BentoTile
          value={devicesLoading ? '—' : String(onlineCount)}
          label="Online now"
          icon="wifi"
          accent={colors.secondary}
        />
        <BentoTile
          value={devicesLoading ? '—' : String(smartSwitches.length)}
          label="Total devices"
          icon="devices"
          accent={colors.primary}
        />
      </Animated.View>

      {/* Quick actions strip */}
      <Animated.View entering={enterUp(4)} style={styles.quickRow}>
        <QuickTile
          icon="add-circle"
          label="Add"
          accent={colors.primary}
          onPress={() => navigation.navigate('ScanDevice')}
        />
        <QuickTile
          icon="zap"
          label="Scenes"
          accent={colors.cta}
          onPress={() => navigation.getParent()?.navigate('AutoTab' as never)}
        />
        <QuickTile
          icon="grid"
          label="Devices"
          accent={colors.gradPrimaryEnd}
          onPress={() => navigation.getParent()?.navigate('DevicesTab' as never)}
        />
        <QuickTile
          icon="sliders"
          label="Rooms"
          accent={colors.secondary}
          onPress={() => setShowCreateSite(true)}
        />
      </Animated.View>

      <Animated.View entering={enterUp(5)} style={styles.devicesHeader}>
        <AppText variant="h3">My Devices</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {devicesLoading ? '…' : `${onlineCount} online`}
        </AppText>
      </Animated.View>

      {devicesLoading || fetchUserApi.loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : null}

      {devicesError && !apiDevices?.length ? (
        <AppText variant="body" color={colors.error} style={styles.stateText}>
          {devicesError}
        </AppText>
      ) : null}

      {!devicesLoading && !selectedSite ? (
        <GlassCard style={styles.emptyCard}>
          <Icon name="home" width={28} height={28} color={colors.textTertiary} />
          <AppText variant="bodyLg" color={colors.textSecondary} align="center">
            Select a site above to see your devices.
          </AppText>
        </GlassCard>
      ) : null}

      {!devicesLoading && selectedSite && !smartSwitches.length ? (
        <GlassCard style={styles.emptyCard}>
          <Icon name="plug" width={28} height={28} color={colors.textTertiary} />
          <AppText variant="bodyLg" color={colors.textSecondary} align="center">
            No devices in {selectedSite.location}. Tap Add to get started.
          </AppText>
        </GlassCard>
      ) : null}

      {smartSwitches.map((device, index) => (
        <Animated.View key={device.id} entering={enterUp(index + 6)} layout={layoutSpring}>
          <ConnectedSmartSwitchCard
            device={device}
            onPress={() => navigation.navigate('Device', { deviceId: device.id })}
          />
        </Animated.View>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tile: {
    padding: spacing.md,
    minHeight: 112,
  },
  tileHalf: {
    flex: 1,
  },
  tileWide: {
    flex: 2,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tileValue: {
    marginBottom: 2,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickWrap: {
    flex: 1,
  },
  quickCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.md,
  },
  stateText: {
    marginBottom: spacing.sm,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});

export default Home;
