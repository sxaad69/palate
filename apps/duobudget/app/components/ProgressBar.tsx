import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

// Custom progress bar — ponytail: no chart lib for this.
export function ProgressBar({
  fraction,
  color,
  height = 10,
}: {
  fraction: number; // 0..1, clamped
  color: string;
  height?: number;
}) {
  const { colors, radii } = useTheme();
  const f = Math.max(0, Math.min(1, fraction));
  const over = f >= 1;
  return (
    <View
      style={{
        height,
        borderRadius: radii.full,
        backgroundColor: colors.surfaceAlt,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${f * 100}%`,
          borderRadius: radii.full,
          backgroundColor: over ? colors.danger : color,
        }}
      />
    </View>
  );
}
