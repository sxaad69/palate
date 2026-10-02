import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from './PawText';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}

// Selectable pill — used for species, frequency, theme picks.
export function Chip({ label, selected, onPress, color }: Props) {
  const { colors, spacing, radii } = useTheme();
  const inner = (
    <View
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radii.full,
        backgroundColor: selected ? (color ?? colors.accentMuted) : colors.surfaceAlt,
        borderWidth: 1,
        borderColor: selected ? (color ?? colors.accent) : colors.border,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
        minHeight: 44,
        justifyContent: 'center',
      }}
    >
      <PawText
        variant="bodySmall"
        color={selected ? colors.textPrimary : colors.textSecondary}
        style={{ fontWeight: selected ? '700' : '400' }}
      >
        {label}
      </PawText>
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      onPress={onPress}
      android_ripple={{ color: colors.overlay }}
    >
      {inner}
    </Pressable>
  );
}
