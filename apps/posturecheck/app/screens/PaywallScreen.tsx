import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { usePosture } from '../store/app';
import { t } from '../lib/i18n';
import { initBilling, closeBilling, getWeeklyPrice, buyWeekly } from '../lib/billing';

// Weekly + free trial (deep-dive LTV rule). The trial is configured on the
// product in Play Console; the client only requests the subscription.
export function PaywallScreen() {
  const { colors, spacing, radii } = useTheme();
  const nav = useNavigation();
  const { setPro } = usePosture();
  const s = t();
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

  const perks = [s.perk1, s.perk2, s.perk3];

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.lg }}>
        <PostureText variant="display" style={{ textAlign: 'center' }}>
          {s.paywallTitle}
        </PostureText>
        <PostureText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 8 }}>
          {s.paywallSubtitle}
        </PostureText>

        <View style={{ height: spacing.xl }} />
        {perks.map((p) => (
          <View
            key={p}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: radii.lg,
              padding: spacing.md,
              marginBottom: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <PostureText variant="body" color={colors.accent}>
              {'✦ '}
            </PostureText>
            <PostureText variant="body">{p}</PostureText>
          </View>
        ))}

        <View style={{ flex: 1 }} />
        <PostureText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center', marginBottom: spacing.sm }}>
          {s.paywallNote}
        </PostureText>

        {!ready ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Button
            title={price ? `${s.startTrial} · ${price}` : s.startTrial}
            onPress={buy}
            loading={busy}
            size="lg"
          />
        )}
        <View style={{ height: spacing.sm }} />
        <Button title={s.close} variant="ghost" onPress={() => nav.goBack()} />
      </View>
    </Screen>
  );
}
