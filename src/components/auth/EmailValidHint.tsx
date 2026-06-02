import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import Icon from '../Icon';

const EmailValidHint: React.FC = () => (
  <View style={styles.wrapper}>
    <Icon name="check-circle" width={16} height={16} />
    <Text style={styles.text}>Valid email format</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  text: {
    ...textFont.regularS,
    color: colors.success,
  },
});

export default EmailValidHint;
