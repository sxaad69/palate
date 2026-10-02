import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useLedger } from '../store/ledger';
import { EXPENSE_CATEGORIES, categoryLabel, type ExpenseCategory } from '../data/categories';

export type TxKind = 'expense' | 'income';

const todayStr = () => new Date().toISOString().slice(0, 10);

export function AddTransactionScreen({
  initialKind,
  onSaved,
}: {
  initialKind: TxKind;
  onSaved: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { addTransaction, clients, currency } = useLedger();

  const [kind, setKind] = useState<TxKind>(initialKind);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [vendor, setVendor] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [daysAgo, setDaysAgo] = useState(0);
  const [deductible, setDeductible] = useState(false);
  const [saved, setSaved] = useState(false);

  const date = (() => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  })();

  const amountNum = parseFloat(amount) || 0;
  const canSave = amountNum > 0;

  const save = () => {
    if (!canSave) return;
    addTransaction({
      kind,
      amount: amountNum,
      category: kind === 'expense' ? category : null,
      vendor: vendor.trim(),
      clientId,
      date,
      deductible: kind === 'expense' && deductible,
    });
    setSaved(true);
    setTimeout(onSaved, 600);
  };

  if (saved) {
    return (
      <Screen>
        <View style={[styles.center, { paddingTop: spacing['3xl'] }]}>
          <Text variant="display" style={{ textAlign: 'center' }}>{t.fSaved}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {kind === 'expense' ? t.addExpense : t.addIncome}
        </Text>

        <View style={[styles.row, { marginBottom: spacing.md }]}>
          <Chip label={t.dashAddExpense} selected={kind === 'expense'} onPress={() => setKind('expense')} />
          <Chip label={t.dashAddIncome} selected={kind === 'income'} onPress={() => setKind('income')} />
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <Text variant="overline" color="textSecondary">{t.fAmount} ({currency})</Text>
          <TextInput
            value={amount}
            onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            style={[styles.amountInput, { color: colors.textPrimary }]}
            accessibilityLabel={t.fAmount}
            autoFocus
          />
        </Card>

        {kind === 'expense' && (
          <>
            <Text variant="overline" color="textSecondary">{t.fCategory}</Text>
            <View style={[styles.row, { marginVertical: spacing.sm }]}>
              {EXPENSE_CATEGORIES.map((c) => (
                <Chip key={c} label={categoryLabel(c, t)} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>
          </>
        )}

        <Text variant="overline" color="textSecondary">{t.fVendor}</Text>
        <TextInput
          value={vendor}
          onChangeText={setVendor}
          placeholder={kind === 'expense' ? t.fVendor : t.clName}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, marginBottom: spacing.md }]}
          accessibilityLabel={t.fVendor}
        />

        <Text variant="overline" color="textSecondary">{t.fClient}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          <Chip label={t.fNoClient} selected={clientId === null} onPress={() => setClientId(null)} />
          {clients.map((c) => (
            <Chip key={c.id} label={c.name} selected={clientId === c.id} onPress={() => setClientId(c.id)} />
          ))}
        </View>

        <Text variant="overline" color="textSecondary">{t.fDate}</Text>
        <View style={[styles.dateRow, { marginVertical: spacing.sm }]}>
          <Button title="−" variant="secondary" onPress={() => setDaysAgo((d) => Math.min(365, d + 1))} style={styles.stepper} />
          <Text variant="h3">{date}</Text>
          <Button title="+" variant="secondary" onPress={() => setDaysAgo((d) => Math.max(0, d - 1))} style={styles.stepper} />
        </View>

        {kind === 'expense' && (
          <Card style={[styles.deductRow, { marginVertical: spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Text variant="body" style={{ fontWeight: '500' }}>{t.fDeductible}</Text>
              <Text variant="caption" color="textSecondary">{t.fDeductibleHint}</Text>
            </View>
            <Switch value={deductible} onValueChange={setDeductible} trackColor={{ true: colors.accent }} />
          </Card>
        )}

        <Button title={t.fSave} onPress={save} disabled={!canSave} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  center: { flex: 1, alignItems: 'center' },
  amountInput: { fontSize: 40, fontWeight: '700', paddingVertical: 4 },
  input: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 8, marginTop: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { minWidth: 56, paddingHorizontal: 0 },
  deductRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
