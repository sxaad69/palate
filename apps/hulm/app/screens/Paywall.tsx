import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useDreams } from '../store/dreams';
import { initBilling, getWeeklyProduct, subscribeWeekly, restorePurchases } from '../lib/billing';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

export default function PaywallScreen({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { setPro } = useDreams();
  const [price, setPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await initBilling(() => {
        if (!cancelled) {
          setPro(true);
          onClose();
        }
      });
      if (ok && !cancelled) {
        const p = await getWeeklyProduct();
        if (p) setPrice(p.displayPrice);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      await subscribeWeekly();
      // The purchase listener fires on success and closes the paywall.
    } catch (e: any) {
      Alert.alert(t.payTitle, e?.message ?? '');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    try {
      const had = await restorePurchases();
      if (had) {
        setPro(true);
        onClose();
      } else {
        Alert.alert(t.payTitle, t.noData);
      }
    } finally {
      setBusy(false);
    }
  };

  const features = [t.f1, t.f2, t.f3];

  return (
    <Screen padded>
      <View style={styles.wrap}>
        <Text variant="display" align="center">🔮</Text>
        <Text variant="h1" align="center">{t.payTitle}</Text>
        <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{t.payBody}</Text>
        <View style={[styles.features, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {features.map((f) => (
            <Text key={f} variant="body">✓  {f}</Text>
          ))}
        </View>
        {price && (
          <Text variant="h2" align="center" style={{ color: colors.accent }}>{price}</Text>
        )}
        <Button title={t.weeklyTrial} onPress={subscribe} variant="primary" loading={busy} />
        <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>{t.payNote}</Text>
        <Button title="Restore" onPress={restore} variant="ghost" />
        <Button title={t.later} onPress={onClose} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.lg },
  features: { borderWidth: 1, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm },
});
