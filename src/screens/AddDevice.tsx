import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';
import { SafeAreaView } from 'react-native-safe-area-context';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getDeviceId } from 'react-native-device-info';
import ToastManager, { Toast } from 'toastify-react-native';

import { colors } from '../themes/colors';
import Gap from '../components/Gap';
import { textFont } from '../utils/textFont';
import Icon from '../components/Icon';
import BackButtonHeader from '../components/BackButtonHeader';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import {
  RouteProp,
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addDevice } from '../slices/deviceSlice';
import { AddDeviceRequest } from '../types/device';
import { MyHomeStackParamList } from '../navigation';

enum ProvisioningStep {
  eResponse_D2A_Provision = 300,
  eResponse_D2C_Provision = 400,
  eUserDetails_A2D_Provision = 201,
  eMeshDetails_A2D_Provision,
  eMqttDetails_A2D_Provision,
  eDeviceDetails_A2D_Provision,
  eDataExchangeDone_A2D_Provision,
  eInvalid_Provision,
}

type SetupStep = 'device_password' | 'connecting' | 'select_wifi' | 'provisioning';

const AddDevice = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MyHomeStackParamList>>();
  const route = useRoute<RouteProp<MyHomeStackParamList, 'AddDevice'>>();
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = route.params;

  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [setupStep, setSetupStep] = useState<SetupStep>('device_password');
  const [selectedDevicePassword, setSelectedDevicePassword] = useState('');
  const [selectedWifiPassword, setSelectedWifiPassword] = useState('');
  const [selectedWifi, setSelectedWifi] = useState<WifiEntry>();

  const loadHomeWifiList = useCallback(() => {
    WifiManager.loadWifiList()
      .then(list => setWifiList(list.filter(item => item.SSID?.trim().length > 0)))
      .catch(error => {
        console.log({ error });
      });
  }, []);

  const goBackToScan = useCallback(
    (message: string) => {
      setModalVisible(false);
      navigation.navigate('ScanDevice', { retryMessage: message });
    },
    [navigation],
  );

  const goToHomeWithSuccess = useCallback(() => {
    setModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
    Toast.show({
      type: 'success',
      text1: 'Device added successfully!',
      text2: 'Your device has been added to the network.',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
  }, [navigation]);

  useEffect(() => {
    if (!routeParams) {
      navigation.goBack();
    }
  }, [routeParams, navigation]);

  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
      title: 'Location permission is required for WiFi connections',
      message:
        'This app needs location permission as this is required  ' +
        'to scan for wifi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    })
      .then(() => loadHomeWifiList())
      .catch(error => {
        console.log(error);
      });
  }, [loadHomeWifiList]);

  const connectToDeviceAp = useCallback(() => {
    if (!routeParams?.deviceSSID || selectedDevicePassword.length < 8) {
      return;
    }
    setSetupStep('connecting');
    WifiManager.disconnect().then(() => {
      WifiManager.connectToProtectedSSID(
        routeParams.deviceSSID,
        selectedDevicePassword,
        false,
        false,
      )
        .then(() => {
          WifiManager.getCurrentWifiSSID().then(
            currentSsid => {
              if (currentSsid === routeParams.deviceSSID) {
                loadHomeWifiList();
                setSetupStep('select_wifi');
              } else {
                goBackToScan(
                  'Could not connect to the device. Please try again.',
                );
              }
            },
            () =>
              goBackToScan(
                'Could not connect to the device. Please try again.',
              ),
          );
        })
        .catch(() =>
          goBackToScan('Could not connect to the device. Please try again.'),
        );
    });
  }, [
    routeParams,
    selectedDevicePassword,
    loadHomeWifiList,
    goBackToScan,
  ]);

  const addDeviceToBackend = useCallback(
    async (data: {
      meshId: string;
      gatewayMac: string;
      subGatewayMac: string;
      deviceRole: number;
      srcMac: string;
      dstMac: string;
      boardType: number;
      deviceType: number;
      userId: string;
    }) => {
      if (!data.meshId) {
        return;
      }
      try {
        const payload: AddDeviceRequest = {
          siteId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          meshId: data.meshId,
          srcMac: data.srcMac || '00:00:00:00:00:00',
          dstMac: data.dstMac || data.gatewayMac || '00:00:00:00:00:00',
          gatewayMac: data.gatewayMac || '00:00:00:00:00:00',
          subGatewayMac: data.subGatewayMac || '00:00:00:00:00:00',
          boardType: data.boardType ?? 0,
          deviceType: data.deviceType ?? 0,
          deviceRole: data.deviceRole ?? 0,
          userId: data.userId || '',
        };

        await dispatch(addDevice(payload)).unwrap();
        goToHomeWithSuccess();
      } catch (error) {
        goBackToScan(
          error instanceof Error
            ? error.message
            : 'Failed to add device. Please try again.',
        );
      }
    },
    [dispatch, goToHomeWithSuccess, goBackToScan],
  );

  const handleInitiateProvisioning = useCallback(
    (wifiItem: WifiEntry) => {
      setSetupStep('provisioning');
      const USER_ID = 'APP_USER_ID';
      const deviceId = getDeviceId();
      const meshId = 'aavitaRoom113#@';
      const gatewayMac = 'AB:CD:E1:23:45';
      const subGatewayMac = 'AB:CD:E1:23:45';
      const deviceRole = 1;
      const brokerUrl = 'http://ip:port';
      const mqttUsrName = 'abcd134';
      const mqttUsrPswd = 'mqttUsrPswd';
      const lwtTopic = 'lwtTopic_name';
      const mqttPubTopic = 'mqttPubTopic_name';
      const mqttSubTopic = 'mqttSubTopic_name';
      const Wifissid = wifiItem?.SSID;
      const Wifipswd = selectedWifiPassword;

      const provisionMeta = {
        meshId,
        gatewayMac,
        subGatewayMac,
        deviceRole,
        srcMac: deviceId || '00:00:00:00:00:00',
        dstMac: gatewayMac,
        boardType: 0,
        deviceType: 0,
        userId: USER_ID,
      };

      let provisionFailed = false;
      const failProvisioning = () => {
        if (provisionFailed) {
          return;
        }
        provisionFailed = true;
        goBackToScan('Provisioning failed. Please try again.');
      };

      const client = TcpSocket.createConnection(
        { port: 3333, host: '192.168.10.1' },
        () => {
          let step = 1;
          let stopped = false;
          const send = (obj: Record<string, unknown>) =>
            client.write(JSON.stringify(obj));

          send({
            payloadType: ProvisioningStep.eUserDetails_A2D_Provision,
            usrId: USER_ID,
          });

          client.on('data', data => {
            if (stopped) {
              return;
            }
            try {
              const response = JSON.parse(data.toString());
              if (response.status === -1) {
                stopped = true;
                client.destroy();
                failProvisioning();
                return;
              }
              switch (step) {
                case 1:
                  send({
                    payloadType: ProvisioningStep.eMeshDetails_A2D_Provision,
                    usrId: USER_ID,
                    deviceId,
                    Wifissid,
                    Wifipswd,
                  });
                  step++;
                  break;
                case 2:
                  send({
                    payloadType: ProvisioningStep.eMqttDetails_A2D_Provision,
                    usrId: USER_ID,
                    deviceId,
                    meshId,
                    gatewayMac,
                    subGatewayMac,
                    deviceRole,
                  });
                  step++;
                  break;
                case 3:
                  send({
                    payloadType: ProvisioningStep.eDeviceDetails_A2D_Provision,
                    usrId: USER_ID,
                    deviceId,
                    brokerUrl,
                    mqttUsrName,
                    mqttUsrPswd,
                    lwtTopic,
                    mqttPubTopic,
                    mqttSubTopic,
                  });
                  step++;
                  break;
                case 4:
                  send({
                    payloadType:
                      ProvisioningStep.eDataExchangeDone_A2D_Provision,
                    usrId: USER_ID,
                    deviceId,
                  });
                  step++;
                  break;
                case 5:
                  stopped = true;
                  client.destroy();
                  addDeviceToBackend(provisionMeta);
                  break;
                default:
                  break;
              }
            } catch {
              stopped = true;
              client.destroy();
              failProvisioning();
            }
          });

          client.on('error', () => {
            stopped = true;
            client.destroy();
            failProvisioning();
          });

          client.on('close', () => {
            if (!stopped) {
              failProvisioning();
            }
          });
        },
      );

    },
    [selectedWifiPassword, goBackToScan, addDeviceToBackend],
  );

  const renderModalDeviceItem = useCallback(
    ({ item }: { item: WifiEntry }) => (
      <>
        <TouchableOpacity
          style={styles.modalDeviceItem}
          onPress={() => setSelectedWifi(item)}
        >
          <Text style={styles.deviceText}>{item.SSID}</Text>
          {selectedWifi?.BSSID === item.BSSID ? (
            <Icon
              name="arrow-down"
              width={14}
              height={14}
              fill={colors.greyLight}
            />
          ) : (
            <Icon
              name="arrow-next"
              width={20}
              height={20}
              fill={colors.greyLight}
            />
          )}
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
            <Text style={styles.smallModalSubtitle}>
              Enter the password for {routeParams?.deviceSSID}
            </Text>
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
            <ActionButton
              title="Connect"
              onPress={connectToDeviceAp}
              isDisable={selectedDevicePassword.length < 8}
            />
          </View>
        );

      case 'connecting':
        return (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Connecting to device...</Text>
            <Text style={styles.loadingSubtext}>
              Please wait while we connect to your device.
            </Text>
          </View>
        );

      case 'provisioning':
        return (
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Setting up your device</Text>
            <Text style={styles.loadingSubtext}>
              This may take a moment. Keep your phone close to the device.
            </Text>
          </View>
        );

      case 'select_wifi':
        return (
          <View style={styles.sheetContent}>
            <Text style={styles.modalHeaderText}>
              Select WiFi network for your device
            </Text>
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

  const isSmallModal =
    setupStep === 'device_password' ||
    setupStep === 'connecting' ||
    setupStep === 'provisioning';

  if (!routeParams) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButtonHeader />
        <Text style={styles.headerText}>Add Device</Text>
        <Gap type="l" />
        <Text style={styles.subText}>
          Setting up {routeParams.deviceSSID}
        </Text>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          if (setupStep === 'device_password') {
            navigation.goBack();
          }
        }}
      >
        <Pressable
          style={[
            styles.modalBackdrop,
            isSmallModal && styles.modalBackdropCentered,
          ]}
          onPress={() => {
            if (setupStep === 'device_password') {
              navigation.goBack();
            }
          }}
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
      <ToastManager config={{}} />
    </SafeAreaView>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  subText: {
    ...textFont.regularM,
    color: colors.textSecondary,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  deviceText: {
    ...textFont.regularS,
    color: colors.textPrimary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalBackdropCentered: {
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  smallModalWrap: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  smallModalCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  smallModalTitle: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  smallModalSubtitle: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 6,
  },
  loaderCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  loadingText: {
    ...textFont.boldL,
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...textFont.regularS,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSheetWrap: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lineGrey,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    maxHeight: 520,
  },
  modalHeaderText: {
    ...textFont.boldL,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  modalDeviceItem: {
    backgroundColor: colors.bgPrimary,
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
