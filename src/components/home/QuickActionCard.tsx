import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../Icon';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type QuickActionCardProps = {
  onPress: () => void;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>NEW</Text>
    </View>
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Icon name="add-circle" width={24} height={24} stroke={colors.textPrimary} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Add New Device</Text>
        <Text style={styles.subtitle}>Connect smart devices to your home</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
      <Icon name="arrow-next" width={18} height={18} fill={colors.textPrimary} />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 16,
    marginBottom: 28,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: colors.badgeNew,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    ...textFont.boldXS,
    color: colors.textPrimary,
    fontSize: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingRight: 40,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    ...textFont.boldM,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...textFont.regularS,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  arrowButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuickActionCard;
