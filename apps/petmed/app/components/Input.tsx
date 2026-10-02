import React, { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from './PawText';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
}

// Label above the field (never placeholder-as-label), error below.
export function Input({ label, error, style, ...rest }: Props) {
  const { colors, spacing, radii } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: spacing.md }}>
      <PawText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
        {label}
      </PawText>
      <TextInput
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCorrect={false}
        style={[
          {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error ? colors.danger : focused ? colors.accent : colors.border,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 48,
            fontSize: 16,
            color: colors.textPrimary,
          },
          style,
        ]}
        {...rest}
      />
      {!!error && (
        <PawText variant="bodySmall" color={colors.danger} style={{ marginTop: spacing.xs }}>
          {error}
        </PawText>
      )}
    </View>
  );
}
