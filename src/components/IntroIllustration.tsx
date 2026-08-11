import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Icon from './Icon';
import { colors } from '../themes/colors';
import { radii } from '../themes/radii';
import { shadows } from '../themes/shadows';

const TILE_SIZE = 44;
const CENTER = 120;

const FloatingTile: React.FC<{
  x: number;
  y: number;
  icon: 'intro-lightbulb' | 'intro-ac' | 'intro-camera';
  delay: number;
}> = ({ x, y, icon, delay }) => {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [offset, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + offset.value * -6 }],
  }));

  return (
    <Animated.View
      style={[
        styles.deviceTile,
        shadows.sm,
        { left: x - TILE_SIZE / 2, top: y - TILE_SIZE / 2 },
        style,
      ]}
    >
      <Icon name={icon} width={22} height={22} />
    </Animated.View>
  );
};

const IntroIllustration: React.FC = () => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse]);

  const houseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.04 }],
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.rings}>
        <Icon name="intro-rings" width={240} height={240} />
      </View>

      <Animated.View style={[styles.houseTile, shadows.md, houseStyle]}>
        <Icon name="intro-house" width={38} height={38} />
      </Animated.View>

      <FloatingTile x={CENTER + 74} y={CENTER - 48} icon="intro-lightbulb" delay={0} />
      <FloatingTile x={CENTER + 80} y={CENTER + 52} icon="intro-ac" delay={400} />
      <FloatingTile x={CENTER - 80} y={CENTER + 48} icon="intro-camera" delay={800} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rings: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseTile: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: radii.lg,
    backgroundColor: colors.illustrationTile,
    borderWidth: 1,
    borderColor: colors.illustrationTileBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceTile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radii.sm,
    backgroundColor: colors.illustrationTile,
    borderWidth: 1,
    borderColor: colors.illustrationTileBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IntroIllustration;
