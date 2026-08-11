import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlassCard from '../ui/GlassCard';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';

type StatItem = {
  value: number | string;
  label: string;
  accent?: string;
};

type ProfileStatsRowProps = {
  stats: StatItem[];
};

const ProfileStatsRow: React.FC<ProfileStatsRowProps> = ({ stats }) => (
  <View style={styles.statsRow}>
    {stats.map(stat => (
      <GlassCard key={stat.label} style={styles.statCard}>
        <AppText variant="h2" color={stat.accent ?? colors.primary}>
          {stat.value}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {stat.label}
        </AppText>
      </GlassCard>
    ))}
  </View>
);

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xxs,
  },
});

export default ProfileStatsRow;
