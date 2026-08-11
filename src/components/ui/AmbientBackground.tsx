import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from 'react-native-svg';
import { colors } from '../../themes/colors';

interface AmbientBackgroundProps {
  /** Accent color of the primary glow. */
  tint?: string;
  /** Secondary glow color. */
  tintSecondary?: string;
}

/**
 * Decorative, non-interactive background: deep base fill plus two soft color
 * glows for depth. Sits behind screen content.
 */
const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  tint = colors.primary,
  tintSecondary = colors.secondary,
}) => {
  const { width, height } = useWindowDimensions();

  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="glowA" cx="20%" cy="0%" r="70%">
          <Stop offset="0" stopColor={tint} stopOpacity={0.22} />
          <Stop offset="1" stopColor={tint} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="glowB" cx="95%" cy="18%" r="60%">
          <Stop offset="0" stopColor={tintSecondary} stopOpacity={0.14} />
          <Stop offset="1" stopColor={tintSecondary} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={colors.bgBase} />
      <Circle cx={width * 0.2} cy={0} r={width * 0.9} fill="url(#glowA)" />
      <Circle cx={width * 0.95} cy={height * 0.14} r={width * 0.8} fill="url(#glowB)" />
    </Svg>
  );
};

export default AmbientBackground;
