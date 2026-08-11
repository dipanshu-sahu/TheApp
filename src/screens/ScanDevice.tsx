import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { MyHomeStackParamList } from '../navigation';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import ToastManager, { Toast } from 'toastify-react-native';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import TextField from '../components/ui/TextField';
import GlassCard from '../components/ui/GlassCard';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import { enterUp } from '../components/ui/motion';
import { colors } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';
import Icon, { IconName } from '../components/Icon';
import { AppDispatch, RootState } from '../store/store';
import { selectSite } from '../slices/siteSlice';
import SiteDropdown from '../components/site/SiteDropdown';
import CreateSiteModal from '../components/site/CreateSiteModal';
import ScanRadar from '../components/scan/ScanRadar';
import { hasLocationPermission } from '../utils/permissions';

type ManualItem = { label: string; icon: IconName };

type ManualCategory = {
  title: string;
  subtitle?: string;
  items: ManualItem[];
};

const MANUAL_CATEGORIES: ManualCategory[] = [
  {
    title: 'ELECTRICAL',
    subtitle: 'Socket',
    items: [
      { label: 'Socket', icon: 'plug' },
      { label: 'Socket (Gateway)', icon: 'mesh' },
      { label: 'Socket (NB-IoT)', icon: 'wifi' },
    ],
  },
  {
    title: 'LIGHTING',
    items: [
      { label: 'Smart Bulb', icon: 'bulb' },
      { label: 'LED Strip', icon: 'zap' },
      { label: 'Switch', icon: 'switch' },
    ],
  },
];

