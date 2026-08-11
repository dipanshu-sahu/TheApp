import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlassCard from '../ui/GlassCard';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';

type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <AppText variant="labelCaps" color={colors.textTertiary} style={styles.sectionTitle}>
      {title}
    </AppText>
    <GlassCard variant="soft" sheen={false} style={styles.sectionCard}>
      {children}
    </GlassCard>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xxs,
  },
  sectionCard: {
    padding: 0,
  },
});

export default ProfileSection;
