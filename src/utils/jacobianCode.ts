import { DeviceInfo } from '../types/device';
import { getSwitchGangCountFromDevice } from './deviceMapper';

/**
 * Jacobian product codes (eJS7F1P2, eJC2, eJA16, ...) describe exactly which
 * controls a panel exposes. The code is the single source of truth for the
 * device UI: every segment after the `eJ` prefix is `<letter><count>`.
 *
 *   S = Switch (on/off)      F = Fan (speed range)
 *   P = Plug / socket        D = Dimmer (brightness range)
 *   C = Curtain controller   A = High-load switch, digits are the amp rating
 *   B = Doorbell
 */
export type ChannelKind =
  | 'switch'
  | 'fan'
  | 'plug'
  | 'dimmer'
  | 'curtain'
  | 'doorbell';

export type DeviceChannel = {
  readonly id: string;
  readonly kind: ChannelKind;
  readonly label: string;
  /** 1-based position among channels of the same kind */
  readonly index: number;
  /** Amp rating for high-load (A) channels, e.g. 16 for eJA16 */
  readonly amps?: number;
};

export type JacobianProfile = {
  readonly code: string | null;
  readonly productName: string | null;
  readonly gangs: number | null;
  /** Human readable combination, e.g. "5 Switch + 1 Fan + 1 Plug" */
  readonly summary: string;
  readonly channels: readonly DeviceChannel[];
  /** How the profile was resolved — useful when debugging odd device names */
  readonly source: 'code' | 'name' | 'pins' | 'unknown';
};

type CatalogEntry = {
  readonly code: string;
  readonly productName: string;
  readonly gangs: number;
};

/** Published product line. Channels are derived from the code itself. */
export const JACOBIAN_CATALOG: readonly CatalogEntry[] = [
  { code: 'eJS12',    productName: '8 Gang (12 Switch) IR Remote & Wi-Fi Touch Switch',              gangs: 8 },
  { code: 'eJS7F1',   productName: '8 Gang (7 Switch + 1 Fan) IR Remote & Wi-Fi Touch Switch',       gangs: 8 },
  { code: 'eJS8',     productName: '8 Gang IR Remote & Wi-Fi Touch Switch',                          gangs: 8 },
  { code: 'eJS6F2',   productName: '8 Gang (6 Switch + 2 Fan) IR Remote & Wi-Fi Touch Switch',       gangs: 8 },
  { code: 'eJS6P1',   productName: '8 Gang (6 Switch + 1 Plug) IR Remote & Wi-Fi Touch Switch',      gangs: 8 },
  { code: 'eJS5F1P1', productName: '8 Gang (5 Switch + 1 Fan + 1 Plug) IR Remote & Wi-Fi Touch Switch', gangs: 8 },
  { code: 'eJS5D1P1', productName: '8 Gang (5 Switch + 1 Dimmer + 1 Plug) IR Remote & Wi-Fi Touch Switch', gangs: 8 },
  { code: 'eJS3F1P1', productName: '8 Gang (3 Switch + 1 Fan + 1 Plug) IR Remote & Wi-Fi Touch Switch', gangs: 8 },
  { code: 'eJS4P1',   productName: '8 Gang (4 Switch + 1 Plug) IR Remote & Wi-Fi Touch Switch',      gangs: 8 },
  { code: 'eJS2P2',   productName: '8 Gang (2 Switch + 2 Plug) IR Remote & Wi-Fi Touch Switch',      gangs: 8 },
  { code: 'eJS7D1',   productName: '8 Gang (7 Switch + 1 Dimmer) IR Remote & Wi-Fi Touch Switch',    gangs: 8 },
  { code: 'eJS6D1F1', productName: '8 Gang (6 Switch + 1 Dimmer + 1 Fan) IR Remote & Wi-Fi Touch Switch', gangs: 8 },
  { code: 'eJS6D2',   productName: '8 Gang (6 Switch + 2 Dimmer) IR Remote & Wi-Fi Touch Switch',    gangs: 8 },
  { code: 'eJS3D1P1', productName: '8 Gang (3 Switch + 1 Dimmer + 1 Plug) IR Remote & Wi-Fi Touch Switch', gangs: 8 },
  { code: 'eJP2',     productName: '8 Gang (2 Plugs) IR Remote & Wi-Fi Touch Switch',                gangs: 8 },
  { code: 'eJS12P2',  productName: '12 Gang (12 Switch + 2 Plug) IR Remote & Wi-Fi Touch Switch',    gangs: 12 },
  { code: 'eJS6F2P2', productName: '12 Gang (6 Switch + 2 Fan + 2 Plug) IR Remote & Wi-Fi Touch Switch', gangs: 12 },
  { code: 'eJS7F1P2', productName: '12 Gang (7 Switch + 1 Fan + 2 Plug) IR Remote & Wi-Fi Touch Switch', gangs: 12 },
  { code: 'eJS8P2',   productName: '12 Gang (8 Switch + 2 Plug) IR Remote & Wi-Fi Touch Switch',     gangs: 12 },
  { code: 'eJS4',     productName: '4 Gang IR Remote & Wi-Fi Touch Switch',                          gangs: 4 },
  { code: 'eJS6',     productName: '4 Gang (6 Switch) IR Remote & Wi-Fi Touch Switch',               gangs: 4 },
  { code: 'eJS3F1',   productName: '4 Gang (3 Switch + 1 Fan) IR Remote & Wi-Fi Touch Switch',       gangs: 4 },
  { code: 'eJS3D1',   productName: '4 Gang (3 Switch + 1 Dimmer) IR Remote & Wi-Fi Touch Switch',    gangs: 4 },
  { code: 'eJS1P1',   productName: '4 Gang (1 Switch + 1 Plug) IR Remote & Wi-Fi Touch Switch',      gangs: 4 },
  { code: 'eJS3',     productName: '3 Gang IR Remote & Wi-Fi Touch Switch',                          gangs: 3 },
  { code: 'eJS2P1',   productName: '3 Gang (1 Plug) IR Remote & Wi-Fi Touch Switch',                 gangs: 3 },
  { code: 'eJS2',     productName: '2 Gang IR Remote & Wi-Fi Touch Switch',                          gangs: 2 },
  { code: 'eJC2',     productName: '2 Gang (Curtain Controller) IR Remote & Wi-Fi Touch Switch',     gangs: 2 },
  { code: 'eJA16',    productName: '1 Gang 16 Amps IR Remote & Wi-Fi Touch Switch',                  gangs: 1 },
  { code: 'eJD1',     productName: '1 Gang (1 Dimmer) IR Remote & Wi-Fi Touch Switch',               gangs: 1 },
  { code: 'eJB1',     productName: '1 Gang Touch DoorBell Switch',                                   gangs: 1 },
];

