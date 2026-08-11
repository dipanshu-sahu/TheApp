import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import GlassCard from '../ui/GlassCard';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';

type ProfileCardProps = {
  avatarLabel: string;
  displayName: string;
  email: string;
  accountType: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarLabel,
  displayName,
  email,
  accountType,
}) => (
  <GlassCard variant="soft" style={styles.card}>
    <View style={[styles.avatar, shadows.glow]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="profileAvatarGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.gradPrimaryStart} />
            <Stop offset="1" stopColor={colors.gradPrimaryEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={32} fill="url(#profileAvatarGrad)" />
      </Svg>
      <AppText variant="h2" color={colors.white}>
        {avatarLabel}
      </AppText>
    </View>
    <View style={styles.info}>
      <AppText variant="h3" numberOfLines={1}>
        {displayName}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} numberOfLines={1} style={styles.email}>
        {email}
      </AppText>
      <View style={styles.badge}>
        <AppText variant="captionStrong" color={colors.primary}>
          {accountType}
        </AppText>
      </View>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  info: {
    flex: 1,
  },
  email: {
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});

export default ProfileCard;
