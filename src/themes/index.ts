export { colors, withAlpha } from './colors';
export type { ColorToken } from './colors';
export { typography, fontFamily } from './typography';
export type { TypographyToken } from './typography';
export { spacing, TOUCH_TARGET } from './spacing';
export type { SpacingToken } from './spacing';
export { radii } from './radii';
export type { RadiusToken } from './radii';
export { durations, easings, springs, PRESS_SCALE, PRESS_SCALE_SUBTLE } from './motion';
export { shadows } from './shadows';
export type { ShadowToken } from './shadows';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} as const;
