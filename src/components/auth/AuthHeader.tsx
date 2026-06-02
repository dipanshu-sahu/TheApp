import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { textFont } from '../../utils/textFont';

type AuthHeaderVariant = 'login' | 'signup';

type AuthHeaderProps = {
  variant: AuthHeaderVariant;
  title: string;
  subtitle: string;
};

const AuthHeader: React.FC<AuthHeaderProps> = ({ variant, title, subtitle }) => (
  <View style={styles.wrapper}>
    <View
      style={[
        styles.badge,
        variant === 'login' ? styles.badgeLogin : styles.badgeSignup,
      ]}
    >
      <Text style={styles.badgeEmoji}>🏠</Text>
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeLogin: {
    backgroundColor: colors.authBadgeBlue,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  badgeSignup: {
    backgroundColor: colors.authBadgeGreen,
    shadowColor: colors.signupGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  title: {
    ...textFont.boldXXL,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...textFont.regularM,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default AuthHeader;
