import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { FableText } from '../components/FableText';
import { Button } from '../components/Button';
import { useFable } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { initBilling, closeBilling, getWeeklyPrice, buyWeekly } from '../lib/billing';

// Weekly + free trial (deep-dive LTV rule). The trial is configured on the
// product in Play Console; the client only requests the subscription.
export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { setPro } = useFable();
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

  const perks =
    lang === 'ar'
      ? ['كل الفصول الـ12 والقادمة', 'تجربة مجانية ثم أسبوعي', 'إلغاء في أي وقت']
      : ['All 12 chapters and counting', 'Free trial, then weekly', 'Cancel anytime'];

  return (
    <Screen scroll={false}>
      <View style={[styles.root, { padding: spacing.lg }]}>
        <FableText variant="display" style={styles.center}>
          {t().paywallTitle}
        </FableText>
        <FableText variant="body" color={colors.textSecondary} style={[styles.center, { marginTop: 8 }]}>
          {t().paywallSubtitle}
        </FableText>

        <View style={{ height: spacing.xl }} />
        {perks.map((p) => (
          <View
            key={p}
            style={[
              styles.perk,
              { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.sm },
            ]}
          >
            <FableText variant="body" color={colors.accent}>✦ </FableText>
            <FableText variant="body">{p}</FableText>
          </View>
        ))}

        <View style={{ flex: 1 }} />

        {!ready ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Button
            title={price ? `${t().start} · ${price}` : t().start}
            onPress={buy}
            loading={busy}
            size="lg"
          />
        )}
        <View style={{ height: spacing.sm }} />
        <Button title={t().continue} variant="ghost" onPress={onClose} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { textAlign: 'center' },
  perk: { borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
});
