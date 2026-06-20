import { sendDeviceCommandApi } from '../apis/deviceAPI';
import { DeviceCommandType, DeviceInfo } from '../types/device';
import { getSortedDigitalPins } from './deviceMapper';

/** pinNumber=state (1=ON, 0=OFF) */
export const buildSetPinPayload = (pinNumber: number, on: boolean): string =>
  `${pinNumber}=${on ? 1 : 0}`;

/** pinNumber=value (0–100 for PWM) */
export const buildSetPwmPayload = (pinNumber: number, value: number): string =>
  `${pinNumber}=${value}`;

export const getPinNumberAtGangIndex = (
  device: DeviceInfo,
  gangIndex: number,
): number | undefined => {
  const pins = getSortedDigitalPins(device.digitalPins);
  return pins[gangIndex]?.pinNumber;
};

export const sendDevicePinCommand = async (
  device: DeviceInfo,
  pinNumber: number,
  on: boolean,
): Promise<void> => {
  if (!device.siteId) {
    throw new Error('Device siteId is missing');
  }

  await sendDeviceCommandApi({
    deviceId: Number(device.id),
    command: 'SET_PIN',
    payload: buildSetPinPayload(pinNumber, on),
    siteId: device.siteId,
  });
};

export const sendDeviceCommand = async (
  device: DeviceInfo,
  command: DeviceCommandType,
  payload: string,
): Promise<void> => {
  if (!device.siteId) {
    throw new Error('Device siteId is missing');
  }

  await sendDeviceCommandApi({
    deviceId: Number(device.id),
    command,
    payload,
    siteId: device.siteId,
  });
};
