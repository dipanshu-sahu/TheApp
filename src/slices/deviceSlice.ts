import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDevicesApi, getDevicesBySiteApi, addDeviceApi, getDeviceByIdApi } from '../apis/deviceAPI';
import { ApiDevice, DeviceInfo, AddDeviceRequest } from '../types/device';
import { mapApiDeviceToDeviceInfo, mapApiDevicesResponse } from '../utils/deviceMapper';

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

export const fetchDevices = createAsyncThunk<ApiDevice[]>(
  'devices/fetchDevices',
  async () => getDevicesApi(),
);

export const fetchDevicesBySite = createAsyncThunk<ApiDevice[], string>(
  'devices/fetchDevicesBySite',
  async siteId => getDevicesBySiteApi(siteId),
);

export const addDevice = createAsyncThunk<ApiDevice, AddDeviceRequest>(
  'devices/addDevice',
  async payload => addDeviceApi(payload),
);

export const fetchDeviceById = createAsyncThunk<ApiDevice, string>(
  'devices/fetchDeviceById',
  async deviceId => getDeviceByIdApi(deviceId),
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
        state.devices = mapApiDevicesResponse(action.payload);
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch devices';
      })
      .addCase(fetchDevicesBySite.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevicesBySite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.devices = mapApiDevicesResponse(action.payload);
      })
      .addCase(fetchDevicesBySite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch devices';
      })
      .addCase(addDevice.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.devices.push(mapApiDeviceToDeviceInfo(action.payload));
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
        state.deviceDetails = mapApiDeviceToDeviceInfo(action.payload);
      })
      .addCase(fetchDeviceById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.error.message || 'Failed to fetch device details';
      });
  },
});

export default deviceSlice.reducer;

