import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { RestoryText } from './RestoryText';

// Journal card: themed surface with platform-correct elevation.
// Optional overline heading for sectioned cards.
export function Card({
  children,
  heading,
  style,
}: {
  children: React.ReactNode;
  heading?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.lg,
          padding: spacing.md,
        },
        style,
      ]}
    >
      {heading ? (
        <RestoryText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
          {heading}
        </RestoryText>
      ) : null}
      {children}
    </View>
  );
}
