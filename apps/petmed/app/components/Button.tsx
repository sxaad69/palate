import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from './PawText';

type Variant = 'primary' | 'dose' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// `dose` = the big warm-amber "give the dose" action. Its background
// (doseAction) is tuned for light text in BOTH themes (see theme files).
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  style,
  accessibilityLabel,
}: Props) {
  const { colors, spacing, radii } = useTheme();

  const paddings: Record<Size, number> = { sm: spacing.sm, md: spacing.md, lg: spacing.lg };

  const bg =
    variant === 'primary'
      ? colors.accent
      : variant === 'dose'
        ? colors.doseAction
        : variant === 'destructive'
          ? colors.danger
          : variant === 'secondary'
            ? colors.surfaceAlt
            : 'transparent';
  const fg =
    variant === 'primary' || variant === 'dose' || variant === 'destructive'
      ? colors.textInverse
      : variant === 'secondary'
        ? colors.textPrimary
        : colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      android_ripple={{ color: colors.overlay }}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          paddingVertical: paddings[size],
          paddingHorizontal: spacing.lg,
          borderRadius: radii.full,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed || disabled ? 0.72 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: colors.borderStrong,
          minHeight: 48,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <PawText variant={size === 'sm' ? 'bodySmall' : 'body'} color={fg}>
          {title}
        </PawText>
      )}
    </Pressable>
  );
}
