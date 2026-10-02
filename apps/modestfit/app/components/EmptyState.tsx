import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { MFText } from './MFText';
import { Button } from './Button';

export function EmptyState({
  glyph,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  glyph: string;
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
      <MFText variant="display" color={colors.textTertiary}>
        {glyph}
      </MFText>
      <MFText variant="h3" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
        {title}
      </MFText>
      <MFText
        variant="bodySmall"
        color={colors.textSecondary}
        style={{ marginTop: spacing.xs, textAlign: 'center' }}
      >
        {desc}
      </MFText>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: spacing.md }} />
      )}
    </View>
  );
}
