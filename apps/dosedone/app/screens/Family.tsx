import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useMeds } from '../store/meds';

// Caregiver summary: big text, designed to be shown to family.
// "Here's how Mom did this week." A Plus feature.
export function FamilyScreen({ onPaywall }: { onPaywall: () => void }) {
  const { spacing, radii } = useTheme();
  const { t } = useStrings();
  const { pro, meds, logs, adherencePct, streakDays } = useMeds();

  if (!pro) {
    return (
      <Screen>
        <View style={{ paddingTop: spacing['2xl'] }}>
          <Text variant="h1" style={{ textAlign: 'center', marginBottom: spacing.sm }}>{t.cgTitle}</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
            {t.cgSubtitle}
          </Text>
          <Card tone="action">
            <Text variant="body" style={{ marginBottom: spacing.sm }}>{t.pwSubtitle}</Text>
            <Button title={t.sGoPlus} variant="action" onPress={onPaywall} />
          </Card>
        </View>
      </Screen>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(new Date(today + 'T12:00:00Z').getTime() - 6 * 86400000)
    .toISOString()
    .slice(0, 10);
  const weekLogs = logs.filter((l) => l.date >= weekAgo && l.date <= today);
  const taken = weekLogs.length;
  // Approximate scheduled: sum of daily doses × 7 (simple, honest estimate).
  const dailyDoses = meds.reduce((s, m) => s + m.times.length, 0);
  const missed = Math.max(0, dailyDoses * 7 - taken);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, textAlign: 'center' }}>{t.cgTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          {t.cgSubtitle}
        </Text>

        <Card style={[styles.big, { borderRadius: radii.xl, marginBottom: spacing.md }]}>
          <Text variant="display" color="success">{taken}</Text>
          <Text variant="h3">{t.cgTaken}</Text>
        </Card>
        <Card style={[styles.big, { borderRadius: radii.xl, marginBottom: spacing.md }]}>
          <Text variant="display" color={missed > 0 ? 'danger' : 'textSecondary'}>{missed}</Text>
          <Text variant="h3">{t.cgMissed}</Text>
        </Card>
        <Card tone="action" style={[styles.big, { borderRadius: radii.xl, marginBottom: spacing.md }]}>
          <Text variant="display" color="highlight">{adherencePct}%</Text>
          <Text variant="h3">{t.adhPercent}</Text>
        </Card>
        <Card style={[styles.big, { borderRadius: radii.xl }]}>
          <Text variant="display">🔥 {streakDays}</Text>
          <Text variant="h3">{t.adhStreakDays}</Text>
        </Card>

        <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.lg }}>
          {meds.length} {t.cgMeds}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { alignItems: 'center', padding: 24 },
});
