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
import { AddCircleIcon } from '../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../slices/userSlice';
import { AppDispatch, RootState } from '../store/store';
import { fetchDevices } from '../slices/deviceSlice';
import DeviceCard from '../components/DeviceCard';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading } = useSelector((state: RootState) => state.user);
  const {
    devices,
    isLoading: devicesLoading,
    error: devicesError,
  } = useSelector((state: RootState) => state.devices);
  const currentUser = users?.[0];

  useEffect(() => {
    if (!users?.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users?.length]);

  useEffect(() => {
    if (!devices?.length) {
      dispatch(fetchDevices());
    }
  }, [dispatch, devices?.length]);

  const welcomeText = currentUser
    ? `Welcome ${currentUser.firstName}!`
    : 'Welcome Friend!';

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...textFont.boldXXXL, color: colors.textPrimary }}>
            {welcomeText}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddDevice' as never)}>
            <AddCircleIcon width={30} height={30} stroke={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View>
          {isLoading ? (
            <View style={{ marginTop: 8 }}>
              <ActivityIndicator color={colors.secondary} />
            </View>
          ) : null}
          <Text
            style={{
              ...textFont.boldL,
              color: colors.textPrimary,
              marginTop: 24,
            }}
          >
            All Devices
          </Text>
          {devicesLoading ? (
            <View style={{ marginTop: 12 }}>
              <ActivityIndicator color={colors.secondary} />
            </View>
          ) : null}
          {devicesError ? (
            <Text
              style={{ ...textFont.regularS, color: colors.error, marginTop: 8 }}
            >
              {devicesError}
            </Text>
          ) : null}
          {devices?.length
            ? devices.map(device => (
                <DeviceCard
                  key={device.id}
                  name={device.name}
                  location={device.location}
                  status={device.status}
                  onPress={() => navigation.navigate('Device' as never, { deviceId: device.id } as never)}
                />
              ))
            : !devicesLoading && (
                <Text
                  style={{
                    ...textFont.regularS,
                    color: colors.textSecondary,
                    marginTop: 12,
                  }}
                >
                  No devices found. Tap the + icon to add one.
                </Text>
              )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    padding: 20,
  },
});

export default Home;
