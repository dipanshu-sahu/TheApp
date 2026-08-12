import { IconName } from '../../../types/icons';
import { colors, withAlpha } from '../../../themes/colors';
import { ChannelKind } from '../../../utils/jacobianCode';

export type ChannelMeta = {
  readonly icon: IconName;
  readonly accent: string;
  /** Short caps label so every control type is identifiable at a glance */
  readonly badge: string;
  readonly activeBackground: string;
};

/** Keeps the original switch tile blue so existing panels look unchanged. */
const SWITCH_ACTIVE_BG = '#1A3A6B';

export const CHANNEL_META: Readonly<Record<ChannelKind, ChannelMeta>> = {
  switch: {
    icon: 'power-button',
    accent: colors.primary,
    badge: 'Switch',
    activeBackground: SWITCH_ACTIVE_BG,
  },
  fan: {
    icon: 'fan',
    accent: '#38BDF8',
    badge: 'Fan',
    activeBackground: withAlpha('#38BDF8', 0.18),
  },
  plug: {
    icon: 'socket',
    accent: colors.secondary,
    badge: 'Socket',
    activeBackground: withAlpha(colors.secondary, 0.18),
  },
  dimmer: {
    icon: 'dimmer',
    accent: colors.cta,
    badge: 'Dimmer',
    activeBackground: withAlpha(colors.cta, 0.18),
  },
  curtain: {
    icon: 'curtain',
    accent: colors.gradPrimaryEnd,
    badge: 'Curtain',
    activeBackground: withAlpha(colors.gradPrimaryEnd, 0.18),
  },
  doorbell: {
    icon: 'bell',
    accent: colors.passwordLock,
    badge: 'Doorbell',
    activeBackground: withAlpha(colors.passwordLock, 0.18),
  },
};
