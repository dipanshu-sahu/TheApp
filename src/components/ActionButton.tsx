import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { textFont } from '../utils/textFont';
import { colors } from '../themes/colors';
import GradientButton from './GradientButton';

interface ActionButtonProps {
  title: string;
  bgColor?: string;
  textColor?: string;
  onPress?: () => void;
  isDisable?: boolean;
  variant?: 'gradient' | 'solid';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  bgColor = colors.secondary,
  textColor = colors.textPrimary,
  onPress,
  isDisable,
  variant = 'gradient',
}) => {
  if (variant === 'gradient') {
    return (
      <GradientButton title={title} onPress={onPress} isDisable={isDisable} />
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isDisable ? colors.lineGrey : bgColor },
      ]}
      onPress={onPress}
      disabled={isDisable}
    >
      <Text style={{ ...textFont.regularS, color: textColor }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActionButton;
