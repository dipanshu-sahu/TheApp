import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import { fetchUsers } from '../slices/userSlice';
import { AppDispatch, RootState } from '../store/store';
import { fetchDevicesBySite } from '../slices/deviceSlice';
import { fetchWeatherWithLocation } from '../slices/weatherSlice';
import { fetchSitesByUser, selectSite } from '../slices/siteSlice';
import HomeHeader from '../components/home/HomeHeader';
import WeatherWidget from '../components/home/WeatherWidget';
import SiteDropdown from '../components/site/SiteDropdown';
import CreateSiteModal from '../components/site/CreateSiteModal';
// import QuickActionCard from '../components/home/QuickActionCard';
// import CategorySection from '../components/home/CategorySection';
// import HomeDeviceCard from '../components/home/HomeDeviceCard';
import ConnectedSmartSwitchCard from '../components/home/ConnectedSmartSwitchCard';
import { isDeviceOnline } from '../utils/deviceDisplay';
import { filterSmartSwitchDevices } from '../utils/deviceMapper';
// import { mergeWithMockHomeDevices } from '../mocks/homeDevices';
// import {
//   getDeviceIcon,
//   getDeviceStatusLabel,
//   getSwitchGangCount,
//   groupDevicesByHomeSection,
//   HOME_DEVICE_SECTIONS,
//   HomeDeviceSection,
// } from '../utils/deviceDisplay';

type HomeStackParamList = {
  Device: { deviceId: string };
  ScanDevice: undefined;
};

const SMART_SWITCH_SECTION_TITLE = 'Smart Switch';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning ☀️';
  }
  if (hour < 17) {
    return 'Good Afternoon ☀️';
  }
  return 'Good Evening 🌙';
};

const Home: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, fetchUserApi } = useSelector((state: RootState) => state.user);
  const {
    devices: apiDevices,
    isLoading: devicesLoading,
    error: devicesError,
  } = useSelector((state: RootState) => state.devices);

  const { selectedSite } = useSelector((state: RootState) => state.site);

  const [showCreateSite, setShowCreateSite] = useState(false);

  const smartSwitches = useMemo(
    () => filterSmartSwitchDevices(apiDevices ?? []),
    [apiDevices],
  );

  const currentUser = Array.isArray(user) ? user[0] : user;
  const firstName = currentUser?.firstName || '';
  const homeTitle = `${firstName}'s Home`;
  const avatarLabel = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUsers());
    } else if (currentUser.id) {
      dispatch(fetchSitesByUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <CreateSiteModal
        visible={showCreateSite}
        onClose={() => setShowCreateSite(false)}
        onCreated={site => {
          dispatch(selectSite(site));
          setShowCreateSite(false);
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          greeting={getGreeting()}
          homeTitle={homeTitle}
          avatarLabel={avatarLabel}
          onProfilePress={() =>
            navigation.getParent()?.navigate('Profile' as never)
          }
        />

        <SiteDropdown onAddSite={() => setShowCreateSite(true)} />

        <WeatherWidget />

        {/* <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickActionCard
          onPress={() => navigation.navigate('ScanDevice')}
        />

        <CategorySection /> */}

        <View style={styles.devicesHeader}>
          <Text style={styles.sectionTitle}>My Devices</Text>
          <Text style={styles.onlineCount}>
            {devicesLoading ? '...' : `${onlineCount} online`}
          </Text>
        </View>

        {devicesLoading || fetchUserApi.loading ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : null}

        {devicesError && !apiDevices?.length ? (
          <Text style={styles.errorText}>{devicesError}</Text>
        ) : null}

        {!devicesLoading && !selectedSite ? (
          <Text style={styles.emptyText}>
            Select a site above to see your devices.
          </Text>
        ) : null}

        {!devicesLoading && selectedSite && !smartSwitches.length ? (
          <Text style={styles.emptyText}>
            No devices found in {selectedSite.location}. Add a device to get started.
          </Text>
        ) : null}

        {smartSwitches.length > 0 ? (
          <View style={styles.deviceSection}>
            <Text style={styles.deviceSectionTitle}>
              {SMART_SWITCH_SECTION_TITLE}
            </Text>

            {smartSwitches.map(device => (
              <ConnectedSmartSwitchCard
                key={device.id}
                device={device}
                onPress={() =>
                  navigation.navigate('Device', { deviceId: device.id })
                }
              />
            ))}
          </View>
        ) : null}

        {/* {HOME_DEVICE_SECTIONS.map(({ id }) => renderSection(id))} */}
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
  sectionTitle: {
    ...textFont.boldL,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  onlineCount: {
    ...textFont.regularS,
    color: colors.textSecondary,
  },
  deviceSection: {
    marginBottom: 8,
  },
  deviceSectionTitle: {
    ...textFont.boldM,
    color: colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  loader: {
    marginVertical: 16,
  },
  errorText: {
    ...textFont.regularS,
    color: colors.error,
    marginBottom: 12,
  },
  emptyText: {
    ...textFont.regularM,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Home;
