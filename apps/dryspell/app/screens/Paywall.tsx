import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety } from '../store/sobriety';
import {
  initBilling,
  closeBilling,
  getWeeklyProduct,
  subscribeWeekly,
  restorePurchases,
  type WeeklyProduct,
} from '../lib/billing';

// Weekly + free trial, per the portfolio monetization rule. The trial is
// configured on the `dryspell_weekly` product in Play Console (launch step).
export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { setPro } = useSobriety();
  const [product, setProduct] = useState<WeeklyProduct | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await initBilling(async () => {
        if (mounted) {
          await setPro(true);
          onClose();
        }
      });
      if (ok && mounted) setProduct(await getWeeklyProduct());
    })();
    return () => {
      mounted = false;
      closeBilling();
    };
  }, [onClose, setPro]);

  const buy = async () => {
    setBusy(true);
    setError(null);
    try {
      await subscribeWeekly();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Purchase failed');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    setError(null);
    try {
      const active = await restorePurchases();
      if (active) {
        await setPro(true);
        onClose();
      } else {
        setError(t.pwRestore + ' — none found');
      }
    } finally {
      setBusy(false);
    }
  };

  const price = product?.displayPrice ?? '—';

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
        <Text variant="display" style={{ marginTop: spacing.xl, textAlign: 'center' }}>{t.pwTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginVertical: spacing.md }}>
          {t.pwSubtitle}
        </Text>

        <Card tone="gold" style={{ marginBottom: spacing.md }}>
          <View style={styles.planRow}>
            <View>
              <Text variant="h3">{t.pwWeekly}</Text>
              <Text variant="bodySmall" color="textSecondary">
                {t.pwTrial.replace('{price}', price)}
              </Text>
            </View>
            <Text variant="h2" color="highlight">{price}</Text>
          </View>
        </Card>

        {[
          `✓ ${t.goalTitle}`,
          `✓ ${t.jTitle} — unlimited`,
          `✓ ${t.achTitle}`,
          `✓ ${t.sosTitle}`,
        ].map((f) => (
          <Text key={f} variant="body" style={{ marginBottom: spacing.xs }}>  {f}</Text>
        ))}

        {error && (
          <Text variant="bodySmall" color="danger" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
            {error}
          </Text>
        )}

        <Button title={t.pwCta} variant="gold" onPress={buy} loading={busy} style={{ marginTop: spacing.lg }} />
        <Button title={t.pwRestore} variant="ghost" onPress={restore} disabled={busy} style={{ marginTop: spacing.sm }} />
        <Button title={t.pwLater} variant="ghost" onPress={onClose} style={{ marginTop: spacing.xs }} />

        <Text variant="caption" color="textTertiary" style={{ textAlign: 'center', marginTop: spacing.lg }}>
          {t.pwTerms}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
