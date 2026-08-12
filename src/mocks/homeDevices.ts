import { DeviceInfo } from '../types/device';

export const MOCK_HOME_DEVICES: DeviceInfo[] = [
  {
    id: 'mock-switch-1',
    name: '4gang wifi-ble switch-cb',
    location: 'Living Room',
    status: 'online',
  },
  {
    id: 'mock-ejs5f1p1',
    name: 'Living Room Panel',
    jacobianCode: 'eJS5F1P1',
    location: 'Living Room',
    status: 'online',
  },
  {
    id: 'mock-ejs7d1',
    name: 'Bedroom Panel',
    jacobianCode: 'eJS7D1',
    location: 'Bedroom',
    status: 'online',
  },
  {
    id: 'mock-ejp2',
    name: 'Kitchen Sockets',
    jacobianCode: 'eJP2',
    location: 'Kitchen',
    status: 'online',
  },
  {
    id: 'mock-ejc2',
    name: 'Hall Curtain',
    jacobianCode: 'eJC2',
    location: 'Hall',
    status: 'online',
  },
  {
    id: 'mock-eja16',
    name: 'Geyser Switch',
    jacobianCode: 'eJA16',
    location: 'Bathroom',
    status: 'online',
  },
  {
    id: 'mock-ejb1',
    name: 'Main Door Bell',
    jacobianCode: 'eJB1',
    location: 'Entrance',
    status: 'online',
  },
  {
    id: 'mock-switch-2',
    name: '4gang wifi-ble switch-cb 2',
    location: 'Bedroom',
    status: 'online',
  },
  {
    id: 'mock-light-1',
    name: 'Smart Bulb',
    location: 'Hall',
    status: 'online',
  },
  {
    id: 'mock-light-2',
    name: 'LED Strip Light',
    location: 'Kitchen',
    status: 'online',
  },
  {
    id: 'mock-plug-1',
    name: 'Smart Plug',
    location: 'Office',
    status: 'offline',
  },
  {
    id: 'mock-plug-2',
    name: 'Socket Outlet',
    location: 'Garage',
    status: 'online',
  },
];

export const mergeWithMockHomeDevices = (devices: DeviceInfo[]): DeviceInfo[] => {
  const existingIds = new Set(devices.map(device => device.id));
  const mocks = MOCK_HOME_DEVICES.filter(mock => !existingIds.has(mock.id));
  return [...devices, ...mocks];
};

export const getMockDeviceById = (deviceId: string): DeviceInfo | undefined =>
  MOCK_HOME_DEVICES.find(device => device.id === deviceId);
