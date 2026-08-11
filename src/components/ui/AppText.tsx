import React from 'react';
import { Text, TextProps, TextStyle, StyleProp } from 'react-native';
import { colors } from '../../themes/colors';
import { typography, TypographyToken } from '../../themes/typography';

export interface AppTextProps extends TextProps {
  variant?: TypographyToken;
  color?: string;
  align?: TextStyle['textAlign'];
  weight?: 'regular' | 'bold';
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

/** Typography-driven Text. Always prefer this over raw <Text>. */
const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = colors.textPrimary,
  align,
  weight,
  style,
  children,
  ...rest
}) => {
  const base = typography[variant];
  const weightStyle: TextStyle | undefined = weight
    ? { fontFamily: weight === 'bold' ? typography.bodyStrong.fontFamily : typography.body.fontFamily }
    : undefined;

  return (
    <Text
      style={[base, { color }, align ? { textAlign: align } : null, weightStyle, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default AppText;
