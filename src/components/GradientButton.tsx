import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { textFont } from '../utils/textFont';
import { colors } from '../themes/colors';
import Icon from './Icon';

type GradientTone = 'primary' | 'success';

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  isDisable?: boolean;
  style?: StyleProp<ViewStyle>;
  tone?: GradientTone;
}

const gradientIconByTone: Record<GradientTone, 'button-gradient' | 'button-gradient-green'> = {
  primary: 'button-gradient',
  success: 'button-gradient-green',
};

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  isDisable,
  style,
  tone = 'primary',
}) => (
  <TouchableOpacity
    style={[styles.button, style, isDisable && styles.disabled]}
    onPress={onPress}
    disabled={isDisable}
    activeOpacity={0.85}
  >
    {!isDisable && (
      <View style={StyleSheet.absoluteFill}>
        <Icon
          name={gradientIconByTone[tone]}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
      </View>
    )}
    <View style={styles.label}>
      <Text style={{ ...textFont.boldM, color: colors.textPrimary }}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.lineGrey,
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GradientButton;
