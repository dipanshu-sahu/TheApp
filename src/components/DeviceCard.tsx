import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './ui/AppText';
import AnimatedPressable from './ui/AnimatedPressable';
import { colors } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';

type DeviceCardProps = {
  name: string;
  location?: string;
  status?: string;
  onPress?: () => void;
};

const DeviceCard: React.FC<DeviceCardProps> = ({ name, location, status, onPress }) => (
  <AnimatedPressable style={styles.card} onPress={onPress} pressScale={0.98} enforceTouchTarget={false}>
    <View style={styles.info}>
      <AppText variant="bodyLg">{name}</AppText>
      {location ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {location}
        </AppText>
      ) : null}
    </View>
    {status ? (
      <AppText variant="body" color={colors.warning}>
        {status}
      </AppText>
    ) : null}
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    gap: 2,
  },
});

export default DeviceCard;
