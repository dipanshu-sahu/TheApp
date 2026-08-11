import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AnimatedPressable from '../ui/AnimatedPressable';
import AppText from '../ui/AppText';
import { colors } from '../../themes/colors';
import { spacing } from '../../themes/spacing';
import Icon from '../Icon';

type AuthBackLinkProps = {
  label?: string;
  onPress?: () => void;
};

const AuthBackLink: React.FC<AuthBackLinkProps> = ({
  label = 'Back to Login',
  onPress,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate('Login' as never);
  };

  return (
    <AnimatedPressable style={styles.wrapper} onPress={handlePress} pressScale={0.95}>
      <Icon name="arrow-back" width={18} height={18} fill={colors.textSecondary} />
      <AppText variant="bodyLg" color={colors.textSecondary}>
        {label}
      </AppText>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },
});

export default AuthBackLink;
