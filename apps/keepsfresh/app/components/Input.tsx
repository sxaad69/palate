import React, { useState } from 'react';
import { TextInput, View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { KText } from './KText';

interface Props {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// Label above the field (never placeholder-as-label); error below with
// danger border. Correct keyboard type per field.
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error,
  style,
  accessibilityLabel,
}: Props) {
  const { colors, spacing, radii } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      {label ? (
        <KText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
          {label}
        </KText>
      ) : null}
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'default' ? 'sentences' : 'none'}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? colors.danger : focused ? colors.borderStrong : colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
          minHeight: 48,
        }}
      />
      {error ? (
        <KText variant="caption" color={colors.danger} style={{ marginTop: spacing.xs }}>
          {error}
        </KText>
      ) : null}
    </View>
  );
}
