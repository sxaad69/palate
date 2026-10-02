import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useLedger, formatMoney, type Transaction } from '../store/ledger';
import { categoryLabel } from '../data/categories';

function TxRow({ tx }: { tx: Transaction }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { currency, clients, deleteTransaction } = useLedger();
  const client = clients.find((c) => c.id === tx.clientId);
  const isIncome = tx.kind === 'income';
  return (
    <View style={[styles.row, { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontWeight: '500' }}>
          {tx.vendor || (tx.category ? categoryLabel(tx.category, t) : t.addIncome)}
        </Text>
        <Text variant="caption" color="textSecondary">
          {tx.date}
          {tx.category ? ` · ${categoryLabel(tx.category, t)}` : ''}
          {client ? ` · ${client.name}` : ''}
          {tx.deductible ? ' · ✓' : ''}
        </Text>
      </View>
      <Text variant="body" color={isIncome ? 'profit' : 'textPrimary'} style={{ fontWeight: '600' }}>
        {isIncome ? '+' : '−'}{formatMoney(currency, tx.amount)}
      </Text>
      <Pressable onPress={() => deleteTransaction(tx.id)} hitSlop={12} accessibilityRole="button" accessibilityLabel={t.commonDelete}>
        <Text variant="caption" color="textTertiary"> ✕</Text>
      </Pressable>
    </View>
  );
}

export function DashboardScreen({ onAdd }: { onAdd: (kind: 'expense' | 'income') => void }) {
  const { colors, spacing, radii } = useTheme();
  const { t } = useStrings();
  const {
    currency,
    monthIncome,
    monthExpenses,
    monthProfit,
    monthDeductible,
    taxShield,
    transactions,
  } = useLedger();

  const recent = transactions.slice(0, 8);
  const profitColor = monthProfit >= 0 ? 'profit' : 'danger';

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* P&L hero */}
        <View
          style={[
            styles.hero,
            { backgroundColor: colors.accentMuted, borderRadius: radii.xl, padding: spacing.lg, marginTop: spacing.md },
          ]}
        >
          <Text variant="overline" color="accent">{t.dashProfit}</Text>
          <Text variant="display" color={profitColor} style={styles.profit}>
            {formatMoney(currency, monthProfit)}
          </Text>
          <View style={styles.plRow}>
            <Text variant="bodySmall" color="textSecondary">
              {t.dashIncome}: <Text variant="bodySmall" color="profit" style={{ fontWeight: '600' }}>{formatMoney(currency, monthIncome)}</Text>
            </Text>
            <Text variant="bodySmall" color="textSecondary">
              {t.dashExpenses}: <Text variant="bodySmall" color="textPrimary" style={{ fontWeight: '600' }}>{formatMoney(currency, monthExpenses)}</Text>
            </Text>
          </View>
        </View>

        {/* Tax shield + deductible */}
        <View style={[styles.row2, { marginTop: spacing.md }]}>
          <Card tone="highlight" style={styles.half}>
            <Text variant="overline" color="highlight">{t.dashTaxShield}</Text>
            <Text variant="h2" color="highlight">{formatMoney(currency, taxShield)}</Text>
            <Text variant="caption" color="textSecondary">{t.dashTaxShieldHint}</Text>
          </Card>
          <Card style={styles.half}>
            <Text variant="overline" color="textSecondary">{t.dashDeductible}</Text>
            <Text variant="h2">{formatMoney(currency, monthDeductible)}</Text>
            <Text variant="caption" color="textSecondary">✓</Text>
          </Card>
        </View>

        {/* Quick add */}
        <View style={[styles.row2, { marginTop: spacing.md }]}>
          <Button title={`− ${t.dashAddExpense}`} variant="secondary" onPress={() => onAdd('expense')} style={styles.halfBtn} />
          <Button title={`+ ${t.dashAddIncome}`} variant="highlight" onPress={() => onAdd('income')} style={styles.halfBtn} />
        </View>

        {/* Recent */}
        <Text variant="h3" style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>{t.dashRecent}</Text>
        {recent.length === 0 ? (
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.md }}>
            {t.dashEmpty}
          </Text>
        ) : (
          <Card>
            {recent.map((tx) => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  profit: { fontSize: 44, lineHeight: 52, marginVertical: 4 },
  plRow: { flexDirection: 'row', gap: 16, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  row2: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  halfBtn: { flex: 1 },
});
