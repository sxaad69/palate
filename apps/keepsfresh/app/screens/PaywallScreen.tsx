import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useKeeps } from '../store/app';
import { t } from '../lib/i18n';
import {
  buyWeekly,
  closeBilling,
  getWeeklyPrice,
  initBilling,
  isProLocal,
  restorePurchases,
} from '../lib/billing';

export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing } = useTheme();
  const { setPro } = useKeeps();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ok = await initBilling(() => setPro(true));
      if (ok && alive) setPrice(await getWeeklyPrice());
      // Dev / no-Play build: unlocking still works through restore path.
      if (alive && (await isProLocal())) setPro(true);
    })();
    return () => {
      alive = false;
      closeBilling();
    };
  }, [setPro]);

  const buy = async () => {
    setBusy(true);
    try {
      await buyWeekly();
    } catch {
      // user cancelled or Play unavailable — stay on paywall
    } finally {
      setBusy(false);
    }
  };

  const bullets = t().paywallBullets.split('|');

  return (
    <Screen>
      <View style={[styles.root, { paddingTop: spacing.xl }]}>
        <KText variant="display" style={styles.center}>
          🧺
        </KText>
        <KText variant="h1" style={[styles.center, { marginTop: spacing.sm }]}>
          {t().paywallTitle}
        </KText>
        <KText variant="bodySmall" color={colors.textSecondary} style={[styles.center, { marginTop: spacing.xs }]}>
          {t().paywallSubtitle}
        </KText>

        <Card style={{ marginTop: spacing.lg }}>
          {bullets.map((b) => (
            <View key={b} style={[styles.bullet, { marginBottom: spacing.sm }]}>
              <KText variant="body" color={colors.success}>
                ✓
              </KText>
              <KText variant="body">{b}</KText>
            </View>
          ))}
        </Card>

        <Card style={[styles.priceCard, { marginTop: spacing.md, borderColor: colors.accent }]}>
          <KText variant="h2">{t().weeklyPlan}</KText>
          <KText variant="h1" color={colors.accent}>
            {price ?? t().priceLoading}
          </KText>
          <KText variant="caption" color={colors.textSecondary}>
            {t().trialNote} · {t().cancelAnytime}
          </KText>
        </Card>

        <Button
          title={t().buyCta}
          onPress={() => void buy()}
          loading={busy}
          style={{ marginTop: spacing.lg }}
        />
        <Button
          title={t().restore}
          variant="ghost"
          size="sm"
          onPress={() => void restorePurchases(() => setPro(true))}
          style={{ marginTop: spacing.sm }}
        />
        <KText variant="caption" color={colors.textTertiary} style={[styles.center, { marginTop: spacing.md }]}>
          {t().termsNote}
        </KText>
        <Button title={t().cancel} variant="ghost" size="sm" onPress={onClose} style={{ marginTop: spacing.sm }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { textAlign: 'center' },
  bullet: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  priceCard: { alignItems: 'center', paddingVertical: 20, borderWidth: 2 },
});
