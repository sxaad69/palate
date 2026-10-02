import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { buyWeekly, getWeeklyPrice } from '../lib/billing';
import { useShadow } from '../store/app';
import { Screen } from '../components/Screen';
import { EchoText } from '../components/EchoText';
import { Button } from '../components/Button';

export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { setPro } = useShadow();
  const s = t();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getWeeklyPrice().then(setPrice);
  }, []);

  async function buy() {
    if (busy) return;
    setBusy(true);
    try {
      await buyWeekly();
      // Entitlement unlocks via purchaseUpdatedListener in initBilling.
    } catch {
      // user cancelled or store unavailable — stay on the paywall
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }}>
        <Pressable
          testID="paywall-close"
          accessibilityRole="button"
          accessibilityLabel="close"
          onPress={onClose}
          hitSlop={12}
          style={{ alignSelf: 'flex-end' }}
        >
          <EchoText variant="h2" color={colors.textTertiary}>
            ✕
          </EchoText>
        </Pressable>

        <EchoText variant="display" style={{ textAlign: 'center' }}>
          🗣️
        </EchoText>
        <EchoText variant="h1" style={{ textAlign: 'center' }}>
          {s.paywallTitle}
        </EchoText>
        <EchoText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
          {s.paywallSubtitle}
        </EchoText>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.sm,
          }}
        >
          <EchoText variant="h3">
            {price ?? '…'} / {s.weekly}
          </EchoText>
          <EchoText variant="body" color={colors.textSecondary}>
            ✓ {s.packTravel} · {s.packWork} · {s.packDaily} · {s.packArabic}
          </EchoText>
          <EchoText variant="body" color={colors.textSecondary}>
            ✓ {s.dayLimitReached}
          </EchoText>
        </View>

        <Button title={s.tryFreeTrial} onPress={buy} loading={busy} size="lg" />
        <Button title={s.maybeLater} variant="ghost" onPress={onClose} />
        <EchoText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
          {s.signInLater}
        </EchoText>
      </View>
    </Screen>
  );
}
