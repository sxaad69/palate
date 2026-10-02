import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { buyWeekly, getWeeklyPrice, initBilling } from '../lib/billing';

export function PaywallScreen() {
  const { colors, spacing, radii } = useTheme();
  const { isPro, setPro } = useModestFit();
  const s = t();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getWeeklyPrice().then(setPrice);
  }, []);

  const subscribe = async () => {
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
      Alert.alert(s.done);
    } catch {
      // offline — local status stands
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing.xl }}>
        <MFText variant="display" style={{ textAlign: 'center' }}>
          🧕
        </MFText>
        <MFText variant="h1" style={{ textAlign: 'center', marginTop: spacing.md }}>
          {s.paywallTitle}
        </MFText>
        <MFText
          variant="bodySmall"
          color={colors.textSecondary}
          style={{ textAlign: 'center', marginTop: spacing.xs }}
        >
          {s.paywallSubtitle}
        </MFText>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            marginTop: spacing.lg,
          }}
        >
          {[s.proBullet1, s.proBullet2, s.proBullet3].map((b) => (
            <View key={b} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
              <MFText color={colors.success} style={{ marginEnd: spacing.sm }}>
                ✓
              </MFText>
              <MFText variant="body">{b}</MFText>
            </View>
          ))}
          <MFText
            variant="h2"
            color={colors.accent}
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            {price ?? '…'}
          </MFText>
          <MFText
            variant="caption"
            color={colors.textSecondary}
            style={{ textAlign: 'center', marginBottom: spacing.md }}
          >
            {s.cancelAnytime}
          </MFText>
          {isPro ? (
            <MFText variant="body" color={colors.success} style={{ textAlign: 'center' }}>
              ✓ {s.alreadyPro}
            </MFText>
          ) : (
            <>
              <Button title={s.subscribe} onPress={() => void subscribe()} loading={busy} />
              <Button
                title={s.restore}
                variant="ghost"
                onPress={() => void restore()}
                style={{ marginTop: spacing.sm }}
              />
            </>
          )}
        </View>

        <MFText
          variant="caption"
          color={colors.textTertiary}
          style={{ textAlign: 'center', marginTop: spacing.md }}
        >
          {s.termsNote}
        </MFText>
      </View>
    </Screen>
  );
}
