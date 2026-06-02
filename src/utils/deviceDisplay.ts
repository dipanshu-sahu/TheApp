import { IconName } from '../components/Icon';
import { DeviceInfo } from '../types/device';
import { colors } from '../themes/colors';

export type DeviceCategory = 'lighting' | 'climate' | 'security' | 'plugs';

export type HomeDeviceSection = 'switch' | 'light' | 'plug';

export const HOME_DEVICE_SECTIONS: {
  id: HomeDeviceSection;
  title: string;
}[] = [
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

export const DEVICE_CATEGORIES: {
  id: DeviceCategory;
  label: string;
  icon: IconName;
  tint: string;
}[] = [
    { id: 'lighting', label: 'Lighting', icon: 'intro-lightbulb', tint: '#F59E0B' },
    { id: 'climate', label: 'Climate', icon: 'intro-ac', tint: '#38BDF8' },
    { id: 'security', label: 'Security', icon: 'intro-camera', tint: '#A78BFA' },
    { id: 'plugs', label: 'Plugs', icon: 'plug', tint: '#34D399' },
  ];

export const getDeviceIcon = (name: string): IconName => {
  const lower = name?.toLowerCase();
  if (!!lower) {
    if (lower.includes('switch') || lower.includes('gang')) {
      return 'power-button';
    }
    if (lower.includes('cam') || lower.includes('security')) {
      return 'intro-camera';
    }
    if (lower.includes('ac') || lower.includes('climate') || lower.includes('fan')) {
      return 'intro-ac';
    }
    if (lower.includes('plug') || lower.includes('outlet')) {
      return 'plug';
    }
    if (lower.includes('led') || lower.includes('light') || lower.includes('lamp')) {
      return 'intro-lightbulb';
    }
  }
  return 'intro-lightbulb';
};

export const getDeviceHomeSection = (device: DeviceInfo): HomeDeviceSection => {
  const lower = device?.name?.toLowerCase?.() || '';
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
  const match = name?.match?.(/(\d)\s*gang/i);
  if (match) {
    const count = Number.parseInt(match[1], 10);
    if (count >= 1 && count <= 4) {
      return count;
    }
  }
  return 4;
};

export const groupDevicesByHomeSection = (
  devices: DeviceInfo[],
): Record<HomeDeviceSection, DeviceInfo[]> => {
  const grouped: Record<HomeDeviceSection, DeviceInfo[]> = {
    switch: [],
    light: [],
    plug: [],
  };
  devices?.forEach?.(device => {
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
    const levels = ['40%', '65%', '80%'];
    return `On · ${levels[index % levels.length]}`;
  }
  if (lower.includes('cam')) {
    return 'On · Recording';
  }
  return 'On';
};

export const isDeviceOnline = (device: DeviceInfo) =>
  device.status?.toLowerCase() === 'online';