const CATALOG_BY_CODE: ReadonlyMap<string, CatalogEntry> = new Map(
  JACOBIAN_CATALOG.map(entry => [entry.code.toLowerCase(), entry]),
);

const KIND_BY_SEGMENT: Readonly<Record<string, ChannelKind>> = {
  S: 'switch',
  F: 'fan',
  P: 'plug',
  D: 'dimmer',
  C: 'curtain',
  A: 'switch',
  B: 'doorbell',
};

const KIND_LABEL: Readonly<Record<ChannelKind, string>> = {
  switch: 'Switch',
  fan: 'Fan',
  plug: 'Socket',
  dimmer: 'Dimmer',
  curtain: 'Curtain',
  doorbell: 'Doorbell',
};

const SUMMARY_LABEL: Readonly<Record<ChannelKind, string>> = {
  switch: 'Switch',
  fan: 'Fan',
  plug: 'Plug',
  dimmer: 'Dimmer',
  curtain: 'Curtain',
  doorbell: 'Doorbell',
};

const CODE_PATTERN = /ej((?:[sfpdcab]\d+)+)/i;
const SEGMENT_PATTERN = /([sfpdcab])(\d+)/gi;

/** Finds a product code inside a free-form string (device name, mesh id, ...). */
export const extractJacobianCode = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }
  const match = value.replace(/[\s_-]/g, '').match(CODE_PATTERN);
  return match ? `eJ${match[1].toUpperCase()}` : null;
};

const buildChannels = (
  counts: ReadonlyArray<{ kind: ChannelKind; count: number; amps?: number }>,
): DeviceChannel[] => {
  const perKind: Partial<Record<ChannelKind, number>> = {};
  const channels: DeviceChannel[] = [];

  counts.forEach(({ kind, count, amps }) => {
    for (let i = 0; i < count; i += 1) {
      const index = (perKind[kind] ?? 0) + 1;
      perKind[kind] = index;
      const base = amps ? `${amps}A ${KIND_LABEL[kind]}` : KIND_LABEL[kind];
      channels.push({
        id: `${kind}-${index}`,
        kind,
        index,
        amps,
        label: count === 1 && !amps ? base : `${base} ${amps ? '' : index}`.trim(),
      });
    }
  });

  return channels;
};

