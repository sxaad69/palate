import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface ChipProps {
  label: string;
  style?: ViewStyle;
}

// Small pill tag, e.g. cuisine labels like "Levantine" or "Gulf".
// Text uses textPrimary (not accent) so contrast holds on the tinted
// background in both light and dark mode.
export function Chip({ label, style }: ChipProps) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.accentMuted,
          borderRadius: radii.full,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text variant="caption">{label}</Text>
    </View>
  );
}
