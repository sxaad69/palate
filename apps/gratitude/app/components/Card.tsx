import React from 'react';
import { View, StyleProp, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

// Themed card with platform-correct elevation.
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radii } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.lg,
          ...(Platform.OS === 'ios'
            ? { shadowColor: '#3A2A1A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }
            : { elevation: 2 }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
