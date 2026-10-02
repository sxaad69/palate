import React from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useKeeps } from '../store/app';
import { t } from '../lib/i18n';

function money(v: number): string {
  return `$${v.toFixed(2)}`;
}

function StatTile({ label, value }: { label: string; value: string }) {
  const { colors, spacing } = useTheme();
  return (
    <Card style={[styles.tile, { marginBottom: spacing.sm }]}>
      <KText variant="h2">{value}</KText>
      <KText variant="caption" color={colors.textSecondary}>
        {label}
      </KText>
    </Card>
  );
}

export function StatsScreen({ onGoPro }: { onGoPro: () => void }) {
  const { colors, spacing } = useTheme();
  const {
    savedTotal,
    savedCount,
    wastedThisWeek,
    usedThisWeek,
    expiringThisWeek,
    items,
    isPro,
  } = useKeeps();

  const exportCsv = async () => {
    const rows = [
      'name,category,location,expiry,qty,est_price_usd',
      ...items.map((it) =>
        [
          `"${it.name.replace(/"/g, '""')}"`,
          it.cat,
          it.loc,
          new Date(it.expiry).toISOString().slice(0, 10),
          it.qty,
          it.price.toFixed(2),
        ].join(','),
      ),
    ].join('\n');
    try {
      await Share.share({ message: rows, title: 'KeepsFresh pantry export' });
    } catch {
      // share sheet dismissed — nothing to do
    }
  };

  return (
    <Screen>
      <KText variant="h1" style={{ marginTop: spacing.md }}>
        {t().statsTitle}
      </KText>

      <Card style={[styles.hero, { marginTop: spacing.md, backgroundColor: colors.accent }]}>
        <KText variant="overline" color={colors.textInverse}>
          {t().wasteSaved}
        </KText>
        <KText variant="display" color={colors.textInverse}>
          {money(savedTotal)}
        </KText>
        <KText variant="bodySmall" color={colors.textInverse}>
          {savedCount} {t().itemsSaved.toLowerCase()}
        </KText>
      </Card>

      <View style={[styles.grid, { marginTop: spacing.md }]}>
        <StatTile label={t().wastedWeek} value={money(wastedThisWeek.value)} />
        <StatTile label={t().expiringWeek} value={String(expiringThisWeek)} />
        <StatTile label={t().tracked} value={String(items.length)} />
        <StatTile label={t().itemsSaved} value={String(savedCount)} />
      </View>

      <KText variant="h2" style={{ marginTop: spacing.md }}>
        {t().weeklyReport}
      </KText>
      {isPro ? (
        <Card style={{ marginTop: spacing.sm }}>
          <View style={styles.reportRow}>
            <KText variant="body">{t().usedItems}</KText>
            <KText variant="h3" color={colors.success}>
              {usedThisWeek.count} · {money(usedThisWeek.value)}
            </KText>
          </View>
          <View style={[styles.reportRow, { marginTop: spacing.sm }]}>
            <KText variant="body">{t().wastedItems}</KText>
            <KText variant="h3" color={colors.danger}>
              {wastedThisWeek.count} · {money(wastedThisWeek.value)}
            </KText>
          </View>
        </Card>
      ) : (
        <Card style={{ marginTop: spacing.sm, borderColor: colors.accent }}>
          <KText variant="body" color={colors.textSecondary}>
            {t().reportLocked}
          </KText>
          <Button title={t().unlockPro} size="sm" onPress={onGoPro} style={{ marginTop: spacing.sm }} />
        </Card>
      )}

      <Button
        title={t().exportBtn}
        variant="secondary"
        onPress={() => {
          if (isPro) void exportCsv();
          else onGoPro();
        }}
        style={{ marginTop: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexGrow: 1, flexBasis: '45%', alignItems: 'center' },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
