import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  accessibilityLabel,
}: Props) {
  const { colors, radii } = useTheme();

  const bg =
    variant === 'primary' ? colors.accent : variant === 'secondary' ? colors.accentMuted : 'transparent';
  const fg =
    variant === 'primary' ? colors.textInverse : variant === 'secondary' ? colors.textPrimary : colors.accent;

  const height = size === 'lg' ? 56 : size === 'sm' ? 40 : 48;
  const fontSize = size === 'lg' ? 17 : 16;

  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading }}
      android_ripple={{ color: 'rgba(0,0,0,0.12)' }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: radii.lg,
          height,
          opacity: disabled ? 0.45 : pressed && Platform.OS === 'ios' ? 0.82 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: colors.accent,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <AppText style={{ color: fg, fontSize, lineHeight: fontSize + 8, fontWeight: '600' }}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minWidth: 48,
    minHeight: 48,
  },
});
