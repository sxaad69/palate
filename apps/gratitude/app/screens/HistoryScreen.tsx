import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTG, weekStart, weekLabel, type DayEntry } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { PaywallScreen } from './PaywallScreen';

function prettyDay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
  const lang = getLang();
  return dt.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function HistoryScreen() {
  const { colors, spacing, radii } = useTheme();
  const { weekEntries, weekStarts, isPro, entries } = useTG();
  const [selected, setSelected] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  if (entries.length === 0) {
    return (
      <Screen>
        <AppText variant="h1" style={{ marginTop: spacing.md }}>
          {t().historyTitle}
        </AppText>
        <Card style={{ padding: spacing.xl, marginTop: spacing.lg }}>
          <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            {t().noEntries}
          </AppText>
        </Card>
      </Screen>
    );
  }

  const current = weekStart(Date.now());
  const weeks = weekStarts();

  const renderDay = (e: DayEntry) => {
    const open = selected === e.date;
    return (
      <Pressable
        key={e.date}
        onPress={() => setSelected(open ? null : e.date)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{ marginBottom: spacing.sm }}
      >
        <Card style={{ padding: spacing.md }}>
          <View style={styles.dayRow}>
            <AppText variant="body" style={{ fontWeight: '600' }}>
              {prettyDay(e.date)}
            </AppText>
            <AppText variant="body" color={colors.success}>
              {open ? '▾' : '▸'}
            </AppText>
          </View>
          {open &&
            e.items.map((item, i) => (
              <AppText key={i} variant="body" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
                · {item}
              </AppText>
            ))}
        </Card>
      </Pressable>
    );
  };

  return (
    <Screen>
      <AppText variant="h1" style={{ marginTop: spacing.md }}>
        {t().historyTitle}
      </AppText>

      {weeks.map((ws) => {
        const days = weekEntries(ws);
        const isCurrent = ws === current;
        if (!isCurrent && !isPro) {
          return (
            <Card key={ws} style={{ padding: spacing.lg, marginTop: spacing.lg, opacity: 0.85 }}>
              <AppText variant="h3" style={{ textAlign: 'center' }}>
                🔒 {t().weekOf} {weekLabel(ws)}
              </AppText>
              <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.sm }}>
                {t().pastLocked}
              </AppText>
              <View style={{ height: spacing.md }} />
              <Button title={t().unlockHistory} onPress={() => setShowPaywall(true)} />
            </Card>
          );
        }
        return (
          <View key={ws} style={{ marginTop: spacing.lg }}>
            <AppText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
              {isCurrent ? t().currentWeek : `${t().weekOf} ${weekLabel(ws)}`}
            </AppText>
            {days.map(renderDay)}
          </View>
        );
      })}
      <View style={{ height: spacing.md }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
