import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Horizontal screen padding (spacing.md). Disable for full-bleed layouts. */
  padded?: boolean;
}

// Top-level screen wrapper: safe areas, theme background, keyboard avoidance.
// Uses logical layout only — no left/right values, so RTL mirrors automatically.
export function Screen({ children, style, padded = true }: ScreenProps) {
  const { colors, spacing } = useTheme();
  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View
          style={[styles.flex, padded && { paddingHorizontal: spacing.md }, style]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
