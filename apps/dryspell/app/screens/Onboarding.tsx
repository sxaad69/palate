import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety, type Habit } from '../store/sobriety';

// Three quick steps, no account, no friction: habit → daily spend → start
// date. Skippable — the counter can start with defaults.

const HABITS: Habit[] = ['alcohol', 'smoking', 'other'];

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { completeOnboarding } = useSobriety();
  const [step, setStep] = useState(0);
  const [habit, setHabit] = useState<Habit>('alcohol');
  const [spend, setSpend] = useState('');
  const [daysAgo, setDaysAgo] = useState(0);

  const habitLabel = (h: Habit) =>
    h === 'alcohol' ? t.obHabitAlcohol : h === 'smoking' ? t.obHabitSmoking : t.obHabitOther;

  const startDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  })();

  const finish = (skip: boolean) => {
    completeOnboarding({
      habit,
      dailySpend: skip ? 0 : Math.max(0, parseFloat(spend) || 0),
      currency: t.currency,
      startDate,
    });
    onDone();
  };

  return (
    <Screen>
      <View style={[styles.flex, { paddingTop: spacing['2xl'] }]}>
        {step === 0 && (
          <>
            <Text variant="display" style={{ marginBottom: spacing.sm }}>{t.obTitle}</Text>
            <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.xl }}>
              {t.obSubtitle}
            </Text>
            <Text variant="h3" style={{ marginBottom: spacing.md }}>{t.obHabitQ}</Text>
            <View style={styles.row}>
              {HABITS.map((h) => (
                <Chip key={h} label={habitLabel(h)} selected={habit === h} onPress={() => setHabit(h)} />
              ))}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text variant="h1" style={{ marginBottom: spacing.md }}>{t.obSpendQ}</Text>
            <Card>
              <View style={styles.spendRow}>
                <Text variant="display" color="textTertiary">{t.currency}</Text>
                <TextInput
                  value={spend}
                  onChangeText={(v) => setSpend(v.replace(/[^0-9.]/g, ''))}
                  keyboardType="decimal-pad"
                  placeholder="10"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
                  accessibilityLabel={t.obSpendQ}
                />
              </View>
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            <Text variant="h1" style={{ marginBottom: spacing.md }}>{t.obDateQ}</Text>
            <Card>
              <View style={styles.dateRow}>
                <Button title="−" variant="secondary" onPress={() => setDaysAgo((d) => Math.min(3650, d + 1))} style={styles.stepper} />
                <View style={{ alignItems: 'center' }}>
                  <Text variant="h2">{startDate}</Text>
                  <Text variant="caption" color="textSecondary">
                    {daysAgo === 0 ? t.obToday : daysAgo === 1 ? t.obYesterday : `${daysAgo} ${t.msDays}`}
                  </Text>
                </View>
                <Button title="+" variant="secondary" onPress={() => setDaysAgo((d) => Math.max(0, d - 1))} style={styles.stepper} />
              </View>
            </Card>
          </>
        )}

        <View style={{ flex: 1 }} />
        <Button
          title={step < 2 ? t.commonContinue : t.obStart}
          onPress={() => (step < 2 ? setStep(step + 1) : finish(false))}
        />
        <Button title={t.obSkip} variant="ghost" onPress={() => finish(true)} style={{ marginTop: spacing.sm }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  spendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    borderBottomWidth: 1,
    paddingVertical: 4,
    textAlign: 'left',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { minWidth: 56, paddingHorizontal: 0 },
});
