import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Gold-tinted card for savings/celebration content. */
  tone?: 'default' | 'action';
}

// Themed surface with platform-correct elevation: shadows on iOS,
// elevation on Android; lighter surface on dark mode.
export function Card({ children, style, tone = 'default' }: CardProps) {
  const { colors, spacing, radii } = useTheme();
  const backgroundColor =
    tone === 'action' ? colors.highlightMuted : colors.surface;
  const borderColor = tone === 'action' ? colors.highlight : colors.border;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          borderRadius: radii.lg,
          padding: spacing.md,
        },
        Platform.OS === 'android' ? styles.elevation : styles.shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
  shadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  elevation: { elevation: 2 },
});
