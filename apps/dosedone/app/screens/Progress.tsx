import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useMeds } from '../store/meds';

// Weekly adherence: one big number, a streak, and a 7-day bar row.
// Big, glanceable, encouraging — never shaming.
export function ProgressScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t } = useStrings();
  const { adherencePct, streakDays, meds, logs } = useMeds();

  const today = new Date().toISOString().slice(0, 10);
  const days: { date: string; pct: number; label: string }[] = [];
  for (let d = 6; d >= 0; d--) {
    const dt = new Date(today + 'T12:00:00Z');
    dt.setUTCDate(dt.getUTCDate() - d);
    const date = dt.toISOString().slice(0, 10);
    let taken = 0;
    let scheduled = 0;
    for (const med of meds) {
      if (date < med.createdDate) continue;
      for (const time of med.times) {
        if (new Date(`${date}T${time}:00`).getTime() + 2 * 3600 * 1000 > Date.now()) continue;
        scheduled++;
        if (logs.some((l) => l.medId === med.id && l.date === date && l.time === time)) taken++;
      }
    }
    days.push({
      date,
      pct: scheduled === 0 ? 0 : Math.round((taken / scheduled) * 100),
      label: dt.toLocaleDateString(undefined, { weekday: 'narrow' }),
    });
  }

  const hasData = meds.length > 0;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md }}>{t.adhTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>{t.adhWeek}</Text>

        {!hasData ? (
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
            {t.adhEmpty}
          </Text>
        ) : (
          <>
            <View
              style={[
                styles.hero,
                { backgroundColor: colors.accentMuted, borderRadius: radii.xl, padding: spacing.lg },
              ]}
            >
              <Text variant="display" color="accent">{adherencePct}%</Text>
              <Text variant="body" color="textSecondary">{t.adhPercent}</Text>
            </View>

            <Card tone="action" style={{ marginTop: spacing.md }}>
              <Text variant="display" color="highlight">🔥 {streakDays}</Text>
              <Text variant="body" color="textSecondary">{t.adhStreakDays}</Text>
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
                            backgroundColor: d.pct >= 80 ? colors.success : d.pct >= 50 ? colors.warning : colors.danger,
                            height: `${d.pct}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>{d.label}</Text>
                  </View>
                ))}
              </View>
            </Card>
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
});