/** Reads like the published combination, e.g. "5 Switch + 1 Fan + 1 Plug". */
const summarise = (channels: readonly DeviceChannel[]): string => {
  const counts = new Map<ChannelKind, number>();
  channels.forEach(channel => {
    counts.set(channel.kind, (counts.get(channel.kind) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([kind, count]) => `${count} ${SUMMARY_LABEL[kind]}`)
    .join(' + ');
};

/** Decodes `eJS5F1P1` into its ordered control channels. */
export const decodeJacobianCode = (rawCode: string): JacobianProfile | null => {
  const code = extractJacobianCode(rawCode);
  if (!code) {
    return null;
  }

  const counts: Array<{ kind: ChannelKind; count: number; amps?: number }> = [];
  SEGMENT_PATTERN.lastIndex = 0;
  let segment = SEGMENT_PATTERN.exec(code);

  while (segment) {
    const letter = segment[1].toUpperCase();
    const digits = Number.parseInt(segment[2], 10);
    const kind = KIND_BY_SEGMENT[letter];

    if (kind) {
      if (letter === 'A') {
        // Digits are the amp rating (eJA16 = one 16A switch), not a count.
        counts.push({ kind, count: 1, amps: digits });
      } else if (letter === 'C') {
        // A curtain controller drives one motor from a pair of gangs.
        counts.push({ kind, count: 1 });
      } else if (digits > 0) {
        counts.push({ kind, count: digits });
      }
    }
    segment = SEGMENT_PATTERN.exec(code);
  }

  if (!counts.length) {
    return null;
  }

  const channels = buildChannels(counts);
  const catalogEntry = CATALOG_BY_CODE.get(code.toLowerCase());

  return {
    code,
    productName: catalogEntry?.productName ?? null,
    gangs: catalogEntry?.gangs ?? null,
    summary: summarise(channels),
    channels,
    source: 'code',
  };
};

const NAME_COMBINATION_PATTERN =
  /(\d+)\s*(switches|switch|fans|fan|plugs|plug|sockets|socket|dimmers|dimmer|curtains|curtain|doorbells|doorbell)/gi;

const KIND_BY_WORD: Readonly<Record<string, ChannelKind>> = {
  switch: 'switch',
  fan: 'fan',
  plug: 'plug',
  socket: 'plug',
  dimmer: 'dimmer',
  curtain: 'curtain',
  doorbell: 'doorbell',
};

/** Falls back to the descriptive product name, e.g. "6 Switch + 2 Fan". */
const decodeFromName = (name?: string | null): JacobianProfile | null => {
  if (!name) {
    return null;
  }

  const counts: Array<{ kind: ChannelKind; count: number }> = [];
  NAME_COMBINATION_PATTERN.lastIndex = 0;
  let match = NAME_COMBINATION_PATTERN.exec(name);

  while (match) {
    const count = Number.parseInt(match[1], 10);
    const word = match[2].toLowerCase().replace(/e?s$/, '');
    const kind = KIND_BY_WORD[word];
    if (kind && count > 0) {
      counts.push({ kind, count: kind === 'curtain' ? 1 : count });
    }
    match = NAME_COMBINATION_PATTERN.exec(name);
  }

  if (!counts.length) {
    const lower = name.toLowerCase();
    if (lower.includes('curtain')) {
      counts.push({ kind: 'curtain', count: 1 });
    } else if (lower.includes('doorbell') || lower.includes('door bell')) {
      counts.push({ kind: 'doorbell', count: 1 });
    }
  }

  if (!counts.length) {
    return null;
  }

  const channels = buildChannels(counts);
  return {
    code: null,
    productName: name,
    gangs: null,
    summary: summarise(channels),
    channels,
    source: 'name',
  };
};

const EMPTY_PROFILE: JacobianProfile = {
  code: null,
  productName: null,
  gangs: null,
  summary: '',
  channels: [],
  source: 'unknown',
};

/**
 * Resolves the control layout for a device: product code first, then the
 * descriptive name, then the reported GPIO pins (all plain switches).
 */
export const resolveDeviceProfile = (device: DeviceInfo): JacobianProfile => {
  const code =
    extractJacobianCode(device.jacobianCode) ??
    extractJacobianCode(device.name) ??
    extractJacobianCode(device.meshId);

  const fromCode = code ? decodeJacobianCode(code) : null;
  if (fromCode) {
    return fromCode;
  }

  const fromName = decodeFromName(device.name);
  if (fromName) {
    return fromName;
  }

  const pinCount = device.digitalPins?.length ?? 0;
  const looksLikePanel = /gang|switch/i.test(device.name ?? '');
  if (pinCount > 0 || device.deviceType != null || looksLikePanel) {
    const count = pinCount > 0 ? pinCount : getSwitchGangCountFromDevice(device);
    const channels = buildChannels([{ kind: 'switch', count }]);
    return {
      code: null,
      productName: null,
      gangs: count,
      summary: summarise(channels),
      channels,
      source: 'pins',
    };
  }

  return EMPTY_PROFILE;
};

/** Channels driven by PWM (0-100) rather than a digital on/off pin. */
export const isRangeChannel = (kind: ChannelKind): boolean =>
  kind === 'fan' || kind === 'dimmer';
