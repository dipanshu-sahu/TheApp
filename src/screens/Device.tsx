import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { textFont } from '../utils/textFont';
import { PowerButtonIcon } from '../assets/icons';
import BackButtonHeader from '../components/BackButtonHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDeviceById } from '../slices/deviceSlice';

const Device: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { deviceDetails, isLoadingDetails, error } = useSelector(
    (state: RootState) => state.devices,
  );

  const deviceId = (route.params as { deviceId?: string })?.deviceId;

  useEffect(() => {
    if (deviceId) {
      dispatch(fetchDeviceById(deviceId));
    }
  }, [deviceId, dispatch]);

  if (isLoadingDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButtonHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !deviceDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButtonHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...textFont.regularM, color: colors.error }}>
            {error || 'Device not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButtonHeader />
      <View style={{ flex: 1 }}>
        <View>
          <Text style={{ ...textFont.boldXXL, color: colors.textPrimary }}>
            {deviceDetails.name || 'Device'}
          </Text>
          <Text
            style={{
              ...textFont.regularS,
              color: colors.textSecondary,
              marginTop: 4,
            }}
          >
            {deviceDetails.location || 'No location specified'}
          </Text>
        </View>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.bgSecondary,
            marginTop: 16,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
          }}
        >
          <Text style={{ ...textFont.boldL, color: colors.textPrimary }}>
            Status: {deviceDetails.status || 'Unknown'}
          </Text>
          <TouchableOpacity>
            <PowerButtonIcon
              width={50}
              height={50}
              stroke={deviceDetails.status === 'Online' ? colors.success : colors.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Device;
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: 20,
  },
});
