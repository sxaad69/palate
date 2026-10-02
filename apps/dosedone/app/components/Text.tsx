import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography, type TypographyVariant } from '../theme/typography';
import type { Colors } from '../theme/light';

interface AppTextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: keyof Colors;
}

// Themed text. Defaults to body / textPrimary; override via variant, color, style.
export function Text({
  variant = 'body',
  color = 'textPrimary',
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  return (
    <RNText style={[typography[variant], { color: colors[color] }, style]} {...rest} />
  );
}
