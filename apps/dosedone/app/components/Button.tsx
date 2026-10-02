import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'action';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// One button for the whole app. Android gets a native ripple, iOS gets an
// opacity press state. Minimum 48dp touch target per Material guidelines.
// `highlight` variant is reserved for money-positive CTAs (profit, savings).
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, spacing, radii } = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'action'
        ? colors.highlight
        : variant === 'secondary'
          ? colors.accentMuted
          : 'transparent';
  const labelColor =
    variant === 'primary' || variant === 'action'
      ? colors.textInverse
      : colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      android_ripple={
        Platform.OS === 'android' ? { color: colors.overlay } : undefined
      }
      style={({ pressed }) => [
        {
          backgroundColor,
          borderRadius: radii.lg,
          minHeight: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          opacity:
            isDisabled || (pressed && Platform.OS === 'ios') ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text variant="body" style={{ color: labelColor, fontWeight: '500' }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
