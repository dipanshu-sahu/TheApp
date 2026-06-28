import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import { request, PERMISSIONS } from 'react-native-permissions';
import uuid from 'react-native-uuid';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import ToastManager, { Toast } from 'toastify-react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../themes/colors';
import Gap from '../components/Gap';
import { textFont } from '../utils/textFont';
import Icon from '../components/Icon';
import BackButtonHeader from '../components/BackButtonHeader';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import AreaSelectionModal from '../components/scan/AreaSelectionModal';
import { AppDispatch, RootState } from '../store/store';
import { addDevice } from '../slices/deviceSlice';
import { AddDeviceRequest } from '../types/device';
import { MyHomeStackParamList } from '../navigation';
import {
  runProvisioningProtocol,
  ProvisioningResult,
} from '../services/provisioningService';

type SetupStep = 'area_selection' | 'device_password' | 'connecting' | 'select_wifi' | 'provisioning';
const MAX_RECONNECT = 3;

const AddDevice = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyHomeStackParamList>>();
  const route = useRoute<RouteProp<MyHomeStackParamList, 'AddDevice'>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { selectedSite } = useSelector((state: RootState) => state.site);

  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>('area_selection');
  const [meshId, setMeshId] = useState('');
  const [deviceRole, setDeviceRole] = useState<number>(1);
  const [selectedDevicePassword, setSelectedDevicePassword] = useState('');
  const [selectedWifiPassword, setSelectedWifiPassword] = useState('');
  const [selectedWifi, setSelectedWifi] = useState<WifiEntry>();

  const provisioningActiveRef = useRef(false);
  const netInfoUnsubRef = useRef<(() => void) | null>(null);
  const isReconnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const devicePasswordRef = useRef('');

  useEffect(() => {
    devicePasswordRef.current = selectedDevicePassword;
  }, [selectedDevicePassword]);

  const loadHomeWifiList = useCallback(() => {
    WifiManager.loadWifiList()
      .then(list => setWifiList(list.filter(item => item.SSID?.trim().length > 0)))
      .catch(() => {});
  }, []);

  const releaseWifiBinding = useCallback(() => {
    provisioningActiveRef.current = false;
    isReconnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
    netInfoUnsubRef.current?.();
    netInfoUnsubRef.current = null;
    WifiManager.forceWifiUsage(false).catch(() => {});
  }, []);

  const goBackToScan = useCallback(
    (message: string) => {
      releaseWifiBinding();
      setModalVisible(false);
      navigation.navigate('ScanDevice', { retryMessage: message });
    },
    [navigation, releaseWifiBinding],
  );

  const goToHomeWithSuccess = useCallback(() => {
    releaseWifiBinding();
    setModalVisible(false);
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }));
    Toast.show({
      type: 'success',
      text1: 'Device added successfully!',
      text2: 'Your device has been added to the network.',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
  }, [navigation, releaseWifiBinding]);

  useEffect(() => {
    return () => {
      provisioningActiveRef.current = false;
      netInfoUnsubRef.current?.();
      netInfoUnsubRef.current = null;
      WifiManager.forceWifiUsage(false).catch(() => {});
    };
  }, []);

  useEffect(() => {
    const shouldMonitor = setupStep === 'select_wifi' || setupStep === 'provisioning';
    netInfoUnsubRef.current?.();
    netInfoUnsubRef.current = null;

    if (!shouldMonitor || !route.params?.deviceSSID) {
      provisioningActiveRef.current = false;
      return;
    }

    provisioningActiveRef.current = true;
    isReconnectingRef.current = false;
    reconnectAttemptsRef.current = 0;

    const attemptReconnect = async () => {
      if (isReconnectingRef.current || !provisioningActiveRef.current) {
        return;
      }
      isReconnectingRef.current = true;
      Toast.show({
        type: 'info',
        text1: 'Reconnecting to device…',
        text2: `Attempt ${reconnectAttemptsRef.current + 1} of ${MAX_RECONNECT}`,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
      });
      try {
        await WifiManager.connectToProtectedSSID(
          route.params.deviceSSID,
          devicePasswordRef.current,
          false,
          false,
        );
        await WifiManager.forceWifiUsage(true);
        await new Promise<void>(r => setTimeout(r, 1200));
        const currentSsid = await WifiManager.getCurrentWifiSSID();
        if (currentSsid !== route.params.deviceSSID) {
          throw new Error('ssid mismatch after reconnect');
        }
        reconnectAttemptsRef.current = 0;
        isReconnectingRef.current = false;
        provisioningActiveRef.current = true;
        Toast.show({ type: 'success', text1: 'Reconnected to device', position: 'top', visibilityTime: 2000, autoHide: true });
      } catch {
        reconnectAttemptsRef.current += 1;
        isReconnectingRef.current = false;
        if (reconnectAttemptsRef.current >= MAX_RECONNECT) {
          provisioningActiveRef.current = false;
          goBackToScan('Connection to device lost after multiple attempts. Please try again.');
        } else {
          provisioningActiveRef.current = true;
          setTimeout(attemptReconnect, 2500);
        }
      }
    };

    netInfoUnsubRef.current = NetInfo.addEventListener(state => {
      if (!provisioningActiveRef.current || isReconnectingRef.current) {
        return;
      }
      if (state.type === NetInfoStateType.wifi) {
        const ssid = (state.details as { ssid?: string | null } | null)?.ssid;
        if (ssid && ssid !== route.params.deviceSSID) {
          attemptReconnect();
        }
      }
    });

    return () => {
      netInfoUnsubRef.current?.();
      netInfoUnsubRef.current = null;
    };
  }, [setupStep, route.params?.deviceSSID, goBackToScan]);

  useEffect(() => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    request(permission, {
      title: 'Location permission is required for WiFi connections',
      message: 'This app needs location permission to scan for WiFi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    })
      .then(() => loadHomeWifiList())
      .catch(() => {});
  }, [loadHomeWifiList]);

  const connectToDeviceAp = useCallback(async () => {
    if (!route.params?.deviceSSID || selectedDevicePassword.length < 8) {
      return;
    }
    setSetupStep('connecting');

    const verifySsid = async (expected: string, attempts = 6, intervalMs = 1500): Promise<boolean> => {
      for (let i = 0; i < attempts; i++) {
        await new Promise<void>(resolve => setTimeout(resolve, intervalMs));
        try {
          const ssid = await WifiManager.getCurrentWifiSSID();
          if (ssid === expected) {
            return true;
          }
        } catch { /* retry */ }
      }
      return false;
    };

    try {
      await WifiManager.disconnect();
      await WifiManager.connectToProtectedSSID(route.params.deviceSSID, selectedDevicePassword, false, false);
      await WifiManager.forceWifiUsage(true);
      const confirmed = await verifySsid(route.params.deviceSSID);
      if (confirmed) {
        loadHomeWifiList();
        setSetupStep('select_wifi');
      } else {
        goBackToScan('Could not connect to the device. Please try again.');
      }
    } catch {
      goBackToScan('Could not connect to the device. Please try again.');
    }
  }, [route.params, selectedDevicePassword, loadHomeWifiList, goBackToScan]);

  const addDeviceToBackend = useCallback(
    async (meta: ProvisioningResult) => {
      if (!selectedSite?.siteId) {
        goBackToScan('No site selected. Please select a site and try again.');
        return;
      }
      try {
        const payload: AddDeviceRequest = {
          siteId: selectedSite.siteId,
          meshId: meta.meshId,
          srcMac: meta.srcMac || '00:00:00:00:00:00',
          dstMac: meta.dstMac || meta.gatewayMac || '00:00:00:00:00:00',
          gatewayMac: meta.gatewayMac || '00:00:00:00:00:00',
          subGatewayMac: meta.subGatewayMac || '00:00:00:00:00:00',
          boardType: meta.boardType,
          deviceType: meta.deviceType,
          deviceRole: meta.deviceRole,
          userId: meta.userId,
        };
        await dispatch(addDevice(payload)).unwrap();
        goToHomeWithSuccess();
      } catch (error) {
        goBackToScan(
          error instanceof Error ? error.message : 'Failed to add device. Please try again.',
        );
      }
    },
    [dispatch, goToHomeWithSuccess, goBackToScan, selectedSite],
  );

  const handleInitiateProvisioning = useCallback(
    async (wifiItem: WifiEntry) => {
      if (!selectedSite?.siteId) {
        goBackToScan('No site selected. Please select a site and try again.');
        return;
      }

      setSetupStep('provisioning');

      try {
        const result = await runProvisioningProtocol({
          userId: String(user?.id) || '',
          deviceId: uuid.v4() as string,
          wifiSsid: wifiItem.SSID,
          wifiPassword: selectedWifiPassword,
          meshId,
          gatewayMac: '',
          subGatewayMac: '',
          deviceRole,
          siteId: selectedSite.siteId,
          siteLocation: selectedSite.location ?? '',
        });
        await addDeviceToBackend(result);
      } catch (error) {
        goBackToScan(
          error instanceof Error ? error.message : 'Provisioning failed. Please try again.',
        );
      }
    },
    [selectedSite, user, meshId, deviceRole, selectedWifiPassword, goBackToScan, addDeviceToBackend],
  );

  const handleAreaConfirm = useCallback(
    ({ meshId: mid, deviceRole: role }: { meshId: string; deviceRole: number }) => {
      setMeshId(mid);
      setDeviceRole(role);
      setSetupStep('device_password');
      setModalVisible(true);
    },
    [],
  );

  const renderModalDeviceItem = useCallback(
    ({ item }: { item: WifiEntry }) => (
      <>
        <TouchableOpacity style={styles.modalDeviceItem} onPress={() => setSelectedWifi(item)}>
          <Text style={styles.deviceText}>{item.SSID}</Text>
          <Icon
            name={selectedWifi?.BSSID === item.BSSID ? 'arrow-down' : 'arrow-next'}
            width={selectedWifi?.BSSID === item.BSSID ? 14 : 20}
            height={selectedWifi?.BSSID === item.BSSID ? 14 : 20}
            fill={colors.greyLight}
          />
        </TouchableOpacity>
        {selectedWifi?.BSSID === item.BSSID ? (
          <View>
            <CustomInput
              icon="password-lock"
              placeholder="WiFi password"
              maxLength={30}
              value={selectedWifiPassword}
              onChangeText={setSelectedWifiPassword}
              isPassword
            />
            <Gap type="m" />
            <ActionButton
              title="Start Provisioning"
              onPress={() => handleInitiateProvisioning(item)}
              isDisable={selectedWifiPassword.length < 8}
            />
            <Gap type="m" />
          </View>
        ) : null}
      </>
    ),
    [selectedWifi, selectedWifiPassword, handleInitiateProvisioning],
  );

  const renderModalContent = () => {
    switch (setupStep) {
      case 'device_password':
        return (
          <View style={styles.smallModalCard}>
            <Text style={styles.smallModalTitle}>Device Password</Text>
            <Text style={styles.smallModalSubtitle}>Enter the password for {route.params?.deviceSSID}</Text>
            <Gap type="m" />
            <CustomInput
              icon="password-lock"
              placeholder="Device password"
              maxLength={30}
              value={selectedDevicePassword}
              onChangeText={setSelectedDevicePassword}
              isPassword
            />
            <Gap type="l" />
            <ActionButton title="Connect" onPress={connectToDeviceAp} isDisable={selectedDevicePassword.length < 8} />
          </View>
        );
      case 'connecting':
        return (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Connecting to device...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we connect to your device.</Text>
          </View>
        );
      case 'provisioning':
        return (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Setting up your device</Text>
            <Text style={styles.loadingSubtext}>This may take a moment. Keep your phone close to the device.</Text>
          </View>
        );
      case 'select_wifi':
        return (
          <View style={styles.sheetContent}>
            <Text style={styles.modalHeaderText}>Select WiFi network for your device</Text>
            <FlatList
              data={wifiList}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.BSSID.toString()}
              contentContainerStyle={styles.flatListContent}
              renderItem={renderModalDeviceItem}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const isSmallModal = setupStep === 'device_password' || setupStep === 'connecting' || setupStep === 'provisioning';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButtonHeader />
        <Text style={styles.headerText}>Add Device</Text>
        <Gap type="l" />
        <Text style={styles.subText}>Setting up {route.params.deviceSSID}</Text>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => { if (setupStep === 'device_password') { navigation.goBack(); } }}
      >
        <Pressable
          style={[styles.modalBackdrop, isSmallModal && styles.modalBackdropCentered]}
          onPress={() => { if (setupStep === 'device_password') { navigation.goBack(); } }}
        >
          {isSmallModal ? (
            <Pressable style={styles.smallModalWrap} onPress={() => {}}>
              {renderModalContent()}
            </Pressable>
          ) : (
            <View style={styles.bottomSheetWrap}>
              <View style={styles.sheetHandle} />
              {renderModalContent()}
            </View>
          )}
        </Pressable>
      </Modal>

      <AreaSelectionModal
        visible={setupStep === 'area_selection'}
        onClose={() => navigation.goBack()}
        onConfirm={handleAreaConfirm}
      />

      <ToastManager config={{}} />
    </SafeAreaView>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { flex: 1, padding: 16 },
  headerText: { fontSize: 24, color: colors.textPrimary },
  subText: { ...textFont.regularM, color: colors.textSecondary },
  flatListContent: { paddingBottom: 20 },
  deviceText: { ...textFont.regularS, color: colors.textPrimary },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBackdropCentered: { justifyContent: 'center', paddingHorizontal: 24 },
  smallModalWrap: { width: '100%', maxWidth: 360, alignSelf: 'center' },
  smallModalCard: { backgroundColor: colors.bgSecondary, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.inputBorder },
  smallModalTitle: { ...textFont.boldL, color: colors.textPrimary },
  smallModalSubtitle: { ...textFont.regularS, color: colors.textSecondary, marginTop: 6 },
  loaderCard: { backgroundColor: colors.bgSecondary, borderRadius: 16, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: colors.inputBorder },
  loadingText: { ...textFont.boldL, color: colors.textPrimary, marginTop: 16, textAlign: 'center' },
  loadingSubtext: { ...textFont.regularS, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  bottomSheetWrap: { backgroundColor: colors.bgSecondary, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%', paddingBottom: 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.lineGrey, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  sheetContent: { paddingHorizontal: 16, paddingTop: 8, maxHeight: 520 },
  modalHeaderText: { ...textFont.boldL, color: colors.textPrimary, marginBottom: 16 },
  modalDeviceItem: { backgroundColor: colors.bgPrimary, padding: 12, borderRadius: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
});
