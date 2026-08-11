import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Icon from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { shadows } from '../../themes/shadows';

type QuickActionCardProps = {
  onPress: () => void;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({ onPress }) => (
  <AnimatedPressable
    style={[styles.card, shadows.md]}
    onPress={onPress}
    pressScale={0.98}
    enforceTouchTarget={false}
  >
    <View style={styles.badge}>
      <AppText variant="micro" color={colors.ctaText}>
        NEW
      </AppText>
    </View>
    <View style={styles.row}>
      <View style={[styles.iconBox, shadows.glow]}>
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id="quickActionGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.gradPrimaryStart} />
              <Stop offset="1" stopColor={colors.gradPrimaryEnd} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={radii.md} fill="url(#quickActionGrad)" />
        </Svg>
        <Icon name="add-circle" width={24} height={24} stroke={colors.white} />
      </View>
      <View style={styles.textBlock}>
        <AppText variant="title">Add New Device</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Connect smart devices to your home
        </AppText>
      </View>
      <View style={styles.arrowButton}>
        <Icon name="arrow-next" width={16} height={16} fill={colors.textPrimary} />
      </View>
    </View>
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.cta,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radii.xs,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth * 1.5,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuickActionCard;
