/** 4pt-based spacing scale for consistent padding/margins/gaps. */
export const spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
  giant: 72,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Minimum accessible touch target (dp) per iOS HIG / Material guidelines. */
export const TOUCH_TARGET = 44;
