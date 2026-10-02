import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useHome } from '../store/home';
import { CATEGORIES } from '../data/tasks';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';

// What the house costs to keep healthy.
export default function CostsScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { completions, tasks, pro } = useHome();

  const year = new Date().getFullYear();
  const withCost = completions.filter((c) => c.cost > 0);
  const yearCost = withCost
    .filter((c) => new Date(c.at).getFullYear() === year)
    .reduce((a, c) => a + c.cost, 0);
  const totalCost = withCost.reduce((a, c) => a + c.cost, 0);

  const titleOf = (id: string) => {
    const task = tasks.find((x) => x.id === id);
    if (!task) return id;
    return t.dir === 'rtl' ? task.titleAr : task.titleEn;
  };

  // Annual insights (Plus): spend by category this year.
  const byCat = CATEGORIES.map((cat) => {
    const sum = withCost
      .filter((c) => {
        const task = tasks.find((x) => x.id === c.taskId);
        return task?.category === cat.id && new Date(c.at).getFullYear() === year;
      })
      .reduce((a, c) => a + c.cost, 0);
    return { cat, sum };
  }).filter((x) => x.sum > 0);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="h1">{t.costs}</Text>
        <View style={styles.statRow}>
          <Card style={styles.stat}>
            <Text variant="h1" align="center">${Math.round(yearCost)}</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.spentYear}</Text>
          </Card>
          <Card style={styles.stat}>
            <Text variant="h1" align="center">${Math.round(totalCost)}</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.totalSpent}</Text>
          </Card>
        </View>

        {pro ? (
          byCat.length > 0 ? (
            byCat.map(({ cat, sum }) => (
              <Card key={cat.id} style={styles.row}>
                <Text variant="body">{t.dir === 'rtl' ? cat.ar : cat.en}</Text>
                <Text variant="h3">${Math.round(sum)}</Text>
              </Card>
            ))
          ) : (
            <Text variant="body" style={{ color: colors.textTertiary }}>{t.noCosts}</Text>
          )
        ) : (
          <Pressable onPress={onPaywall}>
            <Card tone="action">
              <Text variant="body" align="center">{t.plusInsights}</Text>
            </Card>
          </Pressable>
        )}

        {withCost.slice(0, 30).map((c) => (
          <Card key={c.id} style={styles.row}>
            <View style={styles.info}>
              <Text variant="body" numberOfLines={1}>{titleOf(c.taskId)}</Text>
              <Text variant="caption" style={{ color: colors.textTertiary }}>
                {new Date(c.at).toLocaleDateString(t.dir === 'rtl' ? 'ar' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <Text variant="h3">${c.cost}</Text>
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  info: { flex: 1, gap: 2 },
});
