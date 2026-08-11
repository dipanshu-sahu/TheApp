/** Corner radius scale - modern, soft (16-24 for cards). */
export const radii = {
  none: 0,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
  round: 9999,
} as const;

export type RadiusToken = keyof typeof radii;
