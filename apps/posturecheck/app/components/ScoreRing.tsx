import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PostureText } from './PostureText';

function ringColor(score: number, colors: ReturnType<typeof useTheme>['colors']): string {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.warning;
  return colors.danger;
}

// Score ring: number inside a colored circle. Color = severity band.
export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const { colors } = useTheme();
  const c = ringColor(score, colors);
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Score ${score} of 100`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: Math.max(6, size / 14),
        borderColor: c,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
      }}
    >
      <PostureText variant={size >= 110 ? 'display' : 'h1'} color={c}>
        {score}
      </PostureText>
      <PostureText variant="caption" color={colors.textTertiary}>
        / 100
      </PostureText>
    </View>
  );
}
