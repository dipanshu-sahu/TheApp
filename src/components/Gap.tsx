import React from 'react';
import { View } from 'react-native';
import { spacing } from '../themes/spacing';

type GapSize = 'xs' | 's' | 'm' | 'l' | 'xl';

const GAP_SIZE: Record<GapSize, number> = {
  xs: spacing.xxs,
  s: spacing.xs,
  m: spacing.md,
  l: spacing.xl,
  xl: spacing.xxl,
};

const DEFAULT_HEIGHT = spacing.xxs + 2;

type GapProps = {
  orientation?: 'vertical' | 'horizontal';
  customHeight?: number;
  type?: GapSize;
};

const Gap: React.FC<GapProps> = ({ orientation, customHeight, type }) => {
  const size = customHeight ?? (type ? GAP_SIZE[type] : DEFAULT_HEIGHT);

  return (
    <View style={orientation === 'horizontal' ? { width: size } : { height: size }} />
  );
};

export default Gap;
