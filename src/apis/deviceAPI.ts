import axios from './axios';
import {
  ApiDevice,
  ApiDeviceDigitalPin,
  AddDeviceRequest,
  DeviceCommandRequest,
} from '../types/device';

export const getDevicesApi = async (): Promise<ApiDevice[]> => {
  const response = await axios.get('/api/devices');
  return response.data;
};

export const getDevicesBySiteApi = async (siteId: string): Promise<ApiDevice[]> => {
  const response = await axios.get<ApiDevice[]>(`/api/devices/site/${siteId}`);
  return response.data;
};

export const addDeviceApi = async (payload: AddDeviceRequest): Promise<ApiDevice> => {
  const response = await axios.post('/api/devices', payload);
  return response.data;
};

export const getDeviceByIdApi = async (deviceId: string): Promise<ApiDevice> => {
  const response = await axios.get(`/api/devices/${deviceId}`);
  return response.data;
};

export const sendDeviceCommandApi = async (
  payload: DeviceCommandRequest,
): Promise<void> => {
  await axios.post('/api/devices/command', payload);
};

export const getDeviceDigitalPinsApi = async (
  deviceId: string,
): Promise<ApiDeviceDigitalPin[]> => {
  const response = await axios.get(
    `/api/device-digital-pins/device/${deviceId}`,
  );
  return response.data;
};
