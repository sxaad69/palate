import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings, prayerName } from '../lib/strings';
import { useSalah } from '../store/salah';
import {
  PRAYER_ORDER,
  TRACKED_PRAYERS,
  getPrayerTimes,
  nextPrayer,
  formatTime,
  formatCountdown,
  type PrayerKey,
} from '../lib/prayer';

function PrayerRow({
  prayer,
  time,
  done,
  onToggle,
}: {
  prayer: PrayerKey;
  time: Date;
  done: boolean;
  onToggle: () => void;
}) {
  const { spacing } = useTheme();
  const { t, locale } = useStrings();
  const trackable = TRACKED_PRAYERS.includes(prayer);
  return (
    <Pressable
      onPress={trackable ? onToggle : undefined}
      disabled={!trackable}
      accessibilityRole={trackable ? 'checkbox' : undefined}
      accessibilityState={trackable ? { checked: done } : undefined}
      accessibilityLabel={prayerName(prayer, t, locale)}
    >
      <View style={[styles.row, { paddingVertical: spacing.sm, opacity: done ? 0.55 : 1 }]}>
        <View style={[styles.check, { borderColor: done ? '#15803D' : '#D6D3D1', backgroundColor: done ? '#15803D' : 'transparent' }]}>
          {done && <Text variant="body" color="textInverse">✓</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h3">{prayerName(prayer, t, locale)}</Text>
        </View>
        <Text variant="h3" color="textSecondary" style={{ fontVariant: ['tabular-nums'] }}>
          {formatTime(time)}
        </Text>
      </View>
    </Pressable>
  );
}

export function TodayScreen({ onAddHabit }: { onAddHabit: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { t, locale } = useStrings();
  const { lat, lng, methodId, prayedToday, togglePrayer, habitsToday, toggleHabit, todayScore } =
    useSalah();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const { times, tomorrow } = useMemo(() => {
    const todayDate = new Date(now);
    const tomorrowDate = new Date(now + 86400000);
    return {
      times: getPrayerTimes(lat, lng, methodId, todayDate),
      tomorrow: getPrayerTimes(lat, lng, methodId, tomorrowDate),
    };
  }, [lat, lng, methodId, Math.floor(now / 3600000)]);

  const next = nextPrayer(times, tomorrow, new Date(now));

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Next prayer hero */}
        <View
          style={[
            styles.hero,
            { backgroundColor: colors.accentMuted, borderRadius: radii.xl, padding: spacing.lg, marginTop: spacing.md },
          ]}
        >
          <Text variant="overline" color="accent">{t.tdNext}</Text>
          <Text variant="display" color="accent">{prayerName(next.key, t, locale)}</Text>
          <Text variant="h1" color="textPrimary" style={{ fontVariant: ['tabular-nums'] }}>
            {formatTime(next.time)}
          </Text>
          <Text variant="body" color="textSecondary">
            {t.tdIn} {formatCountdown(next.inMs)}
          </Text>
        </View>

        {/* Day score */}
        {todayScore.total > 0 && (
          <Card tone="action" style={{ marginTop: spacing.md }}>
            <View style={styles.row}>
              <Text variant="h3" style={{ flex: 1 }}>{t.pgScore}</Text>
              <Text variant="h2" color="highlight">
                {todayScore.done}/{todayScore.total}
              </Text>
            </View>
            <View style={[styles.progress, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.highlight,
                    width: `${todayScore.total === 0 ? 0 : (todayScore.done / todayScore.total) * 100}%`,
                  },
                ]}
              />
            </View>
          </Card>
        )}

        {/* Prayers */}
        <Text variant="h3" style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>{t.tdToday}</Text>
        <Card>
          {PRAYER_ORDER.map((p, i) => (
            <View key={p} style={i < PRAYER_ORDER.length - 1 && styles.divider}>
              <PrayerRow
                prayer={p}
                time={times[p]}
                done={prayedToday.includes(p)}
                onToggle={() => togglePrayer(p)}
              />
            </View>
          ))}
        </Card>

        {/* Anchored habits */}
        <View style={[styles.row, { marginTop: spacing.lg, marginBottom: spacing.xs }]}>
          <Text variant="h3" style={{ flex: 1 }}>{t.tdHabits}</Text>
          <Button title={`+ ${t.hbAdd}`} variant="ghost" onPress={onAddHabit} />
        </View>
        {habitsToday.length === 0 ? (
          <Text variant="body" color="textSecondary">{t.tdHabitsEmpty}</Text>
        ) : (
          habitsToday.map(({ habit, done, streak }) => (
            <Pressable
              key={habit.id}
              onPress={() => toggleHabit(habit.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={habit.name}
            >
              <Card style={{ marginBottom: spacing.sm, opacity: done ? 0.6 : 1 }}>
                <View style={styles.row}>
                  <View style={[styles.check, { borderColor: done ? colors.highlight : colors.borderStrong, backgroundColor: done ? colors.highlight : 'transparent' }]}>
                    {done && <Text variant="body" color="textInverse">✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '500' }}>{habit.name}</Text>
                    <Text variant="caption" color="textSecondary">
                      {t.hbAnchor} {prayerName(habit.anchorPrayer, t, locale)}
                      {streak > 0 ? ` · 🔥 ${streak}` : ''}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E0E3F8' },
  progress: { height: 8, borderRadius: 9999, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 9999 },
});
