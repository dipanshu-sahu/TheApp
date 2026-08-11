import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Button from './ui/Button';

type GradientTone = 'primary' | 'success';

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  isDisable?: boolean;
  style?: StyleProp<ViewStyle>;
  tone?: GradientTone;
}

/** Legacy gradient button API, now backed by the shared Button primitive. */
const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  isDisable,
  style,
  tone = 'primary',
}) => (
  <Button
    title={title}
    onPress={onPress}
    disabled={isDisable}
    variant={tone === 'success' ? 'secondary' : 'primary'}
    style={style}
  />
);

export default GradientButton;
