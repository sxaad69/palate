import React, { useMemo, useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { TPText } from '../components/TPText';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useTwoPurse, type Envelope } from '../store/app';
import { getLang, t } from '../lib/i18n';
import {
  envelopeAvailable,
  formatMoney,
  monthKey,
  monthLabel,
  shiftMonth,
  spentByEnvelope,
} from '../lib/money';

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View
      style={{
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: bg,
      }}
    >
      <TPText variant="caption" color={color}>
        {label}
      </TPText>
    </View>
  );
}

export function EnvelopesScreen({
  onAddExpense,
  onEditEnvelope,
  onNewEnvelope,
}: {
  onAddExpense: () => void;
  onEditEnvelope: (e: Envelope) => void;
  onNewEnvelope: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { envelopes, expenses, credits, currency, meName, partnerName } = useTwoPurse();
  const [month, setMonth] = useState(() => monthKey(Date.now()));
  const locale = getLang() === 'ar' ? 'ar-SA' : 'en-US';

  const active = useMemo(
    () => envelopes.filter((e) => !e.archived).sort((a, b) => a.position - b.position),
    [envelopes],
  );
  const perEnv = useMemo(() => spentByEnvelope(expenses, month), [expenses, month]);

  const totals = useMemo(() => {
    let planned = 0;
    let spent = 0;
    for (const e of active) {
      planned += envelopeAvailable(e, month, credits);
      spent += perEnv[e.id]?.total ?? 0;
    }
    return { planned, spent, left: planned - spent };
  }, [active, perEnv, month, credits]);

  const kindLabel = (e: Envelope) =>
    e.isSavings ? t().savings : e.kind === 'joint' ? t().joint : e.kind === 'mine' ? meName : partnerName;

  // ponytail: no absolute FAB inside a ScrollView — header + content + bottom bar.
  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
        {/* Month selector */}
        <View style={[styles.monthRow, { marginTop: spacing.md }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            onPress={() => setMonth(shiftMonth(month, -1))}
            style={[styles.monthBtn, { borderColor: colors.border }]}
          >
            <TPText variant="h3" color={colors.accent}>
              {'‹'}
            </TPText>
          </Pressable>
          <TPText variant="h2">{monthLabel(month, locale)}</TPText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            onPress={() => setMonth(shiftMonth(month, 1))}
            style={[styles.monthBtn, { borderColor: colors.border }]}
          >
            <TPText variant="h3" color={colors.accent}>
              {'›'}
            </TPText>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <View
            style={[
              styles.summary,
              { backgroundColor: colors.cardTint, borderRadius: radii.lg, padding: spacing.md, marginTop: spacing.md },
            ]}
          >
            <View style={styles.summaryRow}>
              <View>
                <TPText variant="caption" color={colors.textSecondary}>
                  {t().totalSpent}
                </TPText>
                <TPText variant="h2">{formatMoney(totals.spent, currency, locale)}</TPText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <TPText variant="caption" color={colors.textSecondary}>
                  {t().totalLeft}
                </TPText>
                <TPText variant="h2" color={totals.left < 0 ? colors.danger : colors.success}>
                  {formatMoney(totals.left, currency, locale)}
                </TPText>
              </View>
            </View>
            <View style={{ height: spacing.sm }} />
            <ProgressBar
              fraction={totals.planned > 0 ? totals.spent / totals.planned : 0}
              color={colors.accent}
            />
            <TPText variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              {t().totalPlanned}: {formatMoney(totals.planned, currency, locale)}
            </TPText>
          </View>

          {/* Envelope cards */}
          <View style={{ height: spacing.md }} />
          {active.map((e) => {
            const spent = perEnv[e.id]?.total ?? 0;
            const avail = envelopeAvailable(e, month, credits);
            const left = avail - spent;
            const frac = avail > 0 ? spent / avail : spent > 0 ? 1 : 0;
            const split = perEnv[e.id];
            return (
              <Pressable
                key={e.id}
                accessibilityRole="button"
                onPress={() => onEditEnvelope(e)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radii.lg,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                  },
                ]}
              >
                <View style={styles.cardHead}>
                  <View style={[styles.dot, { backgroundColor: e.color }]} />
                  <TPText variant="h3" style={{ flex: 1 }}>
                    {e.name}
                  </TPText>
                  <Badge label={kindLabel(e)} color={colors.accent} bg={colors.accentMuted} />
                </View>
                <View style={{ height: spacing.sm }} />
                <ProgressBar fraction={frac} color={e.color} />
                <View style={[styles.cardFoot, { marginTop: spacing.sm }]}>
                  <TPText variant="bodySmall" color={colors.textSecondary}>
                    {formatMoney(spent, currency, locale)} {t().spent} ·{' '}
                    <TPText
                      variant="bodySmall"
                      color={left < 0 ? colors.danger : colors.textPrimary}
                    >
                      {left < 0
                        ? `${t().overspentBy} ${formatMoney(-left, currency, locale)}`
                        : `${formatMoney(left, currency, locale)} ${t().leftToSpend}`}
                    </TPText>
                  </TPText>
                  {e.kind === 'joint' && split && split.total > 0 && (
                    <TPText variant="caption" color={colors.textTertiary}>
                      {meName} {formatMoney(split.me, currency, locale)} · {partnerName}{' '}
                      {formatMoney(split.partner, currency, locale)}
                    </TPText>
                  )}
                </View>
              </Pressable>
            );
          })}

          {active.length === 0 && (
            <TPText variant="body" color={colors.textSecondary} style={styles.center}>
              {t().noEnvelopes}
            </TPText>
          )}
        </ScrollView>

        {/* Bottom action bar */}
        <View style={[styles.actionBar, { paddingVertical: spacing.sm }]}>
          <Button
            title={t().addExpense}
            onPress={onAddExpense}
            style={{ flex: 2, marginRight: spacing.sm }}
          />
          <Button
            title={t().addEnvelope}
            variant="secondary"
            onPress={onNewEnvelope}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { borderWidth: 1 },
  cardHead: { flexDirection: 'row', alignItems: 'center' },
  cardFoot: {},
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  actionBar: { flexDirection: 'row' },
});
