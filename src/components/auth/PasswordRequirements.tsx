import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

const REQUIREMENTS = [
  { key: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  {
    key: 'upper',
    label: 'One uppercase letter',
    test: (p: string) => /[A-Z]/.test(p),
  },
  { key: 'number', label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  {
    key: 'special',
    label: 'One special character',
    test: (p: string) => /[#?!@$%^&*-]/.test(p),
  },
] as const;

type PasswordRequirementsProps = {
  password: string;
};

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Password Requirements</Text>
    {REQUIREMENTS.map(({ key, label, test }) => {
      const met = test(password);
      return (
        <View key={key} style={styles.row}>
          <View style={[styles.bullet, met && styles.bulletMet]} />
          <Text style={[styles.label, met && styles.labelMet]}>{label}</Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    ...textFont.boldS,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textGrey,
  },
  bulletMet: {
    backgroundColor: colors.success,
  },
  label: {
    ...textFont.regularS,
    color: colors.textGrey,
  },
  labelMet: {
    color: colors.textSecondary,
  },
});

export default PasswordRequirements;
