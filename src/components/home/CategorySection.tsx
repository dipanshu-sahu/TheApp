import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { DEVICE_CATEGORIES } from '../../utils/deviceDisplay';

const CategorySection: React.FC = () => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <Text style={styles.title}>Add by Category</Text>
      <TouchableOpacity>
        <Text style={styles.seeAll}>See All &gt;</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {DEVICE_CATEGORIES.map(category => (
        <TouchableOpacity key={category.id} style={styles.item} activeOpacity={0.85}>
          <View
            style={[styles.iconBox, { backgroundColor: `${category.tint}22` }]}
          >
            <Icon
              name={category.icon}
              width={22}
              height={22}
              color={category.tint}
              fill={category.tint}
              stroke={category.tint}
            />
          </View>
          <Text style={styles.label}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    ...textFont.boldL,
    color: colors.textPrimary,
  },
  seeAll: {
    ...textFont.regularS,
    color: colors.link,
  },
  row: {
    gap: 12,
    paddingRight: 4,
  },
  item: {
    width: 76,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    ...textFont.regularS,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CategorySection;
