import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../../themes/colors';

const ScanRadar: React.FC = () => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const ringStyle = (scale: number, opacity: number) => ({
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [opacity, opacity * 0.15],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [scale, scale + 0.35],
        }),
      },
    ],
  });

  return (
    <View style={styles.radarWrap}>
      <Animated.View style={[styles.radarRing, styles.radarRingOuter, ringStyle(1, 0.35)]} />
      <Animated.View style={[styles.radarRing, styles.radarRingMid, ringStyle(0.78, 0.5)]} />
      <Animated.View style={[styles.radarRing, styles.radarRingInner, ringStyle(0.55, 0.65)]} />
      <View style={styles.radarCore}>
        <View style={styles.radarDot} />
        <View style={styles.radarBeam} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  radarWrap: {
    width: 220,
    height: 220,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  radarRingOuter: { width: 200, height: 200 },
  radarRingMid: { width: 150, height: 150 },
  radarRingInner: { width: 100, height: 100 },
  radarCore: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  radarBeam: {
    position: 'absolute',
    left: 12,
    width: 90,
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.85,
  },
});

export default ScanRadar;
