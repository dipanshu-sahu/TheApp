import { Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/** Fallback when location is denied or unavailable (Noida, UP) */
export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 28.5355,
  longitude: 77.391,
};

type GeolocationModule = {
  getCurrentPosition: (
    success: (position: {
      coords: { latitude: number; longitude: number };
    }) => void,
    error: () => void,
    options: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
    },
  ) => void;
};

const getGeolocationModule = (): GeolocationModule | null => {
  try {
    // Optional native module — falls back to DEFAULT_COORDINATES if missing
    return require('@react-native-community/geolocation').default;
  } catch {
    return null;
  }
};

const requestLocationPermission = async (): Promise<boolean> => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const result = await request(permission, {
    title: 'Location permission',
    message:
      'Jacobian needs your location to show local weather on the home screen.',
    buttonNegative: 'Cancel',
    buttonPositive: 'Allow',
  });

  return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
};

export const getCurrentCoordinates = async (): Promise<Coordinates> => {
  const geolocation = getGeolocationModule();
  if (!geolocation) {
    return DEFAULT_COORDINATES;
  }

  const granted = await requestLocationPermission();
  if (!granted) {
    return DEFAULT_COORDINATES;
  }

  return new Promise(resolve => {
    geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(DEFAULT_COORDINATES),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 120000,
      },
    );
  });
};

export const formatReverseGeocodeLabel = (
  results?: { name: string; admin1?: string }[],
): string | null => {
  const place = results?.[0];
  if (!place?.name) {
    return null;
  }
  return [place.name, place.admin1].filter(Boolean).join(', ');
};
