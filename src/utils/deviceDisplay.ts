import { IconName } from '../types/icons';
import { DEVICE_TYPE_SMART_SWITCH, DeviceInfo } from '../types/device';
import { colors } from '../themes/colors';
import { ChannelKind, resolveDeviceProfile } from './jacobianCode';

export type DeviceCategory = 'lighting' | 'climate' | 'security' | 'plugs';

export type HomeDeviceSection = 'switch' | 'light' | 'plug';

export const HOME_DEVICE_SECTIONS: ReadonlyArray<{
  readonly id: HomeDeviceSection;
  readonly title: string;
}> = [
  { id: 'switch', title: 'Smart Switch' },
  { id: 'light', title: 'Light' },
  { id: 'plug', title: 'Plug' },
];

export const SWITCH_GANG_COLORS = [
  colors.primary,
  colors.success,
  colors.warning,
  colors.passwordLock,
] as const;

export const DEVICE_CATEGORIES: ReadonlyArray<{
  readonly id: DeviceCategory;
  readonly label: string;
  readonly icon: IconName;
  readonly tint: string;
}> = [
  { id: 'lighting', label: 'Lighting', icon: 'bulb',       tint: '#F59E0B' },
  { id: 'climate',  label: 'Climate',  icon: 'thermostat', tint: '#38BDF8' },
  { id: 'security', label: 'Security', icon: 'camera',     tint: '#A78BFA' },
  { id: 'plugs',    label: 'Plugs',    icon: 'plug',       tint: '#34D399' },
];

export const getDeviceIcon = (name: string): IconName => {
  const lower = name?.toLowerCase() ?? '';
  if (lower) {
    if (lower.includes('switch') || lower.includes('gang') || lower.includes('gpio')) {
      return 'switch';
    }
    if (lower.includes('cam') || lower.includes('security')) {
      return 'camera';
    }
    if (lower.includes('fan')) {
      return 'fan';
    }
    if (lower.includes('ac') || lower.includes('climate') || lower.includes('thermostat')) {
      return 'thermostat';
    }
    if (lower.includes('plug') || lower.includes('outlet') || lower.includes('socket')) {
      return 'plug';
    }
    if (lower.includes('mesh')) {
      return 'mesh';
    }
    if (lower.includes('led') || lower.includes('light') || lower.includes('lamp') || lower.includes('bulb')) {
      return 'bulb';
    }
  }
  return 'bulb';
};

const ICON_BY_CHANNEL_KIND: Readonly<Record<ChannelKind, IconName>> = {
  switch: 'switch',
  fan: 'fan',
  plug: 'plug',
  dimmer: 'dimmer',
  curtain: 'curtain',
  doorbell: 'bell',
};

/**
 * Icon for a device, driven by its decoded product code when available so a
 * curtain controller or doorbell never shows up as a generic switch.
 */
export const getDeviceIconForDevice = (device: DeviceInfo): IconName => {
  const { channels } = resolveDeviceProfile(device);
  if (channels.length) {
    const kinds = new Set(channels.map(channel => channel.kind));
    if (kinds.size === 1) {
      return ICON_BY_CHANNEL_KIND[channels[0].kind];
    }
    return 'switch';
  }
  return getDeviceIcon(device.name);
};

export const getDeviceTint = (icon: IconName): string => {
  switch (icon) {
    case 'bulb':
    case 'dimmer':
      return colors.cta;
    case 'thermostat':
    case 'fan':
      return '#38BDF8';
    case 'camera':
      return '#A78BFA';
    case 'curtain':
      return colors.gradPrimaryEnd;
    case 'bell':
      return colors.passwordLock;
    case 'plug':
    case 'socket':
      return colors.secondary;
    case 'mesh':
      return colors.primary;
    case 'switch':
    default:
      return colors.primary;
  }
};

export const getDeviceHomeSection = (device: DeviceInfo): HomeDeviceSection => {
  const profile = resolveDeviceProfile(device);
  if (profile.channels.length) {
    const kinds = new Set(profile.channels.map(channel => channel.kind));
    return kinds.size === 1 && kinds.has('plug') ? 'plug' : 'switch';
  }

  if (
    device.deviceType === DEVICE_TYPE_SMART_SWITCH ||
    (device.digitalPins?.length ?? 0) > 0
  ) {
    return 'switch';
  }
  const lower = device?.name?.toLowerCase() ?? '';
  if (lower.includes('switch') || lower.includes('gang')) {
    return 'switch';
  }
  if (
    lower.includes('plug') ||
    lower.includes('outlet') ||
    lower.includes('socket')
  ) {
    return 'plug';
  }
  return 'light';
};

export const getSwitchGangCount = (name: string): number => {
  const match = name?.match(/(\d)\s*gang/i);
  if (match) {
    const count = Number.parseInt(match[1], 10);
    if (count >= 1 && count <= 4) {
      return count;
    }
  }
  return 4;
};

export const groupDevicesByHomeSection = (
  devices: readonly DeviceInfo[],
): Record<HomeDeviceSection, DeviceInfo[]> => {
  const grouped: Record<HomeDeviceSection, DeviceInfo[]> = {
    switch: [],
    light: [],
    plug: [],
  };
  devices?.forEach(device => {
    grouped[getDeviceHomeSection(device)].push(device);
  });
  return grouped;
};

export const getDeviceStatusLabel = (device: DeviceInfo, index: number): string => {
  const isOn = device?.status?.toLowerCase() === 'online';
  if (!isOn) {
    return 'Off';
  }

  const lower = device.name.toLowerCase();
  if (lower.includes('ac') || lower.includes('climate')) {
    return 'On · 24°C';
  }
  if (lower.includes('led') || lower.includes('light')) {
    const levels = ['40%', '65%', '80%'] as const;
    return `On · ${levels[index % levels.length]}`;
  }
  if (lower.includes('cam')) {
    return 'On · Recording';
  }
  return 'On';
};

export const isDeviceOnline = (device: DeviceInfo): boolean =>
  device.status === 'online';
