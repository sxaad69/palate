import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

// Core SafeAreaView applies no inset on Android, so with edge-to-edge the
// first title renders underneath the status bar. Add the inset explicitly.
const TOP_INSET = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

// Top-level screen wrapper: safe areas + theme background.
// scroll=true for content screens; pass scroll=false for custom layouts.
export function Screen({
  children,
  scroll = true,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing } = useTheme();
  if (!scroll) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background, paddingTop: TOP_INSET }, style]}>
        {children}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: TOP_INSET }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
