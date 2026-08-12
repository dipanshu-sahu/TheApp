import { useCallback, useEffect, useMemo, useState } from 'react';
import { Toast } from 'toastify-react-native';

import { getDeviceDigitalPinsApi } from '../apis/deviceAPI';
import { DeviceInfo, DigitalPin, PwmPin } from '../types/device';
import {
  buildSetPwmPayload,
  sendDeviceCommand,
  sendDevicePinCommand,
} from '../utils/deviceCommand';
import {
  getSortedDigitalPins,
  mapApiDigitalPinsToDevicePins,
} from '../utils/deviceMapper';
import {
  ChannelKind,
  DeviceChannel,
  JacobianProfile,
  isRangeChannel,
  resolveDeviceProfile,
} from '../utils/jacobianCode';

export type CurtainAction = 'open' | 'stop' | 'close';

/** PWM step per press of +/- for each range channel kind. */
const LEVEL_STEP: Readonly<Record<'fan' | 'dimmer', number>> = {
  fan: 20,
  dimmer: 10,
};

export const FAN_SPEED_COUNT = 100 / LEVEL_STEP.fan;

export type ChannelState = {
  readonly on: boolean;
  /** 0-100 PWM value for fan/dimmer channels */
  readonly level: number;
  readonly curtain: CurtainAction | null;
};

export type ChannelView = ChannelState & {
  readonly channel: DeviceChannel;
  readonly step: number;
  /** Fan speed 0-5 derived from the PWM level */
  readonly speed: number;
  readonly isControllable: boolean;
};

type ChannelPins = {
  readonly channelId: string;
  readonly pinNumber?: number;
  /** Second relay of a curtain controller (close direction) */
  readonly closePinNumber?: number;
  readonly pwmPinNumber?: number;
  readonly initialOn: boolean;
  readonly initialLevel: number;
};

const showError = (text1: string): void => {
  Toast.show({
    type: 'error',
    text1,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
  });
};

const clampLevel = (value: number): number => Math.max(0, Math.min(100, value));

const stepFor = (kind: ChannelKind): number =>
  kind === 'fan' ? LEVEL_STEP.fan : LEVEL_STEP.dimmer;

const sortPwmPins = (pins?: readonly PwmPin[]): PwmPin[] =>
  [...(pins ?? [])].sort((a, b) => a.pinNumber - b.pinNumber);

/**
 * Drives every control a Jacobian panel exposes.
 *
 * Digital pins are handed out in code order to the on/off channels (switch,
 * plug, doorbell, and two per curtain motor); PWM pins go to the range
 * channels (fan, dimmer). Devices without pins — mocks and freshly added
 * panels — stay locally interactive instead of erroring out.
 */
