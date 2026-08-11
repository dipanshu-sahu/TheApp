import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Line,
  Path,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';

const SIZE = 240;
const C = SIZE / 2;
const R = 108;

/** Expanding "ping" ring emanating from the centre. */
const Ping: React.FC<{ progress: SharedValue<number> }> = ({ progress }) => {
  const style = useAnimatedStyle(() => ({
    opacity: (1 - progress.value) * 0.5,
    transform: [{ scale: 0.2 + progress.value * 0.85 }],
  }));
  return <Animated.View style={[styles.ping, style]} />;
};

const wedgePath = () => {
  // 60° trailing wedge whose leading edge points along +x (to the right).
  const a = (60 * Math.PI) / 180;
  const x = C + R * Math.cos(a);
  const y = C + R * Math.sin(a);
  return `M${C} ${C} L${C + R} ${C} A${R} ${R} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;
};

const ScanRadar: React.FC = () => {
  const sweep = useSharedValue(0);
  const ping1 = useSharedValue(0);
  const ping2 = useSharedValue(0);

  useEffect(() => {
    sweep.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.linear }),
      -1,
      false,
    );
    ping1.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
    ping2.value = withDelay(
      1300,
      withRepeat(withTiming(1, { duration: 2600, easing: Easing.out(Easing.quad) }), -1, false),
    );
  }, [sweep, ping1, ping2]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sweep.value * 360}deg` }],
  }));

  return (
    <View style={styles.wrap}>
      {/* Static scope grid */}
      <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={0.14} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={C} cy={C} r={R} fill="url(#radarFill)" />
        <Circle cx={C} cy={C} r={R} stroke={colors.primary} strokeOpacity={0.28} strokeWidth={1.2} />
        <Circle cx={C} cy={C} r={R * 0.66} stroke={colors.primary} strokeOpacity={0.16} strokeWidth={1} />
        <Circle cx={C} cy={C} r={R * 0.33} stroke={colors.primary} strokeOpacity={0.16} strokeWidth={1} />
        <Line x1={C - R} y1={C} x2={C + R} y2={C} stroke={colors.primary} strokeOpacity={0.12} strokeWidth={1} />
        <Line x1={C} y1={C - R} x2={C} y2={C + R} stroke={colors.primary} strokeOpacity={0.12} strokeWidth={1} />
      </Svg>

      {/* Ping rings */}
      <Ping progress={ping1} />
      <Ping progress={ping2} />

      {/* Rotating sweep */}
      <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="sweepGrad" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity={0.45} />
              <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={wedgePath()} fill="url(#sweepGrad)" />
          <Line x1={C} y1={C} x2={C + R} y2={C} stroke={colors.primary} strokeOpacity={0.9} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      </Animated.View>

      {/* Blips + core */}
      <View style={[styles.blip, { top: C - 46, left: C + 30 }]} />
      <View style={[styles.blip, { top: C + 34, left: C - 40 }]} />
      <View style={[styles.blip, styles.blipDim, { top: C + 12, left: C + 52 }]} />
      <View style={styles.core} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    marginTop: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ping: {
    position: 'absolute',
    width: R * 2,
    height: R * 2,
    borderRadius: R,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  blip: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.secondary,
  },
  blipDim: {
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  core: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
});

export default ScanRadar;
