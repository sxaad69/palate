import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useMeetBrief } from '../store/app';
import { buyWeekly, getWeeklyPrice } from '../lib/billing';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Button } from '../components/Button';

const FEATURES = ['pwUnlimited', 'pwLonger', 'pwExport', 'pwSupport'] as const;

export function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { setPro } = useMeetBrief();
  const [price, setPrice] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState(false);
  const strings = t();

  useEffect(() => {
    void getWeeklyPrice().then(setPrice);
  }, []);

  const subscribe = async () => {
    setBuying(true);
    setError(false);
    try {
      await buyWeekly();
      // onUnlock (purchaseUpdatedListener) flips Pro; close optimistically —
      // entitlement is restored on next launch if the sheet completed.
      setPro(true);
      onClose();
    } catch {
      setError(true);
    } finally {
      setBuying(false);
    }
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'space-between' }}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={strings.close}
          style={{ alignSelf: 'flex-end' }}
        >
          <MeetText variant="h2" color={colors.textSecondary}>✕</MeetText>
        </Pressable>

        <View style={{ gap: spacing.md }}>
          <MeetText variant="display" style={{ textAlign: 'center' }}>⚡</MeetText>
          <MeetText variant="h1" style={{ textAlign: 'center' }}>
            {strings.paywallTitle}
          </MeetText>
          <MeetText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            {strings.paywallSubtitle}
          </MeetText>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              gap: spacing.sm,
              marginTop: spacing.sm,
            }}
          >
            {FEATURES.map((k) => (
              <View key={k} style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
                <MeetText variant="body" color={colors.success}>✓</MeetText>
                <MeetText variant="body">{strings[k]}</MeetText>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          {error && (
            <MeetText variant="bodySmall" color={colors.danger} style={{ textAlign: 'center' }}>
              {strings.purchaseError}
            </MeetText>
          )}
          <Button
            title={price ? `${strings.subscribe} · ${price}` : strings.priceLoading}
            onPress={() => void subscribe()}
            loading={buying}
            size="lg"
          />
          <MeetText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
            {strings.purchaseNote}
          </MeetText>
        </View>
      </View>
    </Screen>
  );
}
