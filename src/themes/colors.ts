/**
 * Design system color tokens - dark glassmorphism reskin.
 *
 * Structure:
 *  - Raw palette + semantic tokens are the source of truth (grouped below).
 *  - Legacy keys are preserved as aliases so screens/components that have not
 *    yet been migrated keep compiling and rendering coherently.
 */

const palette = {
  // Layered dark backgrounds (deep, never pure black)
  base: '#0B1017',
  surface0: '#0E141B',
  surface1: '#141C26',
  surface2: '#18212D',
  surface3: '#1E2937',

  // Brand
  blue: '#5B8DEF',
  blueDeep: '#3D5A80',
  emerald: '#10B981',
  emeraldDeep: '#0EA271',
  amber: '#F59E0B',
  violet: '#8E80FF',

  // Text ramp
  ink0: '#F4F7FA',
  ink1: '#E8ECF0',
  ink2: '#9AA7B8',
  ink3: '#6B7A8D',
  ink4: '#485667',

  // Status
  green: '#22C55E',
  red: '#F87171',
  redDeep: '#EF4444',
  gold: '#D4A853',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const colors = {
  // ---- Backgrounds ----
  bgBase: palette.base,
  bgPrimary: palette.surface0,
  bgSecondary: palette.surface1,
  bgElevated: palette.surface2,
  bgBackground: palette.base,
  homeBg: palette.surface0,
  cardBackground: palette.surface1,

  // ---- Solid elevated surfaces (crisp, borderless cards) ----
  surfaceCard: '#161E29',
  surfaceElevated: '#1C2634',
  surfaceSubtle: '#121A23',

  // ---- Glass surfaces ----
  glass: 'rgba(255,255,255,0.05)',
  glassStrong: 'rgba(255,255,255,0.09)',
  glassSoft: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(255,255,255,0.10)',
  glassBorderStrong: 'rgba(255,255,255,0.16)',
  glassHighlight: 'rgba(255,255,255,0.22)',
  scrim: 'rgba(6,10,16,0.62)',
  scrimStrong: 'rgba(4,7,12,0.78)',

  // ---- Brand / accents ----
  primary: palette.blue,
  primaryDeep: palette.blueDeep,
  primarySoft: 'rgba(91,141,239,0.16)',
  secondary: palette.emerald,
  secondarySoft: 'rgba(16,185,129,0.16)',
  accent: palette.blue,
  cta: palette.amber,
  ctaText: '#0F172A',
  ctaSoft: 'rgba(245,158,11,0.16)',
  link: palette.blue,

  // ---- Gradients (consumed via react-native-svg) ----
  gradPrimaryStart: palette.blue,
  gradPrimaryEnd: '#8E80FF',
  gradSuccessStart: '#22C55E',
  gradSuccessEnd: '#16A34A',
  gradAmberStart: '#F59E0B',
  gradAmberEnd: '#EA8A00',

  // ---- Text ----
  textPrimary: palette.ink1,
  textSecondary: palette.ink2,
  textTertiary: palette.ink3,
  textGrey: palette.ink3,
  textInverse: '#0F172A',

  // ---- Borders / dividers ----
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  lineGrey: '#28323F',
  greyLight: palette.ink3,

  // ---- Inputs ----
  inputBackground: 'rgba(255,255,255,0.04)',
  inputBackgroundSolid: palette.surface1,
  inputBorder: 'rgba(255,255,255,0.10)',
  inputBorderFocused: palette.blue,

  // ---- Status ----
  success: palette.green,
  successSoft: 'rgba(34,197,94,0.16)',
  warning: palette.amber,
  warningSoft: 'rgba(245,158,11,0.16)',
  error: palette.red,
  errorSoft: 'rgba(248,113,113,0.16)',
  info: palette.blue,

  // ---- Component-specific (legacy aliases kept intentionally) ----
  dotInactive: 'rgba(255,255,255,0.14)',
  dotActive: palette.blue,
  illustrationRing: '#16202D',
  illustrationTile: '#1B2736',
  illustrationTileBorder: 'rgba(255,255,255,0.10)',
  authBadgeBlue: 'rgba(91,141,239,0.16)',
  authBadgeGreen: 'rgba(16,185,129,0.16)',
  authBadgeGold: 'rgba(212,168,83,0.14)',
  passwordLock: palette.gold,
  signupGreen: palette.emerald,
  signupGreenEnd: '#0EA271',
  buttonGradientStart: palette.blue,
  buttonGradientEnd: '#8E80FF',
  buttonGradientGreenStart: '#22C55E',
  buttonGradientGreenEnd: '#16A34A',
  timer: palette.amber,
  badgeNew: palette.amber,
  switchTrackOff: 'rgba(255,255,255,0.14)',
  switchThumb: '#FFFFFF',

  // Raw helpers
  white: palette.white,
  black: palette.black,
} as const;

export type ColorToken = keyof typeof colors;

/** Compose a hex color with an alpha channel (0-1). Only supports 6-digit hex. */
export const withAlpha = (hex: string, alpha: number): string => {
  const clamped = Math.max(0, Math.min(1, alpha));
  const a = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};
