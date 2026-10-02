import React from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// Small selectable pill — habit types, filters, quick picks.
export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        {
          borderRadius: radii.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderWidth: 1,
          borderColor: selected ? colors.accent : colors.border,
          backgroundColor: selected ? colors.accentMuted : 'transparent',
        },
        style,
      ]}
    >
      <Text
        variant="bodySmall"
        color={selected ? 'accent' : 'textSecondary'}
        style={{ fontWeight: '500' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
