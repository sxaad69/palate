import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useLedger, formatMoney } from '../store/ledger';
import { EXPENSE_CATEGORIES, categoryLabel } from '../data/categories';

// Month P&L, deductible summary, category breakdown, and the one-tap CSV
// tax report (Plus) — the screen the accountant sees.
export function ReportsScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const {
    currency,
    monthKey,
    monthIncome,
    monthExpenses,
    monthProfit,
    monthDeductible,
    transactions,
    buildCsv,
    pro,
  } = useLedger();
  const [copied, setCopied] = useState(false);

  const monthTx = transactions.filter((x) => x.date.startsWith(monthKey) && x.kind === 'expense');
  const catTotals = EXPENSE_CATEGORIES.map((c) => ({
    cat: c,
    total: monthTx.filter((x) => x.category === c).reduce((s, x) => s + x.amount, 0),
  })).filter((x) => x.total > 0);
  const maxCat = Math.max(1, ...catTotals.map((x) => x.total));

  const exportCsv = async () => {
    if (!pro) {
      onPaywall();
      return;
    }
    await Clipboard.setStringAsync(buildCsv());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md }}>{t.rpTitle}</Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {t.rpMonthPL} · {monthKey}
        </Text>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.plRow}>
            <View style={styles.plCell}>
              <Text variant="overline" color="textSecondary">{t.dashIncome}</Text>
              <Text variant="h3" color="profit">{formatMoney(currency, monthIncome)}</Text>
            </View>
            <View style={styles.plCell}>
              <Text variant="overline" color="textSecondary">{t.dashExpenses}</Text>
              <Text variant="h3">{formatMoney(currency, monthExpenses)}</Text>
            </View>
            <View style={styles.plCell}>
              <Text variant="overline" color="textSecondary">{t.dashProfit}</Text>
              <Text variant="h3" color={monthProfit >= 0 ? 'profit' : 'danger'}>
                {formatMoney(currency, monthProfit)}
              </Text>
            </View>
          </View>
        </Card>

        <Card tone="highlight" style={{ marginBottom: spacing.md }}>
          <Text variant="overline" color="highlight">{t.rpDeductible}</Text>
          <Text variant="h2" color="highlight">{formatMoney(currency, monthDeductible)}</Text>
          <Text variant="caption" color="textSecondary">{t.rpDeductibleHint}</Text>
        </Card>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.rpByCategory}</Text>
        {catTotals.length === 0 ? (
          <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>{t.dashEmpty}</Text>
        ) : (
          <Card style={{ marginBottom: spacing.md }}>
            {catTotals.map(({ cat, total }) => (
              <View key={cat} style={{ marginBottom: spacing.sm }}>
                <View style={styles.barHeader}>
                  <Text variant="bodySmall">{categoryLabel(cat, t)}</Text>
                  <Text variant="bodySmall" color="textSecondary">{formatMoney(currency, total)}</Text>
                </View>
                <View style={[styles.bar, { backgroundColor: colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.barFill,
                      { backgroundColor: colors.accent, width: `${(total / maxCat) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}

        <Button
          title={copied ? '✓ CSV' : `${t.rpExport}${pro ? '' : ' (Plus)'}`}
          variant="highlight"
          onPress={exportCsv}
        />
        {!pro && (
          <Text variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {t.rpExportHint}
          </Text>
        )}
        <Text variant="caption" color="textTertiary" style={{ textAlign: 'center', marginTop: spacing.md }}>
          {t.rpTaxNote}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  plRow: { flexDirection: 'row' },
  plCell: { flex: 1 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  bar: { height: 8, borderRadius: 9999, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 9999 },
});
