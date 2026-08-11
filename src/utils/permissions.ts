import { Platform } from 'react-native';
import {
  PERMISSIONS,
  Permission,
  RESULTS,
  check,
  request,
  requestMultiple,
} from 'react-native-permissions';

/**
 * Request runtime permissions needed for Wi‑Fi scanning, provisioning,
 * and weather at app launch so later flows do not re-prompt.
 */
export async function requestStartupPermissions(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      const permissions: Permission[] = [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ];

      // Android 13+ nearby Wi‑Fi devices (when declared / available)
      const nearby = (PERMISSIONS.ANDROID as Record<string, Permission | undefined>)
        .NEARBY_WIFI_DEVICES;
      if (nearby) {
        permissions.push(nearby);
      }

      await requestMultiple(permissions);
      return;
    }

    if (Platform.OS === 'ios') {
      await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, {
        title: 'Location Access',
        message:
          'Jacobian needs location to show local weather and discover nearby devices over Wi‑Fi.',
        buttonPositive: 'Allow',
        buttonNegative: 'Not Now',
      });
    }
  } catch {
    // Permission APIs can throw on unsupported platforms / simulators — continue boot.
  }
}

/** True when fine/when-in-use location is already granted. */
export async function hasLocationPermission(): Promise<boolean> {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const status = await check(permission);
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  } catch {
    return false;
  }
}
