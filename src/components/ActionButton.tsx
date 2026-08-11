import React from 'react';
import Button from './ui/Button';

interface ActionButtonProps {
  title: string;
  bgColor?: string;
  textColor?: string;
  onPress?: () => void;
  isDisable?: boolean;
  variant?: 'gradient' | 'solid';
}

/** Legacy action button API, now backed by the shared Button primitive. */
const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  isDisable,
  variant = 'gradient',
}) => (
  <Button
    title={title}
    onPress={onPress}
    disabled={isDisable}
    variant={variant === 'gradient' ? 'primary' : 'outline'}
  />
);

export default ActionButton;
