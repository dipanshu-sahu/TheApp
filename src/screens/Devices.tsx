import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../themes/colors';
import { textFont } from '../utils/textFont';
import { AppDispatch, RootState } from '../store/store';
import { fetchDevices } from '../slices/deviceSlice';
import HomeDeviceCard from '../components/home/HomeDeviceCard';
import {
  getDeviceIcon,
  getDeviceStatusLabel,
  isDeviceOnline,
} from '../utils/deviceDisplay';
import { DeviceInfo } from '../types/device';

type HomeStackParamList = {
  Device: { deviceId: string };
};

const Devices: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    devices,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.devices);

  const [toggleState, setToggleState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (devices?.length) {
      setToggleState(prev => {
        const next = { ...prev };
        devices.forEach((device, index) => {
          if (next[device.id] === undefined) {
            next[device.id] = isDeviceOnline(device) || index % 2 === 0;
          }
        });
        return next;
      });
    }
  }, [devices]);

  const devicePairs = useMemo(() => {
    const list = devices ?? [];
    const pairs: DeviceInfo[][] = [];
    for (let i = 0; i < list.length; i += 2) {
      pairs.push(list.slice(i, i + 2));
    }
    return pairs;
  }, [devices]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Devices</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {devicePairs.map(pair => (
          <View key={pair.map(d => d.id).join('-')} style={styles.row}>
            {pair.map((device, colIndex) => {
              const isOn =
                toggleState[device.id] ?? isDeviceOnline(device);
              return (
                <View key={device.id} style={styles.col}>
                  <HomeDeviceCard
                    name={device.name}
                    statusLabel={getDeviceStatusLabel(device, colIndex)}
                    icon={getDeviceIcon(device.name)}
                    isOn={isOn}
                    onToggle={value =>
                      setToggleState(prev => ({ ...prev, [device.id]: value }))
                    }
                    onPress={() =>
                      navigation.navigate('Device', { deviceId: device.id })
                    }
                  />
                </View>
              );
            })}
            {pair.length === 1 ? <View style={styles.col} /> : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.homeBg },
  scrollContent: { padding: 20, paddingBottom: 120 },
  title: { ...textFont.boldXXL, color: colors.textPrimary, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  col: { flex: 1 },
  loader: { marginVertical: 24 },
  error: { ...textFont.regularS, color: colors.error },
});

export default Devices;
