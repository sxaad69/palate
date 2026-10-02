import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';

// Stats cards + per-recipe week dots. ponytail: no chart library for v1.
export function ProgressScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, recipes, stats, streakFor, weekDotsFor } = useApp();

  const active = recipes.filter((r) => !r.archived);
  const cards = [
    { label: t.totalWins, value: String(stats.totalWins) },
    { label: t.activeRecipes, value: String(stats.activeRecipes) },
    { label: t.bestStreak, value: String(stats.bestStreak) },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.progress}
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          {cards.map((c) => (
            <Card key={c.label} style={{ flex: 1, alignItems: 'center' }}>
              <Text variant="h1" color="accent">{c.value}</Text>
              <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
                {c.label}
              </Text>
            </Card>
          ))}
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.thisWeek}</Text>
        {active.map((r) => (
          <Card key={r.id} style={{ marginBottom: spacing.sm }}>
            <Text variant="body" numberOfLines={1}>
              {r.behavior}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, alignItems: 'center' }}>
              {weekDotsFor(r.id).map((d) => (
                <View
                  key={d.date}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: radii.full,
                    backgroundColor: d.done ? colors.accent : colors.surfaceAlt,
                    borderWidth: 1,
                    borderColor: d.done ? colors.accent : colors.border,
                  }}
                  accessibilityLabel={`${d.date}: ${d.done ? 'done' : 'not done'}`}
                />
              ))}
              <Text variant="caption" color="textTertiary" style={{ marginStart: spacing.xs }}>
                {streakFor(r.id)} {t.streak}
              </Text>
            </View>
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
