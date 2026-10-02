import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { RestoryText } from '../components/RestoryText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useRestory } from '../store/app';
import { isRTL, t } from '../lib/i18n';
import {
  avgBedtimeOnGoodNights,
  avgHoursOnGoodNights,
  buildRestStory,
  moodLiftAfterGoodSleep,
  weekSeries,
} from '../lib/insights';
import { PaywallScreen } from './PaywallScreen';

// The wedge vs Daylio: the mood↔sleep correlation, computed on-device.
// Pro-gated — the insight needs history depth to be meaningful.

function Locked() {
  const { colors, spacing } = useTheme();
  const [showPaywall, setShowPaywall] = useState(false);
  const s = t();

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  return (
    <Screen scroll={false}>
      <View style={[styles.locked, { padding: spacing.lg }]}>
        <RestoryText variant="display" color={colors.accent}>
          ◍
        </RestoryText>
        <RestoryText variant="h2" style={[styles.center, { marginTop: spacing.md }]}>
          {s.proLockedTitle}
        </RestoryText>
        <RestoryText
          variant="body"
          color={colors.textSecondary}
          style={[styles.center, { marginTop: spacing.sm, marginBottom: spacing.xl }]}
        >
          {s.proLockedBody}
        </RestoryText>
        <Button title={s.unlockPro} onPress={() => setShowPaywall(true)} size="lg" />
      </View>
    </Screen>
  );
}

const BAR_H = 110;

function WeekChart({ metric }: { metric: 'mood' | 'sleep' }) {
  const { colors, spacing } = useTheme();
  const { entries, lang } = useRestory();
  const days = weekSeries(entries, 7, lang);

  return (
    <View style={[styles.chart, { flexDirection: isRTL() ? 'row-reverse' : 'row', marginTop: spacing.md }]}>
      {days.map((d) => {
        const v = metric === 'mood' ? d.mood : d.sleep;
        return (
          <View key={d.date} style={styles.col}>
            <View style={[styles.barTrack, { height: BAR_H }]}>
              {v === null ? (
                <View style={[styles.dot, { backgroundColor: colors.borderStrong }]} />
              ) : (
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(8, (v / 5) * BAR_H),
                      backgroundColor: metric === 'mood' ? colors.accent : colors.info,
                    },
                  ]}
                />
              )}
            </View>
            <RestoryText variant="caption" color={colors.textTertiary} style={{ marginTop: 4 }}>
              {d.label}
            </RestoryText>
          </View>
        );
      })}
    </View>
  );
}

export function InsightsScreen() {
  const { colors, spacing } = useTheme();
  const { entries, lang, isPro } = useRestory();
  const [metric, setMetric] = useState<'mood' | 'sleep'>('mood');
  const s = t();

  if (!isPro) return <Locked />;

  const lift = moodLiftAfterGoodSleep(entries);
  const bedtime = avgBedtimeOnGoodNights(entries);
  const hours = avgHoursOnGoodNights(entries);
  const story = buildRestStory(entries, lang);

  return (
    <Screen>
      <RestoryText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        {s.insights}
      </RestoryText>

      <Card heading={s.sleepMoodLink} style={{ marginBottom: spacing.md }}>
        {lift.lift !== null ? (
          <>
            <RestoryText variant="display" color={colors.accent}>
              +{lift.lift.toFixed(1)}
            </RestoryText>
            <RestoryText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
              {s.liftSuffix}
            </RestoryText>
          </>
        ) : (
          <RestoryText variant="body" color={colors.textSecondary}>
            {s.notEnoughData}
          </RestoryText>
        )}
      </Card>

      <Card heading={s.yourSweetSpot} style={{ marginBottom: spacing.md }}>
        {bedtime !== null || hours !== null ? (
          <>
            {bedtime !== null ? (
              <View style={styles.kv}>
                <RestoryText variant="body" color={colors.textSecondary}>
                  {s.avgBedtimeGoodNights}
                </RestoryText>
                <RestoryText variant="h2" color={colors.accent}>
                  {bedtime}
                </RestoryText>
              </View>
            ) : null}
            {hours !== null ? (
              <View style={[styles.kv, { marginTop: spacing.sm }]}>
                <RestoryText variant="body" color={colors.textSecondary}>
                  {s.avgSleepLength}
                </RestoryText>
                <RestoryText variant="h2" color={colors.accent}>
                  {hours.toFixed(1)}
                  {s.hoursShort}
                </RestoryText>
              </View>
            ) : null}
          </>
        ) : (
          <RestoryText variant="body" color={colors.textSecondary}>
            {s.notEnoughData}
          </RestoryText>
        )}
      </Card>

      <Card heading={s.thisWeek} style={{ marginBottom: spacing.md }}>
        <View style={[styles.tabs, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}>
          {(['mood', 'sleep'] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMetric(m)}
              accessibilityRole="button"
              accessibilityState={{ selected: metric === m }}
              style={[
                styles.tab,
                {
                  backgroundColor: metric === m ? colors.accentMuted : 'transparent',
                  borderRadius: 999,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              <RestoryText
                variant="bodySmall"
                color={metric === m ? colors.textPrimary : colors.textTertiary}
              >
                {m === 'mood' ? s.moodTab : s.sleepTab}
              </RestoryText>
            </Pressable>
          ))}
        </View>
        <WeekChart metric={metric} />
      </Card>

      <Card heading={s.restStory}>
        <RestoryText variant="body" color={colors.textSecondary} style={{ lineHeight: 26 }}>
          {story}
        </RestoryText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  locked: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  center: { textAlign: 'center' },
  kv: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabs: { gap: 8 },
  tab: { alignItems: 'center' },
  chart: { justifyContent: 'space-between' },
  col: { flex: 1, alignItems: 'center' },
  barTrack: { justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 22, borderRadius: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginBottom: 2 },
});
