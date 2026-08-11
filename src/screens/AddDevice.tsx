import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import uuid from 'react-native-uuid';
import NetInfo, { NetInfoStateType, NetInfoWifiState } from '@react-native-community/netinfo';
import ToastManager, { Toast } from 'toastify-react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import { colors } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';
import { shadows } from '../themes/shadows';
import { durations, easings } from '../themes/motion';
import Gap from '../components/Gap';
import Icon from '../components/Icon';
import BackButtonHeader from '../components/BackButtonHeader';
import AreaSelectionModal from '../components/scan/AreaSelectionModal';
import { AppDispatch, RootState } from '../store/store';
import { addDevice } from '../slices/deviceSlice';
import { AddDeviceRequest } from '../types/device';
import { MyHomeStackParamList } from '../navigation';
import {
  runProvisioningProtocol,
  ProvisioningResult,
} from '../services/provisioningService';
import { hasLocationPermission } from '../utils/permissions';

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
        const wifiState = state as NetInfoWifiState;
        const ssid = wifiState.details?.ssid ?? null;
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
    hasLocationPermission()
      .then((granted) => {
        if (granted) {
          loadHomeWifiList();
        }
      })
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
    ({ item }: { item: WifiEntry }) => {
      const isSelected = selectedWifi?.BSSID === item.BSSID;
      return (
        <>
          <AnimatedPressable
            style={[styles.modalDeviceItem, isSelected && styles.modalDeviceItemSelected]}
            onPress={() => setSelectedWifi(item)}
            pressScale={0.98}
            enforceTouchTarget={false}
          >
            <AppText variant="bodyLg">{item.SSID}</AppText>
            <Icon
              name={isSelected ? 'arrow-down' : 'arrow-next'}
              width={isSelected ? 14 : 18}
              height={isSelected ? 14 : 18}
              fill={colors.textTertiary}
            />
          </AnimatedPressable>
          {isSelected ? (
            <View style={styles.wifiPasswordBlock}>
              <TextField
                icon="password-lock"
                placeholder="WiFi password"
                maxLength={30}
                value={selectedWifiPassword}
                onChangeText={setSelectedWifiPassword}
                isPassword
              />
              <Button
                title="Start Provisioning"
                onPress={() => handleInitiateProvisioning(item)}
                disabled={selectedWifiPassword.length < 8}
              />
              <Gap type="m" />
            </View>
          ) : null}
        </>
      );
    },
    [selectedWifi, selectedWifiPassword, handleInitiateProvisioning],
  );

  const renderModalContent = () => {
    switch (setupStep) {
      case 'device_password':
        return (
          <View style={styles.smallModalCard}>
            <AppText variant="h3">Device Password</AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.smallModalSubtitle}>
              Enter the password for {route.params?.deviceSSID}
            </AppText>
            <Gap type="m" />
            <TextField
              icon="password-lock"
              placeholder="Device password"
              maxLength={30}
              value={selectedDevicePassword}
              onChangeText={setSelectedDevicePassword}
              isPassword
            />
            <Gap type="s" />
            <Button title="Connect" onPress={connectToDeviceAp} disabled={selectedDevicePassword.length < 8} />
          </View>
        );
      case 'connecting':
        return (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="h3" align="center" style={styles.loadingText}>
              Connecting to device...
            </AppText>
            <AppText variant="body" color={colors.textSecondary} align="center" style={styles.loadingSubtext}>
              Please wait while we connect to your device.
            </AppText>
          </View>
        );
      case 'provisioning':
        return (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="h3" align="center" style={styles.loadingText}>
              Setting up your device
            </AppText>
            <AppText variant="body" color={colors.textSecondary} align="center" style={styles.loadingSubtext}>
              This may take a moment. Keep your phone close to the device.
            </AppText>
          </View>
        );
      case 'select_wifi':
        return (
          <View style={styles.sheetContent}>
            <AppText variant="h3" style={styles.modalHeaderText}>
              Select WiFi network for your device
            </AppText>
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
    <Screen edges={['top', 'bottom']}>
      <BackButtonHeader />
      <AppText variant="h1">Add Device</AppText>
      <Gap type="l" />
      <AppText variant="bodyLg" color={colors.textSecondary}>
        Setting up {route.params.deviceSSID}
      </AppText>

      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={() => { if (setupStep === 'device_password') { navigation.goBack(); } }}
      >
        <Animated.View entering={FadeIn.duration(durations.fast)} exiting={FadeOut.duration(durations.fast)} style={styles.flex}>
          <Pressable
            style={[styles.modalBackdrop, isSmallModal && styles.modalBackdropCentered]}
            onPress={() => { if (setupStep === 'device_password') { navigation.goBack(); } }}
          >
            {isSmallModal ? (
              <Animated.View entering={FadeIn.duration(durations.base).easing(easings.decelerate)} style={styles.smallModalWrap}>
                <Pressable onPress={() => {}}>{renderModalContent()}</Pressable>
              </Animated.View>
            ) : (
              <Animated.View entering={SlideInDown.duration(durations.base).easing(easings.decelerate)} style={styles.bottomSheetWrap}>
                <View style={styles.sheetHandle} />
                {renderModalContent()}
              </Animated.View>
            )}
          </Pressable>
        </Animated.View>
      </Modal>

      <AreaSelectionModal
        visible={setupStep === 'area_selection'}
        onClose={() => navigation.goBack()}
        onConfirm={handleAreaConfirm}
      />

      <ToastManager config={{}} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: spacing.lg,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  modalBackdropCentered: {
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  smallModalWrap: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  smallModalCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  smallModalSubtitle: {
    marginTop: spacing.xxs,
  },
  loaderCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.lg,
  },
  loadingText: {
    marginTop: spacing.md,
  },
  loadingSubtext: {
    marginTop: spacing.xs,
  },
  bottomSheetWrap: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    maxHeight: '75%',
    paddingBottom: spacing.xl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sheetContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    maxHeight: 520,
  },
  modalHeaderText: {
    marginBottom: spacing.md,
  },
  modalDeviceItem: {
    backgroundColor: colors.surfaceCard,
    padding: spacing.sm,
    borderRadius: radii.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modalDeviceItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  wifiPasswordBlock: {
    marginBottom: spacing.xs,
  },
});

export default AddDevice;
