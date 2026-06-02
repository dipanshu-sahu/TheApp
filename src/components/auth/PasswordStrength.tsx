import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';
import { getPasswordStrength } from '../../utils/passwordStrength';

type PasswordStrengthProps = {
  password: string;
  hint?: string;
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  hint = 'Enter a strong password',
}) => {
  const strength = getPasswordStrength(password);

  return (
    <View style={styles.wrapper}>
      <View style={styles.bars}>
        {[0, 1, 2, 3].map(index => (
          <View
            key={index}
            style={[
              styles.bar,
              index < strength ? styles.barActive : styles.barInactive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  bars: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  barActive: {
    backgroundColor: colors.success,
  },
  barInactive: {
    backgroundColor: colors.lineGrey,
  },
  hint: {
    ...textFont.regularS,
    color: colors.textGrey,
  },
});

export default PasswordStrength;
