import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from './PawText';

// Bottom-sheet style modal wrapper: drag-free v1, just a close button.
export function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <PawText variant="h2">{title}</PawText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="close"
          onPress={onClose}
          hitSlop={12}
          style={{ padding: spacing.sm, borderRadius: radii.full, backgroundColor: colors.surfaceAlt }}
        >
          <PawText variant="h3">✕</PawText>
        </Pressable>
      </View>
      <View style={{ flex: 1, padding: spacing.md }}>{children}</View>
    </SafeAreaView>
  );
}
