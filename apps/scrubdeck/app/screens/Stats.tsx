import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useStudy, isMastered } from '../store/study';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';

function Stat({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.stat}>
      <Text variant="h1" align="center">{value}</Text>
      <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{label}</Text>
    </Card>
  );
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { streak, totalReviews, days, gradeEvents, allDecks, progress } = useStudy();

  const weekAgo = Date.now() - 7 * 86_400_000;
  const recent = gradeEvents.filter((e) => e.at >= weekAgo);
  const retention = recent.length === 0 ? null : Math.round((recent.filter((e) => e.good).length / recent.length) * 100);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="h1">{t.stats}</Text>
        <View style={styles.grid}>
          <Stat value={String(streak)} label={t.dayStreak} />
          <Stat value={String(totalReviews)} label={t.totalReviews} />
          <Stat value={retention === null ? '—' : `${retention}%`} label={t.retention} />
          <Stat value={String(days.length)} label={t.activeDays} />
        </View>
        <Text variant="h3">{t.perDeck}</Text>
        {allDecks.map((deck) => {
          const mastered = deck.cards.filter((c) => isMastered(progress[c.id])).length;
          const pct = deck.cards.length === 0 ? 0 : mastered / deck.cards.length;
          return (
            <Card key={deck.id} style={styles.deckRow}>
              <View style={styles.deckInfo}>
                <Text variant="body">{t.dir === 'rtl' ? deck.titleAr : deck.titleEn}</Text>
                <View style={[styles.bar, { backgroundColor: colors.surfaceAlt }]}>
                  <View style={[styles.barFill, { width: `${Math.round(pct * 100)}%`, backgroundColor: colors.highlight }]} />
                </View>
              </View>
              <Text variant="caption" style={{ color: colors.textTertiary }}>
                {mastered}/{deck.cards.length}
              </Text>
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { flex: 1, minWidth: '46%', alignItems: 'center', gap: spacing.xs },
  deckRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deckInfo: { flex: 1, gap: spacing.xs },
  bar: { height: 8, borderRadius: radii.full, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: radii.full },
});
