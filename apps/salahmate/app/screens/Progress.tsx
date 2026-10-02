import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings, prayerName } from '../lib/strings';
import { useSalah } from '../store/salah';
import { TRACKED_PRAYERS } from '../lib/prayer';

// Week view: prayers prayed per day + perfect-day streak + habit streaks.
export function ProgressScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, locale } = useStrings();
  const { prayerLogs, prayerStreak, weekPrayerCount, habitsToday } = useSalah();

  const today = new Date().toISOString().slice(0, 10);
  const days: { date: string; count: number; label: string }[] = [];
  for (let d = 6; d >= 0; d--) {
    const dt = new Date(today + 'T12:00:00Z');
    dt.setUTCDate(dt.getUTCDate() - d);
    const date = dt.toISOString().slice(0, 10);
    days.push({
      date,
      count: prayerLogs.filter((l) => l.date === date).length,
      label: dt.toLocaleDateString(undefined, { weekday: 'narrow' }),
    });
  }

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.pgTitle}</Text>

        <View
          style={[
            styles.hero,
            { backgroundColor: colors.accentMuted, borderRadius: radii.xl, padding: spacing.lg },
          ]}
        >
          <Text variant="display" color="accent">{weekPrayerCount}<Text variant="h2" color="textSecondary">/35</Text></Text>
          <Text variant="body" color="textSecondary">{t.pgPrayerWeek}</Text>
        </View>

        <Card tone="action" style={{ marginTop: spacing.md }}>
          <Text variant="display" color="highlight">🌙 {prayerStreak}</Text>
          <Text variant="body" color="textSecondary">{t.pgStreak}</Text>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.bars}>
            {days.map((d) => (
              <View key={d.date} style={styles.barCol}>
                <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: d.count === 5 ? colors.success : d.count >= 3 ? colors.warning : colors.danger,
                        height: `${(d.count / 5) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>{d.label}</Text>
                <Text variant="caption" color="textSecondary">{d.count}/5</Text>
              </View>
            ))}
          </View>
        </Card>

        {habitsToday.length > 0 && (
          <>
            <Text variant="h3" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>{t.hbTitle}</Text>
            {habitsToday.map(({ habit, streak }) => (
              <Card key={habit.id} style={{ marginBottom: spacing.sm }}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '500' }}>{habit.name}</Text>
                    <Text variant="caption" color="textSecondary">
                      {prayerName(habit.anchorPrayer, t, locale)}
                    </Text>
                  </View>
                  <Text variant="h3" color="highlight">🔥 {streak}</Text>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  bars: { flexDirection: 'row', justifyContent: 'space-between' },
  barCol: { alignItems: 'center', flex: 1 },
  barTrack: { width: 28, height: 120, borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
});
