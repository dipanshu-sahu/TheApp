import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Icon from '../../Icon';
import AppText from '../../ui/AppText';
import AnimatedPressable from '../../ui/AnimatedPressable';
import { colors, withAlpha } from '../../../themes/colors';
import { radii } from '../../../themes/radii';
import { spacing } from '../../../themes/spacing';
import { ChannelKind } from '../../../utils/jacobianCode';
import { CHANNEL_META } from './channelMeta';

type ChannelTileShellProps = {
  kind: ChannelKind;
  label: string;
  status: string;
  on: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Shared frame for every control tile: type badge, glyph, name and live state.
 * The frame keeps the original panel look (dark tile, blue active fill, glow
 * underline) while the badge and accent make each control type obvious.
 */
const ChannelTileShell: React.FC<ChannelTileShellProps> = ({
  kind,
  label,
  status,
  on,
  disabled,
  onPress,
  onLongPress,
  style,
  children,
}) => {
  const meta = CHANNEL_META[kind];

  return (
    <AnimatedPressable
      style={[
        styles.tile,
        on && { backgroundColor: meta.activeBackground, borderColor: meta.accent },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      disabled={disabled || (!onPress && !onLongPress)}
      pressScale={0.97}
      enforceTouchTarget={false}
    >
      <View style={styles.top}>
        <View
          style={[
            styles.iconChip,
            { backgroundColor: withAlpha(meta.accent, on ? 0.24 : 0.1) },
          ]}
        >
          <Icon
            name={meta.icon}
            width={18}
            height={18}
            color={on ? meta.accent : colors.textSecondary}
          />
        </View>
        <AppText variant="micro" color={on ? meta.accent : colors.textTertiary}>
          {meta.badge.toUpperCase()}
        </AppText>
      </View>

      {children}

      <View style={styles.footer}>
        <AppText variant="bodyLgStrong" numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="caption" color={on ? meta.accent : colors.textSecondary}>
          {status}
        </AppText>
      </View>

      {on ? <View style={[styles.glowLine, { backgroundColor: meta.accent }]} /> : null}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: radii.lg,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: spacing.sm,
    minHeight: 132,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: 2,
  },
  glowLine: {
    position: 'absolute',
    bottom: 1,
    width: 44,
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    alignSelf: 'center',
  },
});

export default ChannelTileShell;
