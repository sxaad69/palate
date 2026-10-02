import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings, CURRENCIES, type Currency } from '../lib/strings';
import { useLedger } from '../store/ledger';

// Two questions, no account: currency + tax set-aside %. Done.
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { spacing } = useTheme();
  const { t } = useStrings();
  const { completeOnboarding } = useLedger();
  const [currency, setCurrency] = useState<Currency>('$');
  const [taxRate, setTaxRate] = useState(25);

  return (
    <Screen>
      <View style={[styles.flex, { paddingTop: spacing['2xl'] }]}>
        <Text variant="display" style={{ marginBottom: spacing.sm }}>{t.obTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.xl }}>
          {t.obSubtitle}
        </Text>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.obCurrencyQ}</Text>
        <View style={[styles.row, { marginBottom: spacing.xl }]}>
          {CURRENCIES.map((c) => (
            <Chip key={c} label={c} selected={currency === c} onPress={() => setCurrency(c)} />
          ))}
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.obTaxQ}</Text>
        <View style={styles.stepperRow}>
          <Button title="−" variant="secondary" onPress={() => setTaxRate((r) => Math.max(0, r - 5))} style={styles.stepper} />
          <Text variant="display">{taxRate}%</Text>
          <Button title="+" variant="secondary" onPress={() => setTaxRate((r) => Math.min(50, r + 5))} style={styles.stepper} />
        </View>
        <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>
          {t.obTaxHint}
        </Text>

        <View style={{ flex: 1 }} />
        <Button
          title={t.obStart}
          onPress={() => {
            completeOnboarding({ currency, taxRate });
            onDone();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { minWidth: 56, paddingHorizontal: 0 },
});
