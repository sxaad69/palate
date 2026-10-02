import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from '../components/PawText';
import { Button } from '../components/Button';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { buyWeekly, getWeeklyPrice, initBilling } from '../lib/billing';

interface Props {
  onClose: () => void;
}

export function PaywallScreen({ onClose }: Props) {
  const { colors, spacing } = useTheme();
  const { setPro } = usePaw();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const strings = t();

  useEffect(() => {
    void getWeeklyPrice().then(setPrice);
  }, []);

  const startTrial = async () => {
    setBusy(true);
    try {
      await buyWeekly();
    } catch {
      // user cancelled or billing unavailable — stay on paywall
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    try {
      await initBilling(() => setPro(true));
    } finally {
      setBusy(false);
    }
  };

  const features = [
    `🐾 ${strings.proPlan}`,
    `💊 ${strings.freePlan}`,
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' }}>
      <PawText variant="display" style={{ textAlign: 'center' }}>🐾</PawText>
      <PawText variant="h1" style={{ textAlign: 'center', marginTop: spacing.md }}>
        {strings.paywallTitle}
      </PawText>
      <PawText variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg }}>
        {strings.paywallSubtitle}
      </PawText>
      {features.map((f) => (
        <PawText key={f} variant="body" style={{ marginBottom: spacing.sm }}>
          {f}
        </PawText>
      ))}
      <Button
        title={price ? `${strings.startTrial} · ${price}` : strings.startTrial}
        onPress={startTrial}
        loading={busy}
        style={{ marginTop: spacing.lg }}
      />
      <Button title={strings.restore} variant="ghost" onPress={restore} disabled={busy} style={{ marginTop: spacing.sm }} />
      <Button title={strings.close} variant="ghost" onPress={onClose} disabled={busy} style={{ marginTop: spacing.sm }} />
    </View>
  );
}
