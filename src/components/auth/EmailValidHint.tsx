import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import AppText from '../ui/AppText';
import { fadeIn } from '../ui/motion';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import Icon from '../Icon';

const EmailValidHint: React.FC = () => (
  <Animated.View entering={fadeIn} style={styles.wrapper}>
    <Icon name="check-circle" width={16} height={16} color={colors.success} />
    <AppText variant="caption" color={colors.success}>
      Valid email format
    </AppText>
  </Animated.View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xs,
  },
});

export default EmailValidHint;
