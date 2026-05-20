import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDevicesApi, addDeviceApi, getDeviceByIdApi } from '../apis/deviceAPI';
import { DeviceInfo, AddDeviceRequest } from '../types/device';

type DeviceState = {
  devices: DeviceInfo[];
  deviceDetails: DeviceInfo | null;
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;
};

const initialState: DeviceState = {
  devices: [],
  deviceDetails: null,
  isLoading: false,
  isLoadingDetails: false,
  error: null,
};

export const fetchDevices = createAsyncThunk<DeviceInfo[]>(
  'devices/fetchDevices',
  async () => {
    try {
      const response = await getDevicesApi();
      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const addDevice = createAsyncThunk<DeviceInfo, AddDeviceRequest>(
  'devices/addDevice',
  async (payload) => {
    try {
      const response = await addDeviceApi(payload);
      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchDeviceById = createAsyncThunk<DeviceInfo, string>(
  'devices/fetchDeviceById',
  async (deviceId) => {
    try {
      const response = await getDeviceByIdApi(deviceId);
      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDevices.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.devices = action.payload || [];
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch devices';
      })
      .addCase(addDevice.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.devices.push(action.payload);
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add device';
      })
      .addCase(fetchDeviceById.pending, state => {
        state.isLoadingDetails = true;
        state.error = null;
      })
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.deviceDetails = action.payload;
      })
      .addCase(fetchDeviceById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.error.message || 'Failed to fetch device details';
      });
  },
});

export default deviceSlice.reducer;

