import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedPressable from '../ui/AnimatedPressable';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';

type AuthFooterLinkProps = {
  prefix: string;
  linkText: string;
  onPress: () => void;
};

const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({
  prefix,
  linkText,
  onPress,
}) => (
  <View style={styles.wrapper}>
    <AppText variant="bodyLg" color={colors.textSecondary}>
      {prefix}
    </AppText>
    <AnimatedPressable onPress={onPress} pressScale={0.95}>
      <AppText variant="bodyLgStrong" color={colors.link}>
        {linkText}
      </AppText>
    </AnimatedPressable>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.xxs,
  },
});

export default AuthFooterLink;
