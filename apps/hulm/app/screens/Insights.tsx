import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useDreams } from '../store/dreams';
import { SYMBOLS } from '../data/symbols';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

// Your patterns: recurring symbols, mood mix, totals. Plus-gated.
export default function InsightsScreen({
  onPaywall,
  onSymbol,
}: {
  onPaywall: () => void;
  onSymbol: (symbolId: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { dreams, pro, recurring, streak } = useDreams();
  const rtl = t.dir === 'rtl';

  if (!pro) {
    return (
      <Screen padded>
        <View style={styles.locked}>
          <Text variant="display">🔮</Text>
          <Text variant="h2" align="center">{t.insights}</Text>
          <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
            {t.plusLocked}
          </Text>
          <Button title={t.upgrade} onPress={onPaywall} variant="primary" />
        </View>
      </Screen>
    );
  }

  const moods = {
    good: dreams.filter((d) => d.mood === 'good').length,
    neutral: dreams.filter((d) => d.mood === 'neutral').length,
    bad: dreams.filter((d) => d.mood === 'bad').length,
  };

  const name = (id: string) => {
    const s = SYMBOLS.find((x) => x.id === id);
    return s ? (rtl ? s.ar : s.en) : id;
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="h1">{t.insights}</Text>
        <View style={styles.statRow}>
          <Card style={styles.stat}>
            <Text variant="h1" align="center">{dreams.length}</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.totalDreams}</Text>
          </Card>
          <Card style={styles.stat}>
            <Text variant="h1" align="center">{streak}</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.dayStreak}</Text>
          </Card>
        </View>

        <Text variant="h3">{t.recurring}</Text>
        {recurring.length === 0 ? (
          <Text variant="body" style={{ color: colors.textTertiary }}>{t.noData}</Text>
        ) : (
          recurring.map((r) => (
            <Pressable key={r.symbolId} onPress={() => onSymbol(r.symbolId)}>
              <Card style={styles.row}>
                <Text variant="body">{name(r.symbolId)}</Text>
                <Text variant="h3" style={{ color: colors.accent }}>
                  {r.count} {t.times}
                </Text>
              </Card>
            </Pressable>
          ))
        )}

        <Text variant="h3">{t.moodMix}</Text>
        <Card style={styles.moods}>
          <MoodRow emoji="😌" label={t.moodGood} n={moods.good} total={dreams.length} />
          <MoodRow emoji="😐" label={t.moodNeutral} n={moods.neutral} total={dreams.length} />
          <MoodRow emoji="😟" label={t.moodBad} n={moods.bad} total={dreams.length} />
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function MoodRow({ emoji, label, n, total }: { emoji: string; label: string; n: number; total: number }) {
  const { colors } = useTheme();
  const pct = total === 0 ? 0 : Math.round((n / total) * 100);
  return (
    <View style={styles.moodRow}>
      <Text variant="body">{emoji} {label}</Text>
      <Text variant="body" style={{ color: colors.textSecondary }}>{n} ({pct}%)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  locked: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moods: { gap: spacing.sm },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
