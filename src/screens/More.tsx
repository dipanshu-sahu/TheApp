import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated from 'react-native-reanimated';

import Screen from '../components/ui/Screen';
import AppText from '../components/ui/AppText';
import GlassCard from '../components/ui/GlassCard';
import AnimatedPressable from '../components/ui/AnimatedPressable';
import ToggleSwitch from '../components/home/ToggleSwitch';
import Icon from '../components/Icon';
import { IconName } from '../types/icons';
import { enterFade, enterUp } from '../components/ui/motion';
import { colors, withAlpha } from '../themes/colors';
import { spacing } from '../themes/spacing';
import { radii } from '../themes/radii';
import { shadows } from '../themes/shadows';

type Scene = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: [string, string];
  triggerIcon: IconName;
  trigger: string;
};

type Routine = {
  id: string;
  title: string;
  when: string;
  then: string;
  icon: IconName;
};

const SCENES: Scene[] = [
  {
    id: 'morning',
    title: 'Good Morning',
    subtitle: 'Lights on · blinds up',
    icon: 'sunrise',
    gradient: [colors.gradAmberStart, colors.gradAmberEnd],
    triggerIcon: 'clock',
    trigger: '6:30 AM',
  },
  {
    id: 'away',
    title: 'Away Mode',
    subtitle: 'Secure · power off',
    icon: 'shield',
    gradient: [colors.gradPrimaryStart, colors.gradPrimaryEnd],
    triggerIcon: 'location-pin',
    trigger: 'Leave home',
  },
  {
    id: 'movie',
    title: 'Movie Night',
    subtitle: 'Dim · cozy glow',
    icon: 'bulb',
    gradient: [colors.gradPrimaryEnd, colors.gradPrimaryStart],
    triggerIcon: 'power-button',
    trigger: 'Manual',
  },
  {
    id: 'night',
    title: 'Good Night',
    subtitle: 'All off · quiet',
    icon: 'moon',
    gradient: [colors.gradSuccessStart, colors.gradSuccessEnd],
    triggerIcon: 'clock',
    trigger: '11:00 PM',
  },
];

const ROUTINES: Routine[] = [
  {
    id: 'r1',
    title: 'Porch light after sunset',
    when: 'Sunset',
    then: 'Turn on porch',
    icon: 'sun',
  },
  {
    id: 'r2',
    title: 'Lock when everyone leaves',
    when: 'No one home',
    then: 'Arm security',
    icon: 'shield',
  },
];

const SceneCard: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const gradId = `scene-${scene.id}`;
  return (
    <Animated.View entering={enterUp(index + 2)} style={styles.sceneWrap}>
      <AnimatedPressable pressScale={0.97} enforceTouchTarget={false}>
        <GlassCard variant="soft" sheen style={styles.sceneCard}>
          <View style={[styles.sceneIcon, shadows.sm]}>
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
              <Defs>
                <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={scene.gradient[0]} />
                  <Stop offset="1" stopColor={scene.gradient[1]} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" rx={radii.md} fill={`url(#${gradId})`} />
            </Svg>
            <Icon name={scene.icon} width={22} height={22} color={colors.white} />
          </View>
          <AppText variant="bodyLgStrong" numberOfLines={1}>
            {scene.title}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {scene.subtitle}
          </AppText>
          <View style={styles.triggerChip}>
            <Icon name={scene.triggerIcon} width={12} height={12} color={colors.textTertiary} />
            <AppText variant="micro" color={colors.textTertiary}>
              {scene.trigger}
            </AppText>
          </View>
        </GlassCard>
      </AnimatedPressable>
    </Animated.View>
  );
};

const RoutineRow: React.FC<{ routine: Routine; index: number }> = ({ routine, index }) => {
  const [enabled, setEnabled] = useState(index === 0);
  return (
    <Animated.View entering={enterUp(index + 6)}>
      <GlassCard variant="soft" sheen={false} style={styles.routineCard}>
        <View style={[styles.routineIcon, { backgroundColor: withAlpha(colors.primary, 0.16) }]}>
          <Icon name={routine.icon} width={20} height={20} color={colors.primary} />
        </View>
        <View style={styles.routineBody}>
          <AppText variant="bodyLgStrong" numberOfLines={1}>
            {routine.title}
          </AppText>
          <View style={styles.flowRow}>
            <AppText variant="caption" color={colors.textSecondary}>
              {routine.when}
            </AppText>
            <Icon name="arrow-next" width={12} height={12} color={colors.textTertiary} />
            <AppText variant="caption" color={colors.textSecondary}>
              {routine.then}
            </AppText>
          </View>
        </View>
        <ToggleSwitch value={enabled} onValueChange={setEnabled} />
      </GlassCard>
    </Animated.View>
  );
};

const More: React.FC = () => (
  <Screen
    edges={['top']}
    scroll
    ambientTint={colors.gradPrimaryEnd}
    contentContainerStyle={styles.content}
  >
    <Animated.View entering={enterFade(0)} style={styles.header}>
      <AppText variant="h1">Automations</AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.headerSub}>
        Scenes and routines that run your home for you.
      </AppText>
    </Animated.View>

    <Animated.View entering={enterUp(1)}>
      <GlassCard variant="soft" style={styles.hero}>
        <View style={[styles.heroIcon, shadows.glow]}>
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              <LinearGradient id="autoHero" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.gradPrimaryStart} />
                <Stop offset="1" stopColor={colors.gradPrimaryEnd} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={radii.lg} fill="url(#autoHero)" />
          </Svg>
          <Icon name="zap" width={28} height={28} color={colors.white} />
        </View>
        <View style={styles.heroCopy}>
          <AppText variant="h3">Build a routine</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            When something happens → then devices respond.
          </AppText>
        </View>
      </GlassCard>
    </Animated.View>

    <AppText variant="labelCaps" color={colors.textTertiary} style={styles.sectionTitle}>
      Scene Templates
    </AppText>
    <View style={styles.sceneGrid}>
      {SCENES.map((scene, index) => (
        <SceneCard key={scene.id} scene={scene} index={index} />
      ))}
    </View>

    <AppText variant="labelCaps" color={colors.textTertiary} style={styles.sectionTitle}>
      Active Routines
    </AppText>
    <View style={styles.routineList}>
      {ROUTINES.map((routine, index) => (
        <RoutineRow key={routine.id} routine={routine} index={index} />
      ))}
    </View>
  </Screen>
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerSub: {
    marginTop: spacing.xs,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xxs,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  sceneWrap: {
    width: '48.5%',
    marginBottom: spacing.sm,
  },
  sceneCard: {
    padding: spacing.md,
    minHeight: 148,
    gap: 4,
  },
  sceneIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  triggerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  routineList: {
    gap: spacing.sm,
  },
  routineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  routineIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineBody: {
    flex: 1,
    gap: 2,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});

export default More;
