import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type TermsCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
};

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onToggle }) => (
  <TouchableOpacity
    style={styles.wrapper}
    onPress={onToggle}
    activeOpacity={0.8}
  >
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.text}>
      I agree to the{' '}
      <Text style={styles.link}>Terms of Service</Text>
      {' & '}
      <Text style={styles.link}>Privacy Policy</Text>
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.lineGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  boxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  text: {
    ...textFont.regularS,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  link: {
    color: colors.link,
    ...textFont.boldS,
  },
});

export default TermsCheckbox;
