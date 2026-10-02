import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { useTG } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { initBilling, closeBilling, getWeeklyPrice, buyWeekly } from '../lib/billing';

// Weekly + free trial (deep-dive LTV rule). The trial is configured on the
// product in Play Console; the client only requests the subscription.
export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { setPro } = useTG();
  const lang = getLang();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const ok = await initBilling(() => {
        if (live) setPro(true);
      });
      if (live) {
        setReady(ok);
        if (ok) setPrice(await getWeeklyPrice());
      }
    })();
    return () => {
      live = false;
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

  const perks = [t().perk1, t().perk2, t().perk3, t().perk4];

  return (
    <Screen scroll={false}>
      <View style={[styles.root, { padding: spacing.lg }]}>
        <AppText variant="display" style={styles.center}>
          ☀
        </AppText>
        <AppText variant="h1" style={[styles.center, { marginTop: spacing.sm }]}>
          {t().paywallTitle}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={[styles.center, { marginTop: 8 }]}>
          {t().paywallSubtitle}
        </AppText>

        <View style={{ height: spacing.xl }} />
        {perks.map((p) => (
          <View
            key={p}
            style={[
              styles.perk,
              { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.sm },
            ]}
          >
            <AppText variant="body" color={colors.accent}>
              ✦{' '}
            </AppText>
            <AppText variant="body" style={{ flex: 1 }}>
              {p}
            </AppText>
          </View>
        ))}

        <View style={{ flex: 1 }} />

        {!ready ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Button
            title={price ? `${t().begin} · ${price}` : t().begin}
            onPress={buy}
            loading={busy}
            size="lg"
          />
        )}
        <View style={{ height: spacing.sm }} />
        <Button title={t().continue} variant="ghost" onPress={onClose} />
        <AppText variant="caption" color={colors.textTertiary} style={[styles.center, { marginTop: spacing.sm }]}>
          {lang === 'ar' ? 'تجربة مجانية ثم اشتراك أسبوعي. إلغاء في أي وقت.' : 'Free trial, then weekly. Cancel anytime.'}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { textAlign: 'center' },
  perk: { borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
});
