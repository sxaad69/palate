import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { RestoryText } from '../components/RestoryText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useRestory, type DayEntry } from '../store/app';
import { t } from '../lib/i18n';
import { PaywallScreen } from './PaywallScreen';

// Streaks, totals, history. Free keeps the last 7 days; Pro keeps the
// whole story — the monetization line for a journal.
const FACES = ['😞', '😕', '🙂', '😄', '🤩'];
const FREE_HISTORY_DAYS = 7;

function HistoryRow({ entry, lang }: { entry: DayEntry; lang: string }) {
  const { colors, spacing } = useTheme();
  const d = new Date(`${entry.date}T12:00:00`);
  const dateLine = d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return (
    <View
      style={[styles.rowItem, { borderBottomColor: colors.border, paddingVertical: spacing.sm }]}
    >
      <RestoryText variant="bodySmall" color={colors.textTertiary} style={styles.dateCol}>
        {dateLine}
      </RestoryText>
      <View style={styles.rowBody}>
        <View style={styles.rowLine}>
          {entry.mood !== null ? (
            <RestoryText variant="h3">
              {FACES[entry.mood - 1]} <RestoryText variant="bodySmall" color={colors.textSecondary}>{entry.mood}/5</RestoryText>
            </RestoryText>
          ) : (
            <RestoryText variant="bodySmall" color={colors.textTertiary}>—</RestoryText>
          )}
          {entry.sleepQuality !== null ? (
            <RestoryText variant="bodySmall" color={colors.accent}>
              {'★'.repeat(entry.sleepQuality)}
              <RestoryText color={colors.borderStrong}>{'★'.repeat(5 - entry.sleepQuality)}</RestoryText>
            </RestoryText>
          ) : null}
        </View>
        {entry.note ? (
          <RestoryText variant="bodySmall" color={colors.textSecondary} numberOfLines={1}>
            {entry.note}
          </RestoryText>
        ) : null}
      </View>
    </View>
  );
}

export function ProgressScreen() {
  const { colors, spacing, radii } = useTheme();
  const { streak, totalCheckIns, nightsLogged, entries, lang, isPro } = useRestory();
  const [showPaywall, setShowPaywall] = useState(false);
  const s = t();

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  const sorted = [...entries]
    .filter((e) => e.mood !== null || e.sleepQuality !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
  const visible = isPro ? sorted : sorted.slice(0, FREE_HISTORY_DAYS);
  const hasMore = !isPro && sorted.length > FREE_HISTORY_DAYS;

  const stats: Array<{ value: string; label: string }> = [
    { value: String(streak), label: s.dayStreak },
    { value: String(totalCheckIns), label: s.checkIns },
    { value: String(nightsLogged), label: s.nightsLogged },
  ];

  return (
    <Screen>
      <RestoryText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        {s.progress}
      </RestoryText>

      <View style={styles.row}>
        {stats.map((st) => (
          <View
            key={st.label}
            style={[
              styles.stat,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.lg,
                padding: spacing.md,
              },
            ]}
          >
            <RestoryText variant="display" color={colors.accent}>
              {st.value}
            </RestoryText>
            <RestoryText variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              {st.label}
            </RestoryText>
          </View>
        ))}
      </View>

      <RestoryText variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        {s.history}
      </RestoryText>

      {visible.length === 0 ? (
        <Card>
          <RestoryText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            {s.noEntriesYet}
          </RestoryText>
        </Card>
      ) : (
        visible.map((e) => <HistoryRow key={e.date} entry={e} lang={lang} />)
      )}

      {hasMore ? (
        <Card style={{ marginTop: spacing.md, alignItems: 'center' }}>
          <RestoryText variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: spacing.md }}>
            {s.freeHistoryCap}
          </RestoryText>
          <Button title={s.unlockPro} size="sm" onPress={() => setShowPaywall(true)} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, borderWidth: 1, alignItems: 'center', gap: 4 },
  rowItem: { borderBottomWidth: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  dateCol: { width: 84 },
  rowBody: { flex: 1, gap: 2 },
  rowLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
