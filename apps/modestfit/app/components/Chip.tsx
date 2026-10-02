import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { MFText } from './MFText';

// Selectable pill — categories, occasions, preference options.
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      android_ripple={{ color: colors.overlay }}
      style={({ pressed }) => ({
        backgroundColor: selected ? colors.accent : colors.surfaceAlt,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radii.full,
        marginEnd: spacing.sm,
        marginBottom: spacing.sm,
        opacity: pressed ? 0.75 : 1,
        minHeight: 44,
        justifyContent: 'center',
      })}
    >
      <MFText
        variant="bodySmall"
        color={selected ? colors.textInverse : colors.textPrimary}
      >
        {label}
      </MFText>
    </Pressable>
  );
}
