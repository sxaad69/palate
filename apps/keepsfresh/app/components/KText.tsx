import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

type Variant = keyof typeof typography;

interface Props extends RNTextProps {
  variant?: Variant;
  color?: string;
  children: React.ReactNode;
}

export function KText({ variant = 'body', color, style, children, ...rest }: Props) {
  const { colors } = useTheme();
  const base: TextStyle = {
    ...typography[variant],
    color: color ?? colors.textPrimary,
  };
  return (
    <RNText style={[base, style]} {...rest}>
      {children}
    </RNText>
  );
}
