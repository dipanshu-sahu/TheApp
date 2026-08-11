import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { shadows, ShadowToken } from '../../themes/shadows';

type GlassVariant = 'default' | 'strong' | 'soft';

export interface GlassCardProps {
  variant?: GlassVariant;
  radius?: number;
  padding?: number;
  elevation?: ShadowToken;
  /** Adds a subtle top-down light sheen for a premium surface feel. */
  sheen?: boolean;
  /** Opt-in hairline edge. Off by default for a clean, borderless look. */
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Premium surface primitive.
 *
 * Uses clean, solid elevated fills (not muddy translucent overlays) so cards
 * read crisply on the dark canvas. Depth comes from fill contrast + a soft
 * shadow and an optional light sheen - NOT from visible outlines. Borders are
 * opt-in via `bordered` for the rare case one is needed.
 */
const variantStyles: Record<GlassVariant, { bg: string; elevation: ShadowToken }> = {
  default: { bg: colors.surfaceCard, elevation: 'sm' },
  strong: { bg: colors.surfaceElevated, elevation: 'md' },
  soft: { bg: colors.surfaceSubtle, elevation: 'none' },
};

const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'soft',
  radius = radii.xl,
  padding,
  elevation,
  sheen = true,
  bordered = false,
  style,
  children,
}) => {
  const v = variantStyles[variant];

  return (
    <View
      style={[
        styles.base,
        shadows[elevation ?? v.elevation],
        {
          backgroundColor: v.bg,
          borderRadius: radius,
          padding,
        },
        bordered ? styles.bordered : null,
        style,
      ]}
    >
      {sheen ? (
        <Svg
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id="glassSheen" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.white} stopOpacity={0.06} />
              <Stop offset="0.4" stopColor={colors.white} stopOpacity={0.015} />
              <Stop offset="1" stopColor={colors.white} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={radius} fill="url(#glassSheen)" />
        </Svg>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
  },
});

export default GlassCard;
