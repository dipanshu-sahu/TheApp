export type DigitalPin = {
  pinNumber: number;
  state: number;
};

export type PwmPin = {
  pinNumber: number;
  state: number;
};

/** Raw device object from GET /api/devices */
export type ApiDevice = {
  id: number;
  siteId: string;
  meshId: string;
  srcMac: string;
  gatewayMac: string;
  subGatewayMac: string;
  boardType: number;
  deviceType: number;
  deviceRole: number;
  lastActionCause: string | null;
  lastPktType: number;
  lastCrc16: number | null;
  lastSeen: string | null;
  digitalPins: DigitalPin[];
  pwmPins: PwmPin[];
  deviceName: string;
  roomHint: string | null;
};

/** GPIO switch controller from API (deviceType = 4) */
export const DEVICE_TYPE_SMART_SWITCH = 4;

export type DeviceInfo = {
  id: string;
  name: string;
  location?: string;
  status?: 'online' | 'offline';
  siteId?: string;
  deviceType?: number;
  meshId?: string;
  digitalPins?: DigitalPin[];
  lastSeen?: string | null;
};

export type DeviceCommandType = 'SET_PIN' | 'SET_PWM';

export type DeviceCommandRequest = {
  deviceId: number;
  command: DeviceCommandType;
  payload: string;
  siteId: string;
};

/** GET /api/device-digital-pins/device/{deviceId} */
export type ApiDeviceDigitalPin = {
  id: number;
  deviceId: number;
  pinNumber: number;
  state: number;
};

export type AddDeviceRequest = {
  siteId: string;
  meshId: string;
  srcMac: string;
  dstMac: string;
  gatewayMac: string;
  subGatewayMac: string;
  boardType: number;
  deviceType: number;
  deviceRole: number;
  userId: string;
};
