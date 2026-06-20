import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { MyHomeStackParamList } from '../navigation';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import { request, PERMISSIONS } from 'react-native-permissions';
import ToastManager, { Toast } from 'toastify-react-native';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import Icon, { IconName } from '../components/Icon';
import { AppDispatch, RootState } from '../store/store';
import { selectSite } from '../slices/siteSlice';
import SiteDropdown from '../components/site/SiteDropdown';
import CreateSiteModal from '../components/site/CreateSiteModal';

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
      { label: 'Socket (Gateway)', icon: 'plug' },
      { label: 'Socket (NB-IoT)', icon: 'plug' },
    ],
  },
  {
    title: 'LIGHTING',
    items: [
      { label: 'Smart Bulb', icon: 'intro-lightbulb' },
      { label: 'LED Strip', icon: 'intro-lightbulb' },
      { label: 'Switch', icon: 'power-button' },
    ],
  },
];

const ScanRadar = () => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const ringStyle = (scale: number, opacity: number) => ({
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [opacity, opacity * 0.15],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [scale, scale + 0.35],
        }),
      },
    ],
  });

  return (
    <View style={styles.radarWrap}>
      <Animated.View style={[styles.radarRing, styles.radarRingOuter, ringStyle(1, 0.35)]} />
      <Animated.View style={[styles.radarRing, styles.radarRingMid, ringStyle(0.78, 0.5)]} />
      <Animated.View style={[styles.radarRing, styles.radarRingInner, ringStyle(0.55, 0.65)]} />
      <View style={styles.radarCore}>
        <View style={styles.radarDot} />
        <View style={styles.radarBeam} />
      </View>
    </View>
  );
};

const ScanDevice = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyHomeStackParamList>>();
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
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
      title: 'Location permission is required for WiFi connections',
      message:
        'This app needs location permission as this is required ' +
        'to scan for wifi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    })
      .then(() => loadWifiList())
      .catch(() => setIsScanning(false));
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
          item.label.toLowerCase().includes(q) ||
          category.title.toLowerCase().includes(q),
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="arrow-back" width={24} height={24} fill={colors.greyLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Device</Text>
        <TouchableOpacity onPress={loadWifiList} hitSlop={12}>
          <Icon name="search" width={22} height={22} fill={colors.greyLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.siteDropdownWrapper}>
          <SiteDropdown onAddSite={() => setShowCreateSite(true)} />
        </View>

        <View style={styles.scanSection}>
          <Text style={styles.scanTitle}>
            {isScanning ? 'Searching for nearby devices...' : 'Nearby devices'}
          </Text>
          <Text style={styles.scanSubtitle}>
            Make sure the device is powered on and in{' '}
            <Text style={styles.scanHighlight}>pairing</Text>
          </Text>

          {isScanning ? (
            <>
              <ScanRadar />
              <ActivityIndicator color={colors.accent} style={styles.scanLoader} />
            </>
          ) : (
            <View style={styles.deviceList}>
              {wifiList.length === 0 ? (
                <Text style={styles.emptyScan}>
                  No devices found. Tap refresh or move closer to your device.
                </Text>
              ) : (
                wifiList.map(item => (
                  <TouchableOpacity
                    key={item.BSSID}
                    style={styles.deviceRow}
                    onPress={() => handleSelectDevice(item)}
                  >
                    <View style={styles.deviceRowLeft}>
                      <Icon name="plug" width={20} height={20} fill={colors.accent} />
                      <Text style={styles.deviceName}>{item.SSID}</Text>
                    </View>
                    <Icon
                      name="arrow-next"
                      width={16}
                      height={16}
                      fill={colors.greyLight}
                    />
                  </TouchableOpacity>
                ))
              )}
              <TouchableOpacity style={styles.rescanBtn} onPress={loadWifiList}>
                <Text style={styles.rescanText}>Scan again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.manualSection}>
          <View style={styles.manualHeader}>
            <Text style={styles.manualTitle}>Add Manually</Text>
            <View style={styles.searchBar}>
              <Icon name="search" width={16} height={16} fill={colors.textGrey} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a category"
                placeholderTextColor={colors.textGrey}
                value={categoryQuery}
                onChangeText={setCategoryQuery}
              />
            </View>
          </View>

          {filteredCategories.map(category => (
            <View key={category.title} style={styles.categoryBlock}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              {category.subtitle ? (
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              ) : null}
              <View style={styles.categoryRow}>
                {category.items.map(item => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.manualItem}
                    onPress={handleManualSelect}
                    activeOpacity={0.85}
                  >
                    <View style={styles.manualIconBox}>
                      <Icon
                        name={item.icon}
                        width={28}
                        height={28}
                        fill={colors.textPrimary}
                      />
                    </View>
                    <Text style={styles.manualLabel} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default ScanDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  siteDropdownWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  scanSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    minHeight: 280,
    alignItems: 'center',
  },
  scanTitle: {
    ...textFont.boldL,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  scanSubtitle: {
    ...textFont.regularM,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  scanHighlight: {
    color: colors.link,
  },
  scanLoader: {
    marginTop: 16,
  },
  radarWrap: {
    width: 220,
    height: 220,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  radarRingOuter: {
    width: 200,
    height: 200,
  },
  radarRingMid: {
    width: 150,
    height: 150,
  },
  radarRingInner: {
    width: 100,
    height: 100,
  },
  radarCore: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  radarBeam: {
    position: 'absolute',
    left: 12,
    width: 90,
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.85,
  },
  deviceList: {
    width: '100%',
    marginTop: 20,
  },
  deviceRow: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  deviceRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  deviceName: {
    ...textFont.regularM,
    color: colors.textPrimary,
    flex: 1,
  },
  emptyScan: {
    ...textFont.regularM,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 24,
  },
  rescanBtn: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  rescanText: {
    ...textFont.regularM,
    color: colors.link,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lineGrey,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  manualSection: {
    paddingHorizontal: 20,
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  manualTitle: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    maxWidth: 220,
  },
  searchInput: {
    flex: 1,
    ...textFont.regularS,
    color: colors.textPrimary,
    padding: 0,
  },
  categoryBlock: {
    marginBottom: 24,
  },
  categoryTitle: {
    ...textFont.regularS,
    color: colors.textGrey,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  categorySubtitle: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  manualItem: {
    width: 100,
    alignItems: 'center',
  },
  manualIconBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  manualLabel: {
    ...textFont.regularS,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
