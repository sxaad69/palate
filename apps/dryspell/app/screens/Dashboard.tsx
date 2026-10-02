import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety } from '../store/sobriety';
import { nextMilestone } from '../data/milestones';
import { encouragementForDay } from '../data/encouragement';

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function formatMoney(currency: string, amount: number) {
  return `${currency}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function DashboardScreen({
  onSOS,
  onGoals,
  onPaywall,
}: {
  onSOS: () => void;
  onGoals: () => void;
  onPaywall: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { t, locale } = useStrings();
  const { daysClean, secondsClean, moneySaved, currency, pledgeDate, pledgeToday, pro, goals } =
    useSobriety();

  const days = Math.floor(secondsClean / 86400);
  const hours = Math.floor((secondsClean % 86400) / 3600);
  const mins = Math.floor((secondsClean % 3600) / 60);
  const secs = secondsClean % 60;

  const todayStr = new Date().toISOString().slice(0, 10);
  const pledged = pledgeDate === todayStr;
  const milestone = nextMilestone(daysClean);
  const encouragement = encouragementForDay(daysClean);
  const quote = locale === 'ar' ? encouragement.ar : encouragement.en;

  const fundedGoals = goals.filter((g) => moneySaved >= g.target).length;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Counter hero — dawn sky */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.accentMuted,
              borderRadius: radii.xl,
              padding: spacing.lg,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text variant="overline" color="accent">
            {daysClean === 1 ? t.dashDay : t.dashDays}
          </Text>
          <Text variant="display" color="accent" style={styles.counter}>
            {days}
          </Text>
          <Text variant="h2" color="textPrimary" style={{ fontVariant: ['tabular-nums'] }}>
            {pad(hours)}:{pad(mins)}:{pad(secs)}
          </Text>
          <Text variant="caption" color="textSecondary">
            {hours} {t.dashHours} · {mins} {t.dashMins} · {secs} {t.dashSecs}
          </Text>
        </View>

        {/* Money saved — gold */}
        <Card tone="gold" style={{ marginTop: spacing.md }}>
          <Text variant="overline" color="highlight">{t.dashSaved}</Text>
          <Text variant="h1" color="highlight" style={{ marginTop: spacing.xs }}>
            {formatMoney(currency, moneySaved)}
          </Text>
          {pro || goals.length > 0 ? (
            <Text variant="bodySmall" color="textSecondary" style={{ marginTop: spacing.xs }}>
              {t.goalTitle}: {fundedGoals}/{goals.length} ✓
            </Text>
          ) : (
            <Button
              title={t.goalTitle}
              variant="gold"
              onPress={onGoals}
              style={{ marginTop: spacing.sm }}
            />
          )}
        </Card>

        {/* Next milestone */}
        {milestone && (
          <Card style={{ marginTop: spacing.md }}>
            <Text variant="overline" color="textSecondary">{t.dashNextMilestone}</Text>
            <Text variant="h3" style={{ marginTop: spacing.xs }}>
              {locale === 'ar' ? milestone.titleAr : milestone.titleEn}
            </Text>
            <Text variant="bodySmall" color="textSecondary">
              {t.msIn} {milestone.days - daysClean} {t.msDays}
            </Text>
            <View style={[styles.progress, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.accent,
                    width: `${Math.min(100, (daysClean / milestone.days) * 100)}%`,
                  },
                ]}
              />
            </View>
          </Card>
        )}

        {/* Daily pledge */}
        <Card style={{ marginTop: spacing.md }}>
          <Text variant="overline" color="textSecondary">{t.dashPledge}</Text>
          <Text variant="body" style={{ marginVertical: spacing.sm }}>
            {pledged ? t.dashPledgeDone : `“${t.dashPledgeText}”`}
          </Text>
          {!pledged && <Button title={t.dashPledge} onPress={pledgeToday} />}
        </Card>

        {/* Encouragement */}
        <Card style={{ marginTop: spacing.md }}>
          <Text variant="overline" color="textSecondary">{t.dashEncouragement}</Text>
          <Text variant="body" style={{ marginTop: spacing.xs, fontStyle: 'italic' }}>
            “{quote}”
          </Text>
        </Card>

        {/* SOS */}
        <Button
          title={`🆘 ${t.dashSOS}`}
          variant="secondary"
          onPress={onSOS}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  counter: { fontSize: 72, lineHeight: 84 },
  progress: { height: 8, borderRadius: 9999, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 9999 },
});
