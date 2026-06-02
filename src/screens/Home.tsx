import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
import { fetchDevices } from '../slices/deviceSlice';
import HomeHeader from '../components/home/HomeHeader';
import WeatherWidget from '../components/home/WeatherWidget';
import QuickActionCard from '../components/home/QuickActionCard';
import CategorySection from '../components/home/CategorySection';
import HomeDeviceCard from '../components/home/HomeDeviceCard';
import SmartSwitchDeviceCard from '../components/home/SmartSwitchDeviceCard';
import {
  getDeviceIcon,
  getDeviceStatusLabel,
  getSwitchGangCount,
  groupDevicesByHomeSection,
  HOME_DEVICE_SECTIONS,
  HomeDeviceSection,
  isDeviceOnline,
} from '../utils/deviceDisplay';
import { DeviceInfo } from '../types/device';
import { mergeWithMockHomeDevices } from '../mocks/homeDevices';

type HomeStackParamList = {
  Device: { deviceId: string };
  ScanDevice: undefined;
};

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

const chunkPairs = (list: DeviceInfo[]): DeviceInfo[][] => {
  const pairs: DeviceInfo[][] = [];
  for (let i = 0; i < list.length; i += 2) {
    pairs.push(list.slice(i, i + 2));
  }
  return pairs;
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

  const devices = useMemo(
    () => mergeWithMockHomeDevices(apiDevices ?? []),
    [apiDevices],
  );

  const [toggleState, setToggleState] = useState<Record<string, boolean>>({});
  const [gangState, setGangState] = useState<Record<string, boolean[]>>({});

  const currentUser = Array.isArray(user) ? user[0] : user;
  const firstName = currentUser?.firstName || 'Rahul';
  const homeTitle = `${firstName}'s Home`;
  const avatarLabel = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (devices?.length) {
      setToggleState(prev => {
        const next = { ...prev };
        devices.forEach((device, index) => {
          if (next[device.id] === undefined) {
            next[device.id] = isDeviceOnline(device) || index % 2 === 0;
          }
        });
        return next;
      });

      setGangState(prev => {
        const next = { ...prev };
        devices.forEach((device, index) => {
          if (next[device.id] === undefined) {
            const gangCount = getSwitchGangCount(device.name);
            const deviceOn = isDeviceOnline(device) || index % 2 === 0;
            next[device.id] = Array.from({ length: gangCount }, () => deviceOn);
          }
        });
        return next;
      });
    }
  }, [devices]);

  const groupedDevices = useMemo(
    () => groupDevicesByHomeSection(devices ?? []),
    [devices],
  );

  const onlineCount = useMemo(
    () =>
      devices?.filter(
        device => toggleState[device.id] ?? isDeviceOnline(device),
      ).length ?? 0,
    [devices, toggleState],
  );

  const handleToggle = useCallback((deviceId: string, value: boolean) => {
    setToggleState(prev => ({ ...prev, [deviceId]: value }));
  }, []);

  const handleMainSwitchToggle = useCallback(
    (device: DeviceInfo, value: boolean) => {
      handleToggle(device.id, value);
      const gangCount = getSwitchGangCount(device.name);
      setGangState(prev => ({
        ...prev,
        [device.id]: Array.from({ length: gangCount }, () => value),
      }));
    },
    [handleToggle],
  );

  const handleGangToggle = useCallback(
    (device: DeviceInfo, index: number, value: boolean) => {
      setGangState(prev => {
        const current = prev[device.id] ?? [];
        const nextGangs = [...current];
        nextGangs[index] = value;
        const anyOn = nextGangs.some(Boolean);
        setToggleState(togglePrev => ({ ...togglePrev, [device.id]: anyOn }));
        return { ...prev, [device.id]: nextGangs };
      });
    },
    [],
  );

  const renderStandardDeviceGrid = (
    sectionDevices: DeviceInfo[],
    sectionOffset: number,
  ) =>
    chunkPairs(sectionDevices).map((pair, pairIndex) => (
      <View
        key={pair.map(d => d.id).join('-')}
        style={styles.deviceRow}
      >
        {pair.map((device, colIndex) => {
          const globalIndex = sectionOffset + pairIndex * 2 + colIndex;
          const isOn = toggleState[device.id] ?? isDeviceOnline(device);

          return (
            <View key={device.id} style={styles.deviceCol}>
              <HomeDeviceCard
                name={device.name}
                statusLabel={getDeviceStatusLabel(device, globalIndex)}
                icon={getDeviceIcon(device?.name || '')}
                isOn={isOn}
                onToggle={value => handleToggle(device.id, value)}
                onPress={() =>
                  navigation.navigate('Device', { deviceId: device.id })
                }
              />
            </View>
          );
        })}
        {pair.length === 1 ? <View style={styles.deviceCol} /> : null}
      </View>
    ));

  const renderSection = (section: HomeDeviceSection) => {
    const sectionDevices = groupedDevices[section];
    if (!sectionDevices.length) {
      return null;
    }

    const sectionMeta = HOME_DEVICE_SECTIONS.find(s => s.id === section);

    return (
      <View key={section} style={styles.deviceSection}>
        <Text style={styles.deviceSectionTitle}>{sectionMeta?.title}</Text>

        {section === 'switch'
          ? sectionDevices.map(device => {
              const isOn = toggleState[device.id] ?? isDeviceOnline(device);
              const gangs =
                gangState[device.id] ??
                Array.from(
                  { length: getSwitchGangCount(device.name) },
                  () => isOn,
                );

              return (
                <SmartSwitchDeviceCard
                  key={device.id}
                  name={device.name}
                  isOn={isOn}
                  gangStates={gangs}
                  onMainToggle={value => handleMainSwitchToggle(device, value)}
                  onGangToggle={(index, value) =>
                    handleGangToggle(device, index, value)
                  }
                  onPress={() =>
                    navigation.navigate('Device', { deviceId: device.id })
                  }
                />
              );
            })
          : renderStandardDeviceGrid(
              sectionDevices,
              section === 'light' ? 0 : groupedDevices.light.length,
            )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

        <WeatherWidget />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickActionCard
          onPress={() => navigation.navigate('ScanDevice')}
        />

        <CategorySection />

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

        {!devicesLoading && !devices.length ? (
          <Text style={styles.emptyText}>
            No devices yet. Tap Add New Device to get started.
          </Text>
        ) : null}

        {HOME_DEVICE_SECTIONS.map(({ id }) => renderSection(id))}
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
  deviceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  deviceCol: {
    flex: 1,
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
