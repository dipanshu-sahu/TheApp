import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    ...textFont.boldM,
    color: colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
});

export default ProfileSection;
