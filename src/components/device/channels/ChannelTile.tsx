import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import AppText from '../../ui/AppText';
import AnimatedPressable from '../../ui/AnimatedPressable';
import { colors, withAlpha } from '../../../themes/colors';
import { radii } from '../../../themes/radii';
import { spacing } from '../../../themes/spacing';
import { ChannelView, CurtainAction, FAN_SPEED_COUNT } from '../../../hooks/useJacobianDevice';
import ChannelTileShell from './ChannelTileShell';
import { CHANNEL_META } from './channelMeta';

type ChannelTileProps = {
  view: ChannelView;
  name: string;
  onToggle: () => void;
  onStep: (direction: 1 | -1) => void;
  onCurtain: (action: CurtainAction) => void;
  onRename: () => void;
  style?: StyleProp<ViewStyle>;
};

const StepButton: React.FC<{
  symbol: string;
  accent: string;
  disabled?: boolean;
  onPress: () => void;
}> = ({ symbol, accent, disabled, onPress }) => (
  <AnimatedPressable
    style={[
      styles.stepButton,
      { borderColor: withAlpha(accent, disabled ? 0.2 : 0.55) },
      disabled && styles.stepDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    pressScale={0.9}
    enforceTouchTarget={false}
  >
    <AppText variant="h3" color={disabled ? colors.textTertiary : accent}>
      {symbol}
    </AppText>
  </AnimatedPressable>
);

const LevelBar: React.FC<{ level: number; accent: string; segments: number }> = ({
  level,
  accent,
  segments,
}) => {
  const filled = Math.round((level / 100) * segments);
  return (
    <View style={styles.levelBar}>
      {Array.from({ length: segments }, (_, index) => (
        <View
          key={index}
          style={[
            styles.levelSegment,
            { backgroundColor: index < filled ? accent : colors.lineGrey },
          ]}
        />
      ))}
    </View>
  );
};

const rangeStatus = (view: ChannelView): string => {
  if (view.level <= 0) {
    return 'Off';
  }
  return view.channel.kind === 'fan'
    ? `Speed ${view.speed} of ${FAN_SPEED_COUNT}`
    : `${view.level}%`;
};

const curtainStatus = (action: CurtainAction | null): string => {
  switch (action) {
    case 'open':
      return 'Opening';
    case 'close':
      return 'Closing';
    case 'stop':
      return 'Stopped';
    default:
      return 'Idle';
  }
};

const CURTAIN_ACTIONS: ReadonlyArray<{ action: CurtainAction; label: string }> = [
  { action: 'open', label: 'Open' },
  { action: 'stop', label: 'Stop' },
  { action: 'close', label: 'Close' },
];

/** Renders the right control for a decoded channel kind. */
const ChannelTile: React.FC<ChannelTileProps> = ({
  view,
  name,
  onToggle,
  onStep,
  onCurtain,
  onRename,
  style,
}) => {
  const { channel } = view;
  const meta = CHANNEL_META[channel.kind];
  const disabled = !view.isControllable;

  if (channel.kind === 'fan' || channel.kind === 'dimmer') {
    const segments = channel.kind === 'fan' ? FAN_SPEED_COUNT : 10;
    return (
      <ChannelTileShell
        kind={channel.kind}
        label={name}
        status={rangeStatus(view)}
        on={view.level > 0}
        disabled={disabled}
        onPress={onToggle}
        onLongPress={onRename}
        style={style}
      >
        <View style={styles.rangeRow}>
          <StepButton
            symbol="−"
            accent={meta.accent}
            disabled={disabled || view.level <= 0}
            onPress={() => onStep(-1)}
          />
          <View style={styles.rangeValue}>
            <AppText variant="h3" color={view.level > 0 ? meta.accent : colors.textSecondary}>
              {channel.kind === 'fan' ? view.speed : `${view.level}%`}
            </AppText>
            <LevelBar level={view.level} accent={meta.accent} segments={segments} />
          </View>
          <StepButton
            symbol="+"
            accent={meta.accent}
            disabled={disabled || view.level >= 100}
            onPress={() => onStep(1)}
          />
        </View>
      </ChannelTileShell>
    );
  }

  if (channel.kind === 'curtain') {
    return (
      <ChannelTileShell
        kind="curtain"
        label={name}
        status={curtainStatus(view.curtain)}
        on={view.curtain === 'open' || view.curtain === 'close'}
        disabled={disabled}
        onLongPress={onRename}
        style={style}
      >
        <View style={styles.actionRow}>
          {CURTAIN_ACTIONS.map(({ action, label }) => {
            const active = view.curtain === action;
            return (
              <AnimatedPressable
                key={action}
                style={[
                  styles.actionButton,
                  active && {
                    backgroundColor: withAlpha(meta.accent, 0.22),
                    borderColor: meta.accent,
                  },
                ]}
                onPress={() => onCurtain(action)}
                disabled={disabled}
                pressScale={0.94}
                enforceTouchTarget={false}
              >
                <AppText
                  variant="captionStrong"
                  color={active ? meta.accent : colors.textSecondary}
                >
                  {label}
                </AppText>
              </AnimatedPressable>
            );
          })}
        </View>
      </ChannelTileShell>
    );
  }

  if (channel.kind === 'doorbell') {
    return (
      <ChannelTileShell
        kind="doorbell"
        label={name}
        status={view.on ? 'Ringing' : 'Ready'}
        on={view.on}
        onLongPress={onRename}
        style={style}
      >
        <View style={styles.actionRow}>
          <AnimatedPressable
            style={[styles.actionButton, styles.actionButtonWide]}
            onPress={onToggle}
            pressScale={0.94}
            enforceTouchTarget={false}
          >
            <AppText variant="captionStrong" color={meta.accent}>
              Test chime
            </AppText>
          </AnimatedPressable>
        </View>
      </ChannelTileShell>
    );
  }

  return (
    <ChannelTileShell
      kind={channel.kind}
      label={name}
      status={view.on ? 'On' : 'Off'}
      on={view.on}
      disabled={disabled}
      onPress={onToggle}
      onLongPress={onRename}
      style={style}
    >
      {channel.amps ? (
        <AppText variant="micro" color={colors.textTertiary}>
          {`${channel.amps}A HIGH LOAD`}
        </AppText>
      ) : null}
    </ChannelTileShell>
  );
};

const styles = StyleSheet.create({
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.xxs,
  },
  rangeValue: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  levelBar: {
    flexDirection: 'row',
    gap: 3,
    alignSelf: 'stretch',
  },
  levelSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepButton: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: {
    opacity: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.xxs,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonWide: {
    maxWidth: 160,
  },
});

export default ChannelTile;
