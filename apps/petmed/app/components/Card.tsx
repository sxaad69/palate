import React from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accentBorder?: string; // optional left color-bar (pet color-coding)
}

export function Card({ children, style, accentBorder }: Props) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.border,
          ...(accentBorder
            ? { borderLeftWidth: 4, borderLeftColor: accentBorder }
            : null),
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
            },
            android: { elevation: 2 },
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
