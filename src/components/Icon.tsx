import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg from 'react-native-svg';
import { iconNames, IconName } from '../types/icons';
import { colors } from '../themes/colors';
import { iconRegistry } from './ui/iconRegistry';

export { iconNames };
export type { IconName };

export type IconProps = {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
  /** Single tint applied to the glyph. `color`, `fill`, or `stroke` all work. */
  fill?: string;
  stroke?: string;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Unified icon renderer. All glyphs come from a single premium outline kit
 * (`iconRegistry`) drawn on a 24x24 canvas, guaranteeing identical stroke
 * weight and aesthetic language across the entire app.
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  width,
  height,
  fill,
  stroke,
  color,
  strokeWidth = 1.8,
  style,
}) => {
  const glyphColor = color ?? stroke ?? fill ?? colors.textPrimary;
  const w = width ?? size;
  const h = height ?? size;
  const renderer = iconRegistry[name];

  if (!renderer) {
    return null;
  }

  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" fill="none" style={style}>
      {renderer(glyphColor, strokeWidth)}
    </Svg>
  );
};

export default Icon;
