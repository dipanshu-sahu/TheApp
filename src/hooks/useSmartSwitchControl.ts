import { useCallback, useEffect, useMemo, useState } from 'react';
import { Toast } from 'toastify-react-native';

import { getDeviceDigitalPinsApi } from '../apis/deviceAPI';
import { DeviceInfo, DigitalPin } from '../types/device';
import { sendDevicePinCommand } from '../utils/deviceCommand';
import {
  getSortedDigitalPins,
  getSwitchGangStatesFromDevice,
  mapApiDigitalPinsToDevicePins,
} from '../utils/deviceMapper';

type UseSmartSwitchControlOptions = {
  /** Fetch live pin state from /api/device-digital-pins on mount */
  refreshOnMount?: boolean;
};

export const useSmartSwitchControl = (
  device: DeviceInfo,
  options?: UseSmartSwitchControlOptions,
) => {
  const [digitalPins, setDigitalPins] = useState<DigitalPin[]>(
    device.digitalPins ?? [],
  );
  const [gangStates, setGangStates] = useState<boolean[]>(() =>
    getSwitchGangStatesFromDevice(device),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sortedPins = useMemo(
    () => getSortedDigitalPins(digitalPins),
    [digitalPins],
  );

  const deviceWithPins = useMemo(
    () => ({ ...device, digitalPins: sortedPins }),
    [device, sortedPins],
  );

  const refreshPins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDeviceDigitalPinsApi(device.id);
      const mapped = mapApiDigitalPinsToDevicePins(response);
      setDigitalPins(mapped);
      setGangStates(mapped.map(pin => pin.state === 1));
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to load switch state',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [device.id]);

  useEffect(() => {
    if (options?.refreshOnMount) {
      refreshPins();
    }
  }, [options?.refreshOnMount, refreshPins]);

  useEffect(() => {
    if (!options?.refreshOnMount && device.digitalPins?.length) {
      setDigitalPins(device.digitalPins);
      setGangStates(getSwitchGangStatesFromDevice(device));
    }
  }, [device, options?.refreshOnMount]);

  const sendPin = useCallback(
    async (pinNumber: number, on: boolean) => {
      console.log('sendPin', pinNumber, on);
      await sendDevicePinCommand(deviceWithPins, pinNumber, on);
    },
    [deviceWithPins],
  );

  const setGangAtIndex = useCallback(
    async (gangIndex: number, on: boolean) => {
      const pin = sortedPins[gangIndex];
      if (!pin) {
        return;
      }

      const previousStates = [...gangStates];
      const nextStates = [...gangStates];
      nextStates[gangIndex] = on;
      setGangStates(nextStates);
      setIsSending(true);

      try {
        await sendPin(pin.pinNumber, on);
        setDigitalPins(current =>
          current.map(item =>
            item.pinNumber === pin.pinNumber
              ? { ...item, state: on ? 1 : 0 }
              : item,
          ),
        );
      } catch {
        setGangStates(previousStates);
        Toast.show({
          type: 'error',
          text1: 'Failed to update switch',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
        });
      } finally {
        setIsSending(false);
      }
    },
    [gangStates, sortedPins, sendPin],
  );

  const setAllGangs = useCallback(
    async (on: boolean) => {
      if (!sortedPins.length) {
        return;
      }

      const previousStates = [...gangStates];
      setGangStates(sortedPins.map(() => on));
      setIsSending(true);

      try {
        await Promise.all(
          sortedPins.map(pin => sendPin(pin.pinNumber, on)),
        );
        setDigitalPins(current =>
          current.map(item => ({ ...item, state: on ? 1 : 0 })),
        );
      } catch {
        setGangStates(previousStates);
        Toast.show({
          type: 'error',
          text1: 'Failed to update switches',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
        });
      } finally {
        setIsSending(false);
      }
    },
    [gangStates, sortedPins, sendPin],
  );

  const mainOn = gangStates.some(Boolean);

  const setMainToggle = useCallback(
    (on: boolean) => setAllGangs(on),
    [setAllGangs],
  );

  return {
    gangStates,
    sortedPins,
    mainOn,
    isLoading,
    isSending,
    refreshPins,
    setGangAtIndex,
    setAllGangs,
    setMainToggle,
  };
};
