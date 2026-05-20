import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
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
import {
  ArrowDownIcon,
  ArrowNextIcon,
  CloseIcon,
  PasswordLockIcon,
} from '../assets/icons';
import BackButtonHeader from '../components/BackButtonHeader';
import CustomInput from '../components/CustomInput';
import ActionButton from '../components/ActionButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addDevice } from '../slices/deviceSlice';
import { AddDeviceRequest } from '../types/device';

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

const AddDevice = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<WifiEntry>();
  const [selectedWifiPassword, setSelectedWifiPassword] = useState<string>('');
  const [deviceConnectedSuccess, setDeviceConnectedSuccess] =
    useState<boolean>(false);
  const [selectedDevicePassword, setSelectedDevicePassword] =
    useState<string>('');
  const [selectedWifi, setSelectedWifi] = useState<WifiEntry>();
  const [deviceProvisionedSuccess, setDeviceProvisionedSuccess] =
    useState<boolean>(false);
  const [provisioningData, setProvisioningData] = useState<{
    meshId?: string;
    gatewayMac?: string;
    subGatewayMac?: string;
    deviceRole?: number;
    srcMac?: string;
    dstMac?: string;
    boardType?: number;
    deviceType?: number;
    userId?: string;
  }>({});

  useEffect(() => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
      title: 'Location permission is required for WiFi connections',
      message:
        'This app needs location permission as this is required  ' +
        'to scan for wifi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    })
      .then(result => {
        console.log({ result });
        WifiManager.loadWifiList()
          .then(wifiList => {
            console.log({ wifiList });
            setWifiList(wifiList);
          })
          .catch(error => {
            console.log({ error });
          });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSetWifi = useCallback((wifiItem: WifiEntry) => {
    setSelectedDevice(wifiItem);
  }, []);

  const handleConnectWifi = useCallback(() => {
    if (!selectedDevice?.SSID) return;
    setModalVisible(true);
    setModalLoading(true);
    WifiManager.disconnect().then(() => {
      WifiManager.connectToProtectedSSID(
        selectedDevice.SSID,
        selectedDevicePassword,
        false,
        false,
      )
        .then(
          () => {
            WifiManager.getCurrentWifiSSID().then(
              ssid => {
                setModalLoading(false);
                if (ssid === selectedDevice?.SSID)
                  setDeviceConnectedSuccess(true);
              },
              () => setModalLoading(false),
            );
          },
          () => setModalLoading(false),
        )
        .catch(() => setModalLoading(false));
    });
  }, [selectedDevice, selectedDevicePassword]);

  const handleInitiateProvisioning = useCallback(
    (wifiItem: WifiEntry) => {
      setModalLoading(true);
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

      // Store provisioning data for API call
      setProvisioningData({
        meshId,
        gatewayMac,
        subGatewayMac,
        deviceRole,
        srcMac: deviceId || '00:00:00:00:00:00',
        dstMac: gatewayMac,
        boardType: 0,
        deviceType: 0,
        userId: USER_ID,
      });
      let client = TcpSocket.createConnection(
        { port: 3333, host: '192.168.10.1' },
        async () => {
          let step = 1,
            stopped = false;
          const send = (obj: any) => client.write(JSON.stringify(obj));
          send({
            payloadType: ProvisioningStep.eUserDetails_A2D_Provision,
            usrId: USER_ID,
          });
          client.on('data', function onData(data) {
            if (stopped) return;
            try {
              console.log('Received: ' + typeof data, { data });
              const response = JSON.parse(data.toString());
              if (response.status === -1) {
                stopped = true;
                client.destroy();
                setModalLoading(false);
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
                  setDeviceProvisionedSuccess(true);
                  break;
                default:
                  break;
              }
            } catch (err) {
              stopped = true;
              client.destroy();
              setModalLoading(false);
            }
          });
          client.on('error', function () {
            console.log('Socket Error');
            stopped = true;
            client.destroy();
            setModalLoading(false);
          });
          client.on('close', function () {
            console.log('Socket close');
            setModalLoading(false);
          });
        },
      );
    },
    [selectedWifiPassword],
  );

  useEffect(() => {
    const addDeviceToBackend = async () => {
      if (deviceProvisionedSuccess && provisioningData.meshId) {
        try {
          const payload: AddDeviceRequest = {
            siteId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: Get from user context or settings
            meshId: provisioningData.meshId,
            srcMac: provisioningData.srcMac || '00:00:00:00:00:00',
            dstMac: provisioningData.dstMac || provisioningData.gatewayMac || '00:00:00:00:00:00',
            gatewayMac: provisioningData.gatewayMac || '00:00:00:00:00:00',
            subGatewayMac: provisioningData.subGatewayMac || '00:00:00:00:00:00',
            boardType: provisioningData.boardType ?? 0,
            deviceType: provisioningData.deviceType ?? 0,
            deviceRole: provisioningData.deviceRole ?? 0,
            userId: provisioningData.userId || '',
          };

          await dispatch(addDevice(payload)).unwrap();

          setModalLoading(false);
          setModalVisible(false);
          Toast.show({
            type: 'success',
            text1: 'Device added successfully!',
            text2: 'Your device has been added to the network.',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            onHide: () => navigation.goBack(),
          });
        } catch (error) {
          setModalLoading(false);
          setModalVisible(false);
          Toast.show({
            type: 'error',
            text1: 'Failed to add device',
            text2: error instanceof Error ? error.message : 'Please try again.',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      }
    };

    addDeviceToBackend();
  }, [deviceProvisionedSuccess, provisioningData, dispatch, navigation]);

  const renderDeviceItem = useCallback(
    ({ item }: { item: WifiEntry }) => (
      <>
        <TouchableOpacity
          style={styles.deviceItem}
          onPress={() => handleSetWifi(item)}
        >
          <Text style={styles.deviceText}>{item.SSID}</Text>
          {item.BSSID === selectedDevice?.BSSID ? (
            <ArrowDownIcon height={14} width={14} fill={colors.greyLight} />
          ) : (
            <ArrowNextIcon height={20} width={20} fill={colors.greyLight} />
          )}
        </TouchableOpacity>
        {item.BSSID === selectedDevice?.BSSID && (
          <View>
            <CustomInput
              InputIcon={PasswordLockIcon}
              placeholder="Password"
              maxLength={30}
              value={selectedDevicePassword}
              onChangeText={setSelectedDevicePassword}
              isPassword
            />
            <Gap type="m" />
            <ActionButton
              title="Connect"
              onPress={handleConnectWifi}
              isDisable={selectedDevicePassword.length < 8}
            />
            <Gap type="m" />
          </View>
        )}
      </>
    ),
    [handleSetWifi, selectedDevice, selectedDevicePassword, handleConnectWifi],
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
            <ArrowDownIcon height={14} width={14} fill={colors.greyLight} />
          ) : (
            <ArrowNextIcon height={20} width={20} fill={colors.greyLight} />
          )}
        </TouchableOpacity>
        {selectedWifi?.BSSID === item.BSSID && (
          <View>
            <CustomInput
              InputIcon={PasswordLockIcon}
              placeholder="Password"
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
        )}
      </>
    ),
    [selectedWifi, selectedWifiPassword, handleInitiateProvisioning],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BackButtonHeader />
        <Text style={styles.headerText}>Add New Device</Text>
        <Gap type="l" />
        <Text style={styles.subText}>Select from the available devices.</Text>
        <FlatList
          data={wifiList}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.BSSID.toString()}
          contentContainerStyle={styles.flatListContent}
          renderItem={renderDeviceItem}
        />
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.closeButton}
          >
            <CloseIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          {modalLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.greyLight} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : deviceConnectedSuccess ? (
            <>
              <Text style={styles.modalHeaderText}>
                Select Wifi Network for your device.
              </Text>
              <FlatList
                data={wifiList}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.BSSID.toString()}
                contentContainerStyle={styles.flatListContent}
                renderItem={renderModalDeviceItem}
              />
            </>
          ) : null}
        </View>
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
    marginTop: 20,
  },
  deviceItem: {
    backgroundColor: colors.bgSecondary,
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceText: {
    ...textFont.regularS,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.bgBackground,
    justifyContent: 'flex-end',
    padding: 16,
    alignItems: 'flex-end',
  },
  closeButton: {
    backgroundColor: colors.greyLight,
    padding: 16,
    borderRadius: 50,
  },
  modalContent: {
    backgroundColor: colors.bgSecondary,
    height: 500,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textFont.boldL,
    color: colors.textPrimary,
    marginTop: 12,
  },
  modalHeaderText: {
    ...textFont.boldL,
    color: colors.textPrimary,
    marginBottom: 24,
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
