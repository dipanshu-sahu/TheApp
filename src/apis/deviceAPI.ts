import axios from './axios';
import { DeviceInfo, AddDeviceRequest } from '../types/device';

export const getDevicesApi = async (): Promise<DeviceInfo[]> => {
  const response = await axios.get('/api/devices');
  return response.data;
};

export const addDeviceApi = async (payload: AddDeviceRequest): Promise<DeviceInfo> => {
  const response = await axios.post('/api/devices', payload);
  return response.data;
};

export const getDeviceByIdApi = async (deviceId: string): Promise<DeviceInfo> => {
  const response = await axios.get(`/api/devices/${deviceId}`);
  return response.data;
};

