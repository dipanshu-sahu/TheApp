import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../themes/colors';

const TILE_SIZE = 40;
const CENTER = 120;

const DeviceTile = ({
  x,
  y,
  icon,
  iconSize = 20,
}: {
  x: number;
  y: number;
  icon: 'intro-lightbulb' | 'intro-ac' | 'intro-camera';
  iconSize?: number;
}) => (
  <View
    style={[
      styles.deviceTile,
      {
        left: x - TILE_SIZE / 2,
        top: y - TILE_SIZE / 2,
      },
    ]}
  >
    <Icon name={icon} width={iconSize} height={iconSize} />
  </View>
);

const IntroIllustration: React.FC = () => (
  <View style={styles.wrapper}>
    <Icon
      name="intro-rings"
      width={240}
      height={240}
      style={StyleSheet.absoluteFillObject}
    />

    <View style={styles.houseTile}>
      <Icon name="intro-house" width={36} height={36} />
    </View>

    <DeviceTile x={CENTER + 72} y={CENTER - 48} icon="intro-lightbulb" />
    <DeviceTile x={CENTER + 78} y={CENTER + 52} icon="intro-ac" />
    <DeviceTile x={CENTER - 78} y={CENTER + 48} icon="intro-camera" />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseTile: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 16,
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
    borderRadius: 10,
    backgroundColor: colors.illustrationTile,
    borderWidth: 1,
    borderColor: colors.illustrationTileBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IntroIllustration;
