import React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import {
  avgFeedIntervalMs,
  formatDuration,
  insightKeys,
  longestRecentStretch,
  summarizeDay,
} from '../lib/baby';

// Stats: day totals + sleep↔feeding insight cards. ponytail: no charts v1.
export function StatsScreen() {
  const { colors, spacing } = useTheme();
  const { t, events } = useApp();

  const today = new Date();
  const summary = summarizeDay(events, today);
  const insights = insightKeys(events);

  const insightText: Record<string, string> = {
    longStretch: t.insightLongStretch,
    frequentFeeds: t.insightFrequentFeeds,
    goodNight: t.insightGoodNight,
    startLogging: t.insightStartLogging,
  };

  const cards = [
    { label: t.totalSleep, value: formatDuration(summary.sleepMs) },
    { label: t.feedsToday, value: String(summary.feeds) },
    { label: t.diapersToday, value: String(summary.diapers) },
    { label: t.napsToday, value: String(summary.naps) },
  ];

  const stretch = longestRecentStretch(events);
  const interval = avgFeedIntervalMs(events, today);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.stats}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {cards.map((c) => (
            <Card key={c.label} style={{ flex: 1, minWidth: '45%', alignItems: 'center' }}>
              <Text variant="h1" color="accent">{c.value}</Text>
              <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
                {c.label}
              </Text>
            </Card>
          ))}
        </View>

        {stretch > 0 && (
          <Card style={{ marginBottom: spacing.sm }}>
            <Text variant="bodySmall" color="textSecondary">🌙 {t.lastSleep}</Text>
            <Text variant="h3" style={{ marginTop: spacing.xs }}>
              {formatDuration(stretch)}
            </Text>
          </Card>
        )}
        {interval != null && (
          <Card style={{ marginBottom: spacing.sm }}>
            <Text variant="bodySmall" color="textSecondary">🍼 {t.lastFeed}</Text>
            <Text variant="h3" style={{ marginTop: spacing.xs }}>
              {formatDuration(interval)}
            </Text>
          </Card>
        )}

        <Text variant="h3" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.insights}
        </Text>
        {insights.map((k) => (
          <Card
            key={k}
            style={{ marginBottom: spacing.sm, backgroundColor: colors.accentMuted }}
          >
            <Text variant="body">{insightText[k]}</Text>
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
