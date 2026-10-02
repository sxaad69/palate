import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { presetById } from '../data/presets';

function fmtDate(ms: number, language: string): string {
  return new Date(ms).toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
    month: 'short',
    day: 'numeric',
  });
}

function fmtHours(ms: number): string {
  return `${Math.round((ms / 3_600_000) * 10) / 10}h`;
}

// Stats cards + fast log. ponytail: one screen, no charts library for v1.
export function HistoryScreen() {
  const { colors, spacing } = useTheme();
  const { t, language, fasts, stats } = useApp();

  const cards = [
    { label: t.totalFasts, value: String(stats.totalFasts) },
    { label: t.totalHours, value: String(stats.totalHours) },
    { label: t.longestFast, value: `${stats.longestHours}h` },
    { label: t.completion, value: `${Math.round(stats.completionRate * 100)}%` },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.stats}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {cards.map((c) => (
            <Card key={c.label} style={{ flex: 1, minWidth: '44%', alignItems: 'center' }}>
              <Text variant="h1" color="accent">{c.value}</Text>
              <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
                {c.label}
              </Text>
            </Card>
          ))}
        </View>

        <Text variant="h1" style={{ marginBottom: spacing.sm }}>{t.history}</Text>
        {fasts.length === 0 && (
          <Card>
            <Text variant="bodySmall" color="textSecondary">{t.noFasts}</Text>
          </Card>
        )}
        {fasts.map((f) => {
          const preset = presetById(f.presetId);
          return (
            <Card key={f.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text variant="body">
                    {language === 'ar' ? preset.nameAr : preset.nameEn} · {fmtHours(f.endedAt - f.startedAt)}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {fmtDate(f.startedAt, language)} · {t.of} {f.targetHours}{t.hours}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: f.completed ? colors.accentMuted : colors.surfaceAlt,
                    borderRadius: 9999,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                  }}
                >
                  <Text variant="caption" color={f.completed ? 'accent' : 'textSecondary'}>
                    {f.completed ? t.completed : t.ended}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
