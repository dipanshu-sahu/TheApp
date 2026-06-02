import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { textFont } from '../utils/textFont';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDeviceById } from '../slices/deviceSlice';
import { getDeviceHomeSection } from '../utils/deviceDisplay';
import { getMockDeviceById } from '../mocks/homeDevices';
import SwitchDeviceDetail from '../components/device/SwitchDeviceDetail';
import LightDeviceDetail from '../components/device/LightDeviceDetail';
import PlugDeviceDetail from '../components/device/PlugDeviceDetail';

const Device: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { deviceDetails, isLoadingDetails, error } = useSelector(
    (state: RootState) => state.devices,
  );

  const deviceId = (route.params as { deviceId?: string })?.deviceId;
  const mockDevice = deviceId ? getMockDeviceById(deviceId) : undefined;

  useEffect(() => {
    if (deviceId && !mockDevice) {
      dispatch(fetchDeviceById(deviceId));
    }
  }, [deviceId, mockDevice, dispatch]);

  const device = mockDevice ?? deviceDetails;
  const isLoading = !mockDevice && isLoadingDetails;
  const deviceType = useMemo(
    () => (device ? getDeviceHomeSection(device) : 'light'),
    [device],
  );

  const handleClose = () => navigation.goBack();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Device not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderDetail = () => {
    switch (deviceType) {
      case 'switch':
        return <SwitchDeviceDetail device={device} onClose={handleClose} />;
      case 'plug':
        return <PlugDeviceDetail device={device} onClose={handleClose} />;
      case 'light':
      default:
        return <LightDeviceDetail device={device} onClose={handleClose} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {renderDetail()}
    </SafeAreaView>
  );
};

export default Device;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...textFont.regularM,
    color: colors.error,
  },
});
