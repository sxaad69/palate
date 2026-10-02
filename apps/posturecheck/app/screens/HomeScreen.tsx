import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScoreRing } from '../components/ScoreRing';
import { Toggle } from '../components/Toggle';
import { usePosture, FREE_CHECKS_PER_MONTH } from '../store/app';
import { ensureNotifPermission } from '../lib/notifications';
import { t } from '../lib/i18n';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { colors, spacing } = useTheme();
  const nav = useNavigation<Nav>();
  const {
    latestCheck,
    avgScore,
    checks,
    totalExercisesDone,
    checksThisMonth,
    canCheck,
    isPro,
    reminders,
    setReminders,
  } = usePosture();
  const s = t();

  const startCheck = () => {
    if (canCheck) nav.navigate('Capture');
    else nav.navigate('Paywall');
  };

  const toggleReminders = async (v: boolean) => {
    if (v) {
      const ok = await ensureNotifPermission();
      if (!ok) return;
    }
    setReminders({ ...reminders, enabled: v });
  };

  const left = Math.max(0, FREE_CHECKS_PER_MONTH - checksThisMonth);

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <PostureText variant="h1">{s.appName}</PostureText>
      <PostureText variant="body" color={colors.textSecondary}>
        {s.tagline}
      </PostureText>
      <View style={{ height: spacing.lg }} />

      <Card style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
        {latestCheck ? (
          <>
            <PostureText variant="overline" color={colors.textTertiary}>
              {s.latestScore}
            </PostureText>
            <View style={{ height: spacing.sm }} />
            <ScoreRing score={latestCheck.score} />
          </>
        ) : (
          <>
            <PostureText variant="h3">{s.noChecksYet}</PostureText>
            <PostureText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.sm }}>
              {s.noChecksBody}
            </PostureText>
          </>
        )}
        <View style={{ height: spacing.md }} />
        <Button title={s.newCheck} size="lg" onPress={startCheck} style={{ alignSelf: 'stretch' }} />
        {!isPro && (
          <PostureText variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
            {left === 1 ? s.freeChecksLeftOne : `${left} ${s.checksLeft}`}
          </PostureText>
        )}
      </Card>

      <View style={{ height: spacing.md }} />

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {[
          { label: s.avgScore, value: avgScore !== null ? `${avgScore}` : '–' },
          { label: s.totalChecks, value: `${checks.length}` },
          { label: s.exercisesDone, value: `${totalExercisesDone}` },
        ].map((st) => (
          <Card key={st.label} style={{ flex: 1, alignItems: 'center' }}>
            <PostureText variant="h2" color={colors.accent}>
              {st.value}
            </PostureText>
            <PostureText variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              {st.label}
            </PostureText>
          </Card>
        ))}
      </View>

      <View style={{ height: spacing.md }} />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginEnd: spacing.md }}>
            <PostureText variant="h3">{s.remindersCardTitle}</PostureText>
            <PostureText variant="bodySmall" color={colors.textSecondary}>
              {s.remindersCardBody}
            </PostureText>
          </View>
          <Toggle value={reminders.enabled} onChange={toggleReminders} accessibilityLabel={s.reminders} />
        </View>
        {!isPro && (
          <View style={{ marginTop: spacing.md }}>
            <Button title={s.goPro} variant="secondary" onPress={() => nav.navigate('Paywall')} />
          </View>
        )}
      </Card>
    </Screen>
  );
}
