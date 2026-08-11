import { Platform, ViewStyle } from 'react-native';

/**
 * Elevation presets. iOS uses shadow*, Android uses elevation.
 * Shadows are intentionally soft and dark to suit the glass aesthetic.
 */
const make = (
  elevation: number,
  radius: number,
  opacity: number,
  offsetY: number,
): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
    android: { elevation },
    default: {},
  }) as ViewStyle;

export const shadows = {
  none: make(0, 0, 0, 0),
  sm: make(3, 8, 0.18, 3),
  md: make(6, 16, 0.24, 6),
  lg: make(12, 24, 0.32, 10),
  glow: make(8, 20, 0.5, 8),
} as const;

export type ShadowToken = keyof typeof shadows;