export const useJacobianDevice = (device: DeviceInfo) => {
  const profile: JacobianProfile = useMemo(
    () => resolveDeviceProfile(device),
    [device],
  );

  const [digitalPins, setDigitalPins] = useState<DigitalPin[]>(() =>
    getSortedDigitalPins(device.digitalPins),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const pinMap = useMemo<ChannelPins[]>(() => {
    const digital = getSortedDigitalPins(digitalPins);
    const pwm = sortPwmPins(device.pwmPins);
    let digitalCursor = 0;
    let pwmCursor = 0;

    return profile.channels.map(channel => {
      if (isRangeChannel(channel.kind)) {
        const pin = pwm[pwmCursor];
        pwmCursor += 1;
        const level = clampLevel(pin?.state ?? 0);
        return {
          channelId: channel.id,
          pwmPinNumber: pin?.pinNumber,
          initialOn: level > 0,
          initialLevel: level,
        };
      }

      if (channel.kind === 'curtain') {
        const openPin = digital[digitalCursor];
        const closePin = digital[digitalCursor + 1];
        digitalCursor += 2;
        return {
          channelId: channel.id,
          pinNumber: openPin?.pinNumber,
          closePinNumber: closePin?.pinNumber,
          initialOn: openPin?.state === 1 || closePin?.state === 1,
          initialLevel: 0,
        };
      }

      const pin = digital[digitalCursor];
      digitalCursor += 1;
      return {
        channelId: channel.id,
        pinNumber: pin?.pinNumber,
        initialOn: pin?.state === 1,
        initialLevel: 0,
      };
    });
  }, [profile.channels, digitalPins, device.pwmPins]);

  const [states, setStates] = useState<Record<string, ChannelState>>(() =>
    Object.fromEntries(
      pinMap.map(pins => [
        pins.channelId,
        { on: pins.initialOn, level: pins.initialLevel, curtain: null },
      ]),
    ),
  );

  useEffect(() => {
    setStates(current =>
      Object.fromEntries(
        pinMap.map(pins => [
          pins.channelId,
          {
            on: pins.initialOn,
            level: pins.initialLevel,
            curtain: current[pins.channelId]?.curtain ?? null,
          },
        ]),
      ),
    );
  }, [pinMap]);

  const refresh = useCallback(async () => {
    if (!device.siteId) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await getDeviceDigitalPinsApi(device.id);
      setDigitalPins(mapApiDigitalPinsToDevicePins(response));
    } catch {
      showError('Failed to load device state');
    } finally {
      setIsLoading(false);
    }
  }, [device.id, device.siteId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pinsFor = useCallback(
    (channelId: string) => pinMap.find(pins => pins.channelId === channelId),
    [pinMap],
  );

  const patchState = useCallback(
    (channelId: string, patch: Partial<ChannelState>) => {
      setStates(current => ({
        ...current,
        [channelId]: { ...current[channelId], ...patch },
      }));
    },
    [],
  );

  const commitDigital = useCallback((pinNumber: number, on: boolean) => {
    setDigitalPins(current =>
      current.map(pin =>
        pin.pinNumber === pinNumber ? { ...pin, state: on ? 1 : 0 } : pin,
      ),
    );
  }, []);

  const setChannelOn = useCallback(
    async (channelId: string, on: boolean) => {
      const pins = pinsFor(channelId);
      if (!pins) {
        return;
      }

      const previous = states[channelId];
      patchState(channelId, { on });

      if (pins.pinNumber == null || !device.siteId) {
        return;
      }

      setIsSending(true);
      try {
        await sendDevicePinCommand(device, pins.pinNumber, on);
        commitDigital(pins.pinNumber, on);
      } catch {
        patchState(channelId, previous);
        showError('Failed to update device');
      } finally {
        setIsSending(false);
      }
    },
    [commitDigital, device, patchState, pinsFor, states],
  );

  const toggleChannel = useCallback(
    (channelId: string) => setChannelOn(channelId, !states[channelId]?.on),
    [setChannelOn, states],
  );

  const setChannelLevel = useCallback(
    async (channelId: string, level: number) => {
      const pins = pinsFor(channelId);
      if (!pins) {
        return;
      }

      const next = clampLevel(level);
      const previous = states[channelId];
      if (previous?.level === next) {
        return;
      }
      patchState(channelId, { level: next, on: next > 0 });

      if (pins.pwmPinNumber == null || !device.siteId) {
        return;
      }

      setIsSending(true);
      try {
        await sendDeviceCommand(
          device,
          'SET_PWM',
          buildSetPwmPayload(pins.pwmPinNumber, next),
        );
      } catch {
        patchState(channelId, previous);
        showError('Failed to update level');
      } finally {
        setIsSending(false);
      }
    },
    [device, patchState, pinsFor, states],
  );

  const stepChannelLevel = useCallback(
    (channel: DeviceChannel, direction: 1 | -1) => {
      const current = states[channel.id]?.level ?? 0;
      return setChannelLevel(
        channel.id,
        current + direction * stepFor(channel.kind),
      );
    },
    [setChannelLevel, states],
  );

  const setCurtain = useCallback(
    async (channelId: string, action: CurtainAction) => {
      const pins = pinsFor(channelId);
      if (!pins) {
        return;
      }

      const previous = states[channelId];
      patchState(channelId, { curtain: action, on: action !== 'stop' });

      if (!device.siteId) {
        return;
      }

      const openOn = action === 'open';
      const closeOn = action === 'close';

      setIsSending(true);
      try {
        if (pins.pinNumber != null) {
          await sendDevicePinCommand(device, pins.pinNumber, openOn);
          commitDigital(pins.pinNumber, openOn);
        }
        if (pins.closePinNumber != null) {
          await sendDevicePinCommand(device, pins.closePinNumber, closeOn);
          commitDigital(pins.closePinNumber, closeOn);
        }
      } catch {
        patchState(channelId, previous);
        showError('Failed to move curtain');
      } finally {
        setIsSending(false);
      }
    },
    [commitDigital, device, patchState, pinsFor, states],
  );

  const setAll = useCallback(
    async (on: boolean) => {
      const targets = profile.channels.filter(
        channel => channel.kind !== 'curtain' && channel.kind !== 'doorbell',
      );
      if (!targets.length) {
        return;
      }

      const previous = states;
      setStates(current => {
        const next = { ...current };
        targets.forEach(channel => {
          next[channel.id] = {
            ...current[channel.id],
            on,
            level: isRangeChannel(channel.kind)
              ? on
                ? 100
                : 0
              : current[channel.id]?.level ?? 0,
          };
        });
        return next;
      });

      if (!device.siteId) {
        return;
      }

      setIsSending(true);
      try {
        await Promise.all(
          targets.map(channel => {
            const pins = pinsFor(channel.id);
            if (!pins) {
              return Promise.resolve();
            }
            if (isRangeChannel(channel.kind)) {
              return pins.pwmPinNumber == null
                ? Promise.resolve()
                : sendDeviceCommand(
                    device,
                    'SET_PWM',
                    buildSetPwmPayload(pins.pwmPinNumber, on ? 100 : 0),
                  );
            }
            return pins.pinNumber == null
              ? Promise.resolve()
              : sendDevicePinCommand(device, pins.pinNumber, on);
          }),
        );
        setDigitalPins(current =>
          current.map(pin => ({ ...pin, state: on ? 1 : 0 })),
        );
      } catch {
        setStates(previous);
        showError('Failed to update device');
      } finally {
        setIsSending(false);
      }
    },
    [device, pinsFor, profile.channels, states],
  );

  const channels = useMemo<ChannelView[]>(
    () =>
      profile.channels.map(channel => {
        const state = states[channel.id] ?? {
          on: false,
          level: 0,
          curtain: null,
        };
        const pins = pinMap.find(item => item.channelId === channel.id);
        return {
          channel,
          on: state.on,
          level: state.level,
          curtain: state.curtain,
          step: stepFor(channel.kind),
          speed: Math.round(state.level / LEVEL_STEP.fan),
          isControllable:
            channel.kind !== 'doorbell' &&
            (pins?.pinNumber != null ||
              pins?.pwmPinNumber != null ||
              !device.siteId),
        };
      }),
    [device.siteId, pinMap, profile.channels, states],
  );

  const activeCount = channels.filter(view => view.on).length;

  return {
    profile,
    channels,
    activeCount,
    isLoading,
    isSending,
    refresh,
    toggleChannel,
    setChannelOn,
    setChannelLevel,
    stepChannelLevel,
    setCurtain,
    setAll,
  };
};
