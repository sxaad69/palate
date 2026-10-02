import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { MeetText } from './MeetText';
import { Button } from './Button';

export function EmptyState({
  icon,
  title,
  body,
  actionTitle,
  onAction,
}: {
  icon: string;
  title: string;
  body: string;
  actionTitle?: string;
  onAction?: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing['2xl'], gap: spacing.sm }}>
      <MeetText variant="display">{icon}</MeetText>
      <MeetText variant="h3">{title}</MeetText>
      <MeetText variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center' }}>
        {body}
      </MeetText>
      {actionTitle && onAction && (
        <View style={{ marginTop: spacing.sm }}>
          <Button title={actionTitle} onPress={onAction} />
        </View>
      )}
    </View>
  );
}
