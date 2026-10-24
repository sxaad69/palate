import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

// React Native's core SafeAreaView does not apply the top inset on
// Android in this setup, so top-edge titles render under the status
// bar and Maestro cannot assert them (E2E run 40105712924: the
// Alerts "Use soon" title sits in the status-bar strip). Add the
// status-bar height explicitly on Android — same fix as
// fable/shadowtalk/modestfit/posturecheck/meetbrief.
const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

// Top-level screen wrapper: safe areas + theme background.
export function Screen({
  children,
  scroll = true,
  style,
  keyboardShouldPersistTaps,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
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
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
