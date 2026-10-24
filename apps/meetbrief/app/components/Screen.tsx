import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

// React Native's core SafeAreaView does not apply the top inset on
// Android in this setup, so top-edge controls (the detail back
// chevron) render under the status bar and taps land in the system
// strip (E2E run 40075220662). Add the status-bar height explicitly
// on Android — same fix as fable/shadowtalk/modestfit/posturecheck.
const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

// Top-level screen wrapper: safe areas + theme background.
// scroll=true for content screens; record-style screens pass scroll=false.
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