const ScanDevice = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyHomeStackParamList>>();
  const route = useRoute<RouteProp<MyHomeStackParamList, 'ScanDevice'>>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSite } = useSelector((state: RootState) => state.site);

  const [isScanning, setIsScanning] = useState(true);
  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [showCreateSite, setShowCreateSite] = useState(false);

  const loadWifiList = useCallback(() => {
    setIsScanning(true);
    WifiManager.loadWifiList()
      .then(list => {
        setWifiList(list.filter(item => item.SSID?.trim().length > 0));
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'Scan failed',
          text2: 'Could not load nearby WiFi networks.',
          position: 'top',
        });
      })
      .finally(() => setIsScanning(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const granted = await hasLocationPermission();
      if (cancelled) {
        return;
      }
      if (granted) {
        loadWifiList();
      } else {
        setIsScanning(false);
        Toast.show({
          type: 'error',
          text1: 'Location required',
          text2: 'Allow location access to scan for nearby devices.',
          position: 'top',
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadWifiList]);

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) {
      return MANUAL_CATEGORIES;
    }
    return MANUAL_CATEGORIES.map(category => ({
      ...category,
      items: category.items.filter(
        item =>
          item.label.toLowerCase().includes(q) || category.title.toLowerCase().includes(q),
      ),
    })).filter(category => category.items.length > 0);
  }, [categoryQuery]);

  useEffect(() => {
    if (route.params?.retryMessage) {
      Toast.show({
        type: 'error',
        text1: 'Setup failed',
        text2: route.params.retryMessage,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      navigation.setParams({ retryMessage: undefined });
    }
  }, [route.params?.retryMessage, navigation]);

  const handleSelectDevice = useCallback(
    (item: WifiEntry) => {
      if (!selectedSite) {
        Toast.show({
          type: 'error',
          text1: 'No site selected',
          text2: 'Please select a site first.',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }
      navigation.navigate('AddDevice', {
        deviceSSID: item.SSID,
        deviceBSSID: item.BSSID,
      });
    },
    [navigation, selectedSite],
  );

  const handleManualSelect = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: 'Use WiFi scan',
      text2: 'Select your device from the scan results above.',
      position: 'top',
    });
  }, []);

  return (
    <Screen edges={['top']} padded={false}>
      <View style={styles.header}>
        <AnimatedPressable onPress={() => navigation.goBack()} pressScale={0.9} style={styles.headerBtn}>
          <Icon name="arrow-back" width={24} height={24} fill={colors.textSecondary} />
        </AnimatedPressable>
        <AppText variant="h3">Add Device</AppText>
        <AnimatedPressable onPress={loadWifiList} pressScale={0.9} style={styles.headerBtn}>
          <Icon name="search" width={22} height={22} fill={colors.textSecondary} />
        </AnimatedPressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <SiteDropdown onAddSite={() => setShowCreateSite(true)} />
        </View>

        <View style={styles.scanSection}>
          <AppText variant="h3" align="center">
            {isScanning ? 'Searching for nearby devices...' : 'Nearby devices'}
          </AppText>
          <AppText variant="bodyLg" color={colors.textSecondary} align="center" style={styles.scanSubtitle}>
            Make sure the device is powered on and in <AppText variant="bodyLgStrong" color={colors.link}>pairing</AppText>
          </AppText>

          {isScanning ? (
            <GlassCard variant="soft" style={styles.radarPanel}>
              <ScanRadar />
              <AppText variant="caption" color={colors.textSecondary} style={styles.radarHint}>
                Sweeping local Wi‑Fi for pairable hardware
              </AppText>
              <ActivityIndicator color={colors.primary} style={styles.scanLoader} />
            </GlassCard>
          ) : (
            <View style={styles.deviceList}>
              {wifiList.length === 0 ? (
                <AppText variant="bodyLg" color={colors.textSecondary} align="center" style={styles.emptyScan}>
                  No devices found. Tap refresh or move closer to your device.
                </AppText>
              ) : (
                wifiList.map((item, index) => (
                  <Animated.View key={item.BSSID} entering={enterUp(index, 40)}>
                    <AnimatedPressable
                      style={styles.deviceRow}
                      onPress={() => handleSelectDevice(item)}
                      pressScale={0.98}
                      enforceTouchTarget={false}
                    >
                      <View style={styles.deviceRowLeft}>
                        <View style={styles.deviceIcon}>
                          <Icon name="wifi" width={20} height={20} color={colors.primary} />
                        </View>
                        <AppText variant="bodyLg" numberOfLines={1} style={styles.deviceName}>
                          {item.SSID}
                        </AppText>
                      </View>
                      <Icon name="arrow-next" width={16} height={16} fill={colors.textTertiary} />
                    </AnimatedPressable>
                  </Animated.View>
                ))
              )}
              <AnimatedPressable style={styles.rescanBtn} onPress={loadWifiList} pressScale={0.95}>
                <AppText variant="bodyLg" color={colors.link}>
                  Scan again
                </AppText>
              </AnimatedPressable>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.manualSection}>
          <View style={styles.manualHeader}>
            <AppText variant="h3">Add Manually</AppText>
            <TextField
              icon="search"
              containerStyle={styles.searchField}
              placeholder="Search"
              value={categoryQuery}
              onChangeText={setCategoryQuery}
            />
          </View>

          {filteredCategories.map(category => (
            <View key={category.title} style={styles.categoryBlock}>
              <AppText variant="label" color={colors.textTertiary}>
                {category.title}
              </AppText>
              {category.subtitle ? (
                <AppText variant="caption" color={colors.textSecondary} style={styles.categorySubtitle}>
                  {category.subtitle}
                </AppText>
              ) : null}
              <View style={styles.categoryRow}>
                {category.items.map(item => (
                  <AnimatedPressable
                    key={item.label}
                    style={styles.manualItem}
                    onPress={handleManualSelect}
                    pressScale={0.92}
                    enforceTouchTarget={false}
                  >
                    <View style={styles.manualIconBox}>
                      <Icon name={item.icon} width={28} height={28} color={colors.primary} />
                    </View>
                    <AppText variant="caption" color={colors.textSecondary} align="center" numberOfLines={2}>
                      {item.label}
                    </AppText>
                  </AnimatedPressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CreateSiteModal
        visible={showCreateSite}
        onClose={() => setShowCreateSite(false)}
        onCreated={site => {
          dispatch(selectSite(site));
          setShowCreateSite(false);
        }}
      />

      <ToastManager config={{}} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  scanSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    minHeight: 280,
    alignItems: 'center',
  },
  scanSubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  radarPanel: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  radarHint: {
    marginTop: spacing.md,
  },
  scanLoader: {
    marginTop: spacing.sm,
  },
  deviceList: {
    width: '100%',
    marginTop: spacing.lg,
  },
  deviceRow: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.lg,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  deviceRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    paddingRight: spacing.xs,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    flex: 1,
  },
  emptyScan: {
    marginVertical: spacing.xl,
  },
  rescanBtn: {
    alignSelf: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
  },
  manualSection: {
    paddingHorizontal: spacing.lg,
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchField: {
    flex: 1,
    maxWidth: 200,
    marginBottom: 0,
  },
  categoryBlock: {
    marginBottom: spacing.xl,
    gap: spacing.xxs,
  },
  categorySubtitle: {
    marginBottom: spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  manualItem: {
    width: 100,
    alignItems: 'center',
    gap: spacing.xs,
  },
  manualIconBox: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScanDevice;
