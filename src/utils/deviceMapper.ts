import {
  ApiDevice,
  ApiDeviceDigitalPin,
  DEVICE_TYPE_SMART_SWITCH,
  DeviceInfo,
  DigitalPin,
} from '../types/device';

const ONLINE_THRESHOLD_MS = 15 * 60 * 1000;

export const isDeviceRecentlySeen = (lastSeen?: string | null): boolean => {
  if (!lastSeen) {
    return false;
  }
  const seenAt = new Date(lastSeen).getTime();
  if (Number.isNaN(seenAt)) {
    return false;
  }
  return Date.now() - seenAt < ONLINE_THRESHOLD_MS;
};

export const mapApiDeviceToDeviceInfo = (api: ApiDevice): DeviceInfo => ({
  id: String(api.id),
  name: api.deviceName?.trim() || api.meshId || 'Device',
  location: api.roomHint?.trim() || undefined,
  status: isDeviceRecentlySeen(api.lastSeen) ? 'online' : 'offline',
  siteId: api.siteId,
  deviceType: api.deviceType,
  meshId: api.meshId,
  digitalPins: api.digitalPins ?? [],
  lastSeen: api.lastSeen,
});

export const mapApiDigitalPinsToDevicePins = (
  pins: ApiDeviceDigitalPin[],
): DigitalPin[] =>
  getSortedDigitalPins(
    pins.map(pin => ({ pinNumber: pin.pinNumber, state: pin.state })),
  );

export const mapApiDevicesResponse = (data: unknown): DeviceInfo[] => {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(item => mapApiDeviceToDeviceInfo(item as ApiDevice));
};

export const isSmartSwitchDevice = (device: DeviceInfo): boolean =>
  device.deviceType === DEVICE_TYPE_SMART_SWITCH ||
  (device.digitalPins?.length ?? 0) > 0;

export const getSortedDigitalPins = (pins?: DigitalPin[]): DigitalPin[] =>
  [...(pins ?? [])].sort((a, b) => a.pinNumber - b.pinNumber);

export const getSwitchGangCountFromDevice = (device: DeviceInfo): number => {
  const pinCount = device.digitalPins?.length ?? 0;
  if (pinCount > 0) {
    return pinCount;
  }
  const match = device.name?.match?.(/(\d)\s*gang/i);
  if (match) {
    const count = Number.parseInt(match[1], 10);
    if (count >= 1 && count <= 4) {
      return count;
    }
  }
  return 4;
};

export const getSwitchGangStatesFromDevice = (device: DeviceInfo): boolean[] => {
  const pins = getSortedDigitalPins(device.digitalPins);
  if (pins.length > 0) {
    return pins.map(pin => pin.state === 1);
  }
  const gangCount = getSwitchGangCountFromDevice(device);
  const deviceOn = device.status === 'online';
  return Array.from({ length: gangCount }, () => deviceOn);
};

export const filterSmartSwitchDevices = (devices: DeviceInfo[]): DeviceInfo[] =>
  devices.filter(isSmartSwitchDevice);
