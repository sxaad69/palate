import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from './PawText';
import { Button } from './Button';

interface Props {
  icon: string;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Every empty state: icon + one line + primary action. No bare "No items".
export function EmptyState({ icon, title, body, actionLabel, onAction }: Props) {
  const { spacing } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing['2xl'], paddingHorizontal: spacing.lg }}>
      <PawText variant="display">{icon}</PawText>
      <PawText variant="h3" style={{ marginTop: spacing.md, textAlign: 'center' }}>
        {title}
      </PawText>
      <PawText variant="bodySmall" style={{ marginTop: spacing.xs, textAlign: 'center', opacity: 0.75 }}>
        {body}
      </PawText>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: spacing.md }} />
      )}
    </View>
  );
}
