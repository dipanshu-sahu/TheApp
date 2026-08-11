import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import AnimatedPressable from './ui/AnimatedPressable';
import { colors } from '../themes/colors';
import { radii } from '../themes/radii';
import { spacing } from '../themes/spacing';

type BackButtonHeaderProps = {
  onPress?: () => void;
};

const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ onPress }) => {
  const navigation = useNavigation();

  return (
    <AnimatedPressable
      onPress={onPress ?? (() => navigation.goBack())}
      style={styles.button}
      pressScale={0.9}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Icon name="arrow-back" width={22} height={22} fill={colors.textSecondary} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
});

export default BackButtonHeader;
