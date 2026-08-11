import { TextStyle } from 'react-native';

/**
 * Semantic typography scale.
 * Uses the bundled Nunito family. Line heights are tuned for cross-platform
 * consistency (roughly 1.3-1.5x font size).
 */
export const fontFamily = {
  regular: 'Nunito-Regular',
  bold: 'Nunito-Bold',
} as const;

type TypeToken = TextStyle;

const make = (
  size: number,
  lineHeight: number,
  weight: 'regular' | 'bold',
  letterSpacing = 0,
): TypeToken => ({
  fontFamily: weight === 'bold' ? fontFamily.bold : fontFamily.regular,
  fontSize: size,
  lineHeight,
  letterSpacing,
});

export const typography = {
  // Display / hero numbers
  displayXl: make(46, 52, 'bold', -1),
  display: make(34, 42, 'bold', -0.5),
  displaySm: make(28, 36, 'bold', -0.3),

  // Headings
  h1: make(26, 34, 'bold', -0.2),
  h2: make(22, 30, 'bold', -0.2),
  h3: make(20, 28, 'bold'),
  title: make(18, 26, 'bold'),

  // Body
  bodyLg: make(16, 24, 'regular'),
  bodyLgStrong: make(16, 24, 'bold'),
  body: make(14, 22, 'regular'),
  bodyStrong: make(14, 22, 'bold'),

  // Supporting
  label: make(13, 18, 'bold', 0.4),
  labelCaps: { ...make(11, 16, 'bold', 1.2), textTransform: 'uppercase' as const },
  caption: make(12, 16, 'regular'),
  captionStrong: make(12, 16, 'bold'),
  micro: make(10, 14, 'bold', 0.3),
} as const;

export type TypographyToken = keyof typeof typography;
