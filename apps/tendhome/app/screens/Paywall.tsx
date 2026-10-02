import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useHome } from '../store/home';
import {
  initBilling, closeBilling, getWeeklyProduct, subscribeWeekly, restorePurchases,
  type WeeklyProduct,
} from '../lib/billing';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

// Weekly + free trial, per the portfolio LTV rule.
export default function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { setPro } = useHome();
  const [busy, setBusy] = useState(false);
  const [product, setProduct] = useState<WeeklyProduct | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const ok = await initBilling(() => { setPro(true); onClose(); });
      if (ok && alive) {
        const p = await getWeeklyProduct().catch(() => null);
        if (alive) setProduct(p);
      }
    })();
    return () => { alive = false; closeBilling(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buy = async () => {
    setBusy(true);
    try { await subscribeWeekly(); } catch { setBusy(false); }
  };

  const restore = async () => {
    setBusy(true);
    try {
      const ok = await restorePurchases();
      if (ok) { setPro(true); onClose(); }
    } finally { setBusy(false); }
  };

  const features = [t.f1, t.f2, t.f3];

  return (
    <Screen padded>
      <View style={styles.center}>
        <View style={[styles.glyph, { backgroundColor: colors.accentMuted }]}>
          <Text variant="display">🏠</Text>
        </View>
        <Text variant="h1" align="center">{t.payTitle}</Text>
        <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{t.payBody}</Text>
        <Card style={styles.features}>
          {features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={[styles.tick, { backgroundColor: colors.highlight }]}>
                <Text variant="caption" style={{ color: colors.textPrimary }}>✓</Text>
              </View>
              <Text variant="body">{f}</Text>
            </View>
          ))}
        </Card>
        {product && <Text variant="h2" align="center">{product.displayPrice}</Text>}
      </View>
      <View style={styles.footer}>
        <Button title={busy ? '…' : t.weeklyTrial} onPress={buy} variant="primary" disabled={busy} />
        <Button title={t.later} onPress={restore} variant="ghost" disabled={busy} />
        <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>{t.payNote}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.sm },
  glyph: { width: 88, height: 88, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  features: { gap: spacing.sm },
  featureRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  tick: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});
