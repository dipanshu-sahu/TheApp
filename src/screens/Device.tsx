import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import { colors } from '../themes/colors';
import { AppDispatch, RootState } from '../store/store';
import { fetchDeviceById } from '../slices/deviceSlice';
import { getDeviceHomeSection } from '../utils/deviceDisplay';
import { getMockDeviceById } from '../mocks/homeDevices';
import SwitchDeviceDetail from '../components/device/SwitchDeviceDetail';
import LightDeviceDetail from '../components/device/LightDeviceDetail';
import PlugDeviceDetail from '../components/device/PlugDeviceDetail';
import { MyHomeStackParamList } from '../navigation';

const Device: React.FC = () => {
  const route = useRoute<RouteProp<MyHomeStackParamList, 'Device'>>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { deviceDetails, isLoadingDetails, error } = useSelector(
    (state: RootState) => state.devices,
  );

  const { deviceId } = route.params;
  const mockDevice = getMockDeviceById(deviceId);

  useEffect(() => {
    if (!mockDevice) {
      dispatch(fetchDeviceById(deviceId));
    }
  }, [deviceId, mockDevice, dispatch]);

  const device = mockDevice ?? deviceDetails;
  const isLoading = !mockDevice && isLoadingDetails;
  const deviceType = useMemo(
    () => (device ? getDeviceHomeSection(device) : 'light'),
    [device],
  );

  const handleClose = (): void => navigation.goBack();

  if (isLoading) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!device) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <AppText variant="bodyLg" color={colors.error}>
            {error ?? 'Device not found'}
          </AppText>
        </View>
      </Screen>
    );
  }

  const renderDetail = (): React.ReactNode => {
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
    <Screen edges={['top', 'bottom']} ambientTint={colors.primary}>
      {renderDetail()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Device;
