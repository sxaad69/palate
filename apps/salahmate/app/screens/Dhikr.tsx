import React from 'react';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSalah, DHIKR_TARGETS } from '../store/salah';

// Dhikr counter: one giant tap target, selectable target, gentle vibration
// on completion. The count restarts each day.
export function DhikrScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useStrings();
  const { dhikrCount, dhikrTarget, incrementDhikr, resetDhikr, setDhikrTarget, pro } = useSalah();

  const complete = dhikrCount >= dhikrTarget;
  const pct = Math.min(100, (dhikrCount / dhikrTarget) * 100);

  const tap = () => {
    if (complete) return;
    const next = dhikrCount + 1;
    incrementDhikr();
    if (next >= dhikrTarget) Vibration.vibrate(400);
    else if (next % 33 === 0) Vibration.vibrate(50);
  };

  return (
    <Screen>
      <View style={[styles.flex, { paddingTop: spacing.md }]}>
        <Text variant="h1" style={{ textAlign: 'center' }}>{t.dkTitle}</Text>

        <Text variant="overline" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.lg }}>
          {t.dkTarget}
        </Text>
        <View style={[styles.row, { justifyContent: 'center', marginVertical: spacing.sm }]}>
          {DHIKR_TARGETS.map((n) => {
            const locked = n > 100 && !pro;
            return (
              <Chip
                key={n}
                label={locked ? `${n} 🔒` : String(n)}
                selected={dhikrTarget === n}
                onPress={() => !locked && setDhikrTarget(n)}
              />
            );
          })}
        </View>

        <Pressable
          onPress={tap}
          accessibilityRole="button"
          accessibilityLabel={`${t.dkTap}: ${dhikrCount}`}
          style={({ pressed }) => [
            styles.counter,
            {
              backgroundColor: complete ? colors.highlightMuted : colors.accentMuted,
              borderColor: complete ? colors.highlight : colors.accent,
              borderRadius: radii.full,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text variant="display" color={complete ? 'highlight' : 'accent'} style={styles.count}>
            {dhikrCount}
          </Text>
          <Text variant="body" color="textSecondary">
            {complete ? t.dkDone : `${t.dkTap} · ${dhikrTarget}`}
          </Text>
        </Pressable>

        <View style={[styles.progress, { backgroundColor: colors.surfaceAlt }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.highlight, width: `${pct}%` }]} />
        </View>

        <View style={{ flex: 1 }} />
        <Button title={t.dkReset} variant="ghost" onPress={resetDhikr} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  counter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  count: { fontSize: 64, lineHeight: 72 },
  progress: { height: 8, borderRadius: 9999, marginTop: 24, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 9999 },
});
