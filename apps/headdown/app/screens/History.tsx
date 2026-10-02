import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useFocus, focusScore } from '../store/focus';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';

function dayLabel(iso: string, rtl: boolean): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString(rtl ? 'ar' : 'en-US', { weekday: 'short' });
}

// History + 7-day chart + aggregate stats.
export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { sessions, streak, pro } = useFocus();
  const visible = pro ? sessions : sessions.slice(0, 30);

  const completed = sessions.filter((s) => s.completed);
  const avg = completed.length === 0 ? null : Math.round(
    (completed.reduce((a, s) => a + focusScore(s), 0) / completed.length) * 100,
  );
  const totalSec = completed.reduce((a, s) => a + s.focusedSec, 0);

  const days: { key: string; min: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const min = Math.round(
      sessions
        .filter((s) => new Date(s.startedAt).toISOString().slice(0, 10) === key && s.completed)
        .reduce((a, s) => a + s.focusedSec, 0) / 60,
    );
    days.push({ key, min });
  }
  const maxMin = Math.max(1, ...days.map((d) => d.min));

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text variant="h1">{t.history}</Text>
          {streak > 0 && (
            <View style={[styles.streakChip, { backgroundColor: colors.highlightMuted }]}>
              <Text variant="body">🔥 {streak}</Text>
            </View>
          )}
        </View>

        <View style={styles.statRow}>
          <Card style={styles.stat}>
            <Text variant="h2" align="center">{avg === null ? '—' : `${avg}%`}</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.avgScore}</Text>
          </Card>
          <Card style={styles.stat}>
            <Text variant="h2" align="center">{Math.round(totalSec / 3600 * 10) / 10}h</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.totalDeep}</Text>
          </Card>
        </View>

        <Text variant="h3">{t.last7}</Text>
        <Card style={styles.chart}>
          {days.map((d) => (
            <View key={d.key} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.round((d.min / maxMin) * 100)}%`, backgroundColor: colors.accent },
                  ]}
                />
              </View>
              <Text variant="caption" style={{ color: colors.textTertiary }}>{dayLabel(d.key, t.dir === 'rtl')}</Text>
            </View>
          ))}
        </Card>

        {visible.length === 0 ? (
          <Card>
            <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{t.noSessions}</Text>
          </Card>
        ) : (
          visible.map((s) => (
            <Card key={s.id} style={styles.sessRow}>
              <View style={styles.sessInfo}>
                <Text variant="body" numberOfLines={1}>{s.label || '—'}</Text>
                <Text variant="caption" style={{ color: colors.textTertiary }}>
                  {new Date(s.startedAt).toLocaleDateString(t.dir === 'rtl' ? 'ar' : 'en-US', { month: 'short', day: 'numeric' })}
                  {' · '}{Math.round(s.plannedSec / 60)}{t.min}
                  {' · '}{s.strictBroken ? t.broken : s.completed ? t.completed : t.ended}
                </Text>
              </View>
              <Text variant="h3" style={{ color: colors.accent }}>{Math.round(focusScore(s) * 100)}%</Text>
            </Card>
          ))
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 140 },
  barCol: { alignItems: 'center', gap: spacing.xs, flex: 1 },
  barTrack: { height: 96, width: 20, justifyContent: 'flex-end', backgroundColor: 'transparent' },
  barFill: { width: 20, borderRadius: 6, minHeight: 4 },
  sessRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  sessInfo: { flex: 1, gap: 2 },
});
