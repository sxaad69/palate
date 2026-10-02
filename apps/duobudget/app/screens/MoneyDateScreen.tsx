import React, { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet, Share, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { TPText } from '../components/TPText';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useTwoPurse } from '../store/app';
import { getLang, t } from '../lib/i18n';
import {
  buildCsv,
  buildSummary,
  envelopeAvailable,
  formatMoney,
  monthKey,
  monthLabel,
  shiftMonth,
  spentByEnvelope,
} from '../lib/money';

export function MoneyDateScreen({ onNeedPro }: { onNeedPro: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const {
    envelopes,
    expenses,
    credits,
    currency,
    meName,
    partnerName,
    moneyDateDone,
    closeMonth,
    isPro,
  } = useTwoPurse();
  const [month, setMonth] = useState(() => monthKey(Date.now()));
  const locale = getLang() === 'ar' ? 'ar-SA' : 'en-US';

  const active = useMemo(
    () => envelopes.filter((e) => !e.archived).sort((a, b) => a.position - b.position),
    [envelopes],
  );
  const perEnv = useMemo(() => spentByEnvelope(expenses, month), [expenses, month]);

  const rows = useMemo(
    () =>
      active.map((e) => {
        const spent = perEnv[e.id]?.total ?? 0;
        const avail = envelopeAvailable(e, month, credits);
        return { env: e, spent, avail, left: avail - spent };
      }),
    [active, perEnv, month, credits],
  );

  const totals = useMemo(() => {
    const planned = rows.reduce((a, r) => a + r.avail, 0);
    const spent = rows.reduce((a, r) => a + r.spent, 0);
    const me = Object.values(perEnv).reduce((a, x) => a + x.me, 0);
    const partner = Object.values(perEnv).reduce((a, x) => a + x.partner, 0);
    const biggest = rows.reduce(
      (best, r) => (r.spent > (best?.spent ?? -1) ? r : best),
      undefined as (typeof rows)[number] | undefined,
    );
    return { planned, spent, left: planned - spent, me, partner, biggest };
  }, [rows, perEnv]);

  const closed = !!moneyDateDone[month];
  const savingsRate = totals.planned > 0 ? Math.max(0, totals.left / totals.planned) : 0;

  const doRollover = () => {
    const rolled = closeMonth(month);
    Alert.alert(t().rolloverTitle, rolled > 0 ? t().rolloverDone : t().noData);
  };

  const share = async () => {
    const msg = buildSummary(
      month,
      envelopes,
      expenses,
      currency,
      locale,
      { me: meName, partner: partnerName },
      {
        title: t().appName,
        planned: t().totalPlanned,
        spent: t().totalSpent,
        left: t().totalLeft,
        whoSpentWhat: t().whoSpentWhat,
      },
    );
    try {
      await Share.share({ message: msg });
    } catch {
      // user dismissed
    }
  };

  const exportCsv = async () => {
    if (!isPro) {
      onNeedPro();
      return;
    }
    const csv = buildCsv(month, envelopes, expenses, { me: meName, partner: partnerName });
    // ponytail: share sheet instead of a clipboard dep — one less install.
    try {
      await Share.share({ message: csv, title: `${t().exportCsv} — ${monthLabel(month, locale)}` });
    } catch {
      // dismissed
    }
  };

  return (
    <Screen>
      <TPText variant="h1" style={{ marginTop: spacing.md }}>
        {t().moneyDate} ♡
      </TPText>

      <View style={[styles.monthRow, { marginTop: spacing.sm }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMonth(shiftMonth(month, -1))}
          style={[styles.monthBtn, { borderColor: colors.border }]}
        >
          <TPText variant="h3" color={colors.accent}>
            {'‹'}
          </TPText>
        </Pressable>
        <TPText variant="h3">
          {t().reviewFor} {monthLabel(month, locale)}
        </TPText>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMonth(shiftMonth(month, 1))}
          style={[styles.monthBtn, { borderColor: colors.border }]}
        >
          <TPText variant="h3" color={colors.accent}>
            {'›'}
          </TPText>
        </Pressable>
      </View>

      {/* Summary card */}
      <View
        style={{
          backgroundColor: colors.cardTint,
          borderRadius: radii.lg,
          padding: spacing.md,
          marginTop: spacing.md,
        }}
      >
        <View style={styles.triRow}>
          <View style={{ flex: 1 }}>
            <TPText variant="caption" color={colors.textSecondary}>
              {t().totalPlanned}
            </TPText>
            <TPText variant="h3">{formatMoney(totals.planned, currency, locale)}</TPText>
          </View>
          <View style={{ flex: 1 }}>
            <TPText variant="caption" color={colors.textSecondary}>
              {t().totalSpent}
            </TPText>
            <TPText variant="h3">{formatMoney(totals.spent, currency, locale)}</TPText>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TPText variant="caption" color={colors.textSecondary}>
              {t().totalLeft}
            </TPText>
            <TPText variant="h3" color={totals.left < 0 ? colors.danger : colors.success}>
              {formatMoney(totals.left, currency, locale)}
            </TPText>
          </View>
        </View>
        <View style={{ height: spacing.sm }} />
        <TPText variant="bodySmall" color={colors.textSecondary}>
          {Math.round(savingsRate * 100)}% {t().savingsRate}
        </TPText>
        {totals.biggest && totals.biggest.spent > 0 && (
          <TPText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 2 }}>
            {t().biggestEnvelope}: {totals.biggest.env.name} (
            {formatMoney(totals.biggest.spent, currency, locale)})
          </TPText>
        )}
      </View>

      {/* Per-envelope bars */}
      <View style={{ height: spacing.md }} />
      {rows.map((r) => (
        <View key={r.env.id} style={{ marginBottom: spacing.sm }}>
          <View style={styles.barHead}>
            <View style={[styles.dot, { backgroundColor: r.env.color }]} />
            <TPText variant="bodySmall" style={{ flex: 1 }}>
              {r.env.name}
            </TPText>
            <TPText variant="bodySmall" color={colors.textSecondary}>
              {formatMoney(r.spent, currency, locale)} / {formatMoney(r.avail, currency, locale)}
            </TPText>
          </View>
          <View style={{ height: 4 }} />
          <ProgressBar
            fraction={r.avail > 0 ? r.spent / r.avail : r.spent > 0 ? 1 : 0}
            color={r.env.color}
            height={8}
          />
        </View>
      ))}
      {rows.length === 0 && (
        <TPText variant="body" color={colors.textSecondary}>
          {t().noData}
        </TPText>
      )}

      {/* Who spent what */}
      {totals.spent > 0 && (
        <View style={{ marginTop: spacing.md }}>
          <TPText variant="h3" style={{ marginBottom: spacing.sm }}>
            {t().whoSpentWhat}
          </TPText>
          <View style={styles.splitBar}>
            <View
              style={{
                flex: totals.me,
                backgroundColor: colors.accent,
                borderTopLeftRadius: 999,
                borderBottomLeftRadius: 999,
              }}
            />
            <View
              style={{
                flex: Math.max(totals.partner, 0.001),
                backgroundColor: colors.savings,
                borderTopRightRadius: 999,
                borderBottomRightRadius: 999,
              }}
            />
          </View>
          <View style={[styles.triRow, { marginTop: spacing.xs }]}>
            <TPText variant="bodySmall" color={colors.accent}>
              {meName}: {formatMoney(totals.me, currency, locale)}
            </TPText>
            <TPText variant="bodySmall" color={colors.savings}>
              {partnerName}: {formatMoney(totals.partner, currency, locale)}
            </TPText>
          </View>
        </View>
      )}

      {/* Rollover */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.lg,
          padding: spacing.md,
          marginTop: spacing.lg,
        }}
      >
        <TPText variant="h3">{t().rolloverTitle}</TPText>
        <TPText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 4 }}>
          {t().rolloverBody}
        </TPText>
        <View style={{ height: spacing.sm }} />
        <Button
          title={closed ? t().rolloverDone : t().rolloverButton}
          onPress={doRollover}
          disabled={closed}
          variant={closed ? 'secondary' : 'primary'}
        />
      </View>

      <View style={{ height: spacing.md }} />
      <Button title={t().shareSummary} variant="secondary" onPress={share} />
      <View style={{ height: spacing.sm }} />
      <Button
        title={isPro ? t().exportCsv : `${t().exportCsv} · Pro`}
        variant="secondary"
        onPress={exportCsv}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barHead: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  splitBar: { flexDirection: 'row', height: 14, borderRadius: 999, overflow: 'hidden' },
});
