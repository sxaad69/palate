import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { RestoryText } from './RestoryText';
import { toMinutes, toHHMM } from '../lib/insights';

// Dependency-free time picker: ±15-minute steppers. Good enough for a
// sleep journal and keeps the <30s check-in fast.
export function TimeStepper({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const { colors, spacing, radii } = useTheme();

  const shift = (dir: 1 | -1) => {
    const m = toMinutes(value) ?? 0;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(toHHMM(m + dir * 15));
  };

  return (
    <View style={styles.root}>
      <RestoryText variant="bodySmall" color={colors.textSecondary}>
        {label}
      </RestoryText>
      <View style={[styles.stepper, { gap: spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: 15 minutes earlier`}
          onPress={() => shift(-1)}
          hitSlop={8}
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: colors.surfaceAlt,
              borderRadius: radii.full,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <RestoryText variant="h3" color={colors.textPrimary}>
            −
          </RestoryText>
        </Pressable>
        <RestoryText
          variant="h2"
          color={colors.textPrimary}
          style={[styles.time, { minWidth: 88, textAlign: 'center' }]}
        >
          {value}
        </RestoryText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: 15 minutes later`}
          onPress={() => shift(1)}
          hitSlop={8}
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: colors.surfaceAlt,
              borderRadius: radii.full,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <RestoryText variant="h3" color={colors.textPrimary}>
            +
          </RestoryText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: { fontVariant: ['tabular-nums'] },
});
