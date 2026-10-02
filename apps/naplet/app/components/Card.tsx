import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Elevated surface. iOS gets a soft shadow; Android gets elevation.
// In dark mode the lighter surface color carries the elevation instead.
export function Card({ children, style }: CardProps) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.md,
        },
        Platform.OS === 'android' ? { elevation: 2 } : styles.iosShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // ponytail: shadow color is platform-idiomatic black at low opacity, not a
  // theme token — the theme already handles dark-mode elevation via surfaces.
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
});
