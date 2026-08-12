export type DigitalPin = {
  readonly pinNumber: number;
  readonly state: number;
};

export type PwmPin = {
  readonly pinNumber: number;
  readonly state: number;
};

/** Raw device shape returned by GET /api/devices */
export type ApiDevice = {
  readonly id: number;
  readonly siteId: string;
  readonly meshId: string;
  readonly srcMac: string;
  readonly gatewayMac: string;
  readonly subGatewayMac: string;
  readonly boardType: number;
  readonly deviceType: number;
  readonly deviceRole: number;
  readonly lastActionCause: string | null;
  readonly lastPktType: number;
  readonly lastCrc16: number | null;
  readonly lastSeen: string | null;
  readonly digitalPins: readonly DigitalPin[];
  readonly pwmPins: readonly PwmPin[];
  readonly deviceName: string;
  readonly roomHint: string | null;
};

/** deviceType value for GPIO smart-switch panels */
export const DEVICE_TYPE_SMART_SWITCH = 4 as const;

/** Normalised device representation used throughout the app */
export type DeviceInfo = {
  readonly id: string;
  readonly name: string;
  readonly location?: string;
  readonly status?: 'online' | 'offline';
  readonly siteId?: string;
  readonly deviceType?: number;
  readonly meshId?: string;
  readonly digitalPins?: readonly DigitalPin[];
  readonly pwmPins?: readonly PwmPin[];
  readonly lastSeen?: string | null;
  /** Jacobian product code (eJS5F1P1, eJC2, ...) when the backend reports one */
  readonly jacobianCode?: string;
};

export type DeviceCommandType = 'SET_PIN' | 'SET_PWM';

export type DeviceCommandRequest = {
  readonly deviceId: number;
  readonly command: DeviceCommandType;
  readonly payload: string;
  readonly siteId: string;
};

/** Shape returned by GET /api/device-digital-pins/device/{deviceId} */
export type ApiDeviceDigitalPin = {
  readonly id: number;
  readonly deviceId: number;
  readonly pinNumber: number;
  readonly state: number;
};

export type AddDeviceRequest = {
  readonly siteId: string;
  readonly meshId: string;
  readonly srcMac: string;
  readonly dstMac: string;
  readonly gatewayMac: string;
  readonly subGatewayMac: string;
  readonly boardType: number;
  readonly deviceType: number;
  readonly deviceRole: number;
  readonly userId: string;
};
