import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from '../Icon';
import AppText from '../ui/AppText';
import AnimatedPressable from '../ui/AnimatedPressable';
import { colors, withAlpha } from '../../themes/colors';
import { radii } from '../../themes/radii';
import { spacing } from '../../themes/spacing';
import { DEVICE_CATEGORIES } from '../../utils/deviceDisplay';

const CategorySection: React.FC = () => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <AppText variant="h3">Add by Category</AppText>
      <AnimatedPressable pressScale={0.95} enforceTouchTarget={false}>
        <AppText variant="body" color={colors.link}>
          See All &gt;
        </AppText>
      </AnimatedPressable>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {DEVICE_CATEGORIES.map(category => (
        <AnimatedPressable key={category.id} style={styles.item} pressScale={0.92} enforceTouchTarget={false}>
          <View style={[styles.iconBox, { backgroundColor: withAlpha(category.tint, 0.14), borderColor: withAlpha(category.tint, 0.3) }]}>
            <Icon
              name={category.icon}
              width={24}
              height={24}
              color={category.tint}
              fill={category.tint}
              stroke={category.tint}
            />
          </View>
          <AppText variant="caption" color={colors.textSecondary} align="center">
            {category.label}
          </AppText>
        </AnimatedPressable>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  row: {
    gap: spacing.sm,
    paddingRight: spacing.xxs,
  },
  item: {
    width: 76,
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategorySection;
