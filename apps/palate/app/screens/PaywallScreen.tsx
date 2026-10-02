import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import {
  initBilling,
  closeBilling,
  getProProduct,
  subscribe,
  restorePurchases,
  isPro,
  type ProProduct,
} from '../lib/billing';

const FEATURES = [
  {
    icon: 'scan-outline' as const,
    title: 'Unlimited AI scans',
    subtitle: 'Snap every meal, no daily limits',
  },
  {
    icon: 'time-outline' as const,
    title: 'Full nutrition history',
    subtitle: 'Every meal, searchable, forever',
  },
  {
    icon: 'options-outline' as const,
    title: 'Custom goals',
    subtitle: 'Calories and macros tuned to you',
  },
  {
    icon: 'globe-outline' as const,
    title: 'Priority new cuisines',
    subtitle: 'Vote on the next cuisine packs',
  },
];

export function PaywallScreen() {
  const { colors, spacing, radii } = useTheme();
  const [billingReady, setBillingReady] = useState(false);
  const [product, setProduct] = useState<ProProduct | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [alreadyPro, setAlreadyPro] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (await isPro()) {
        if (mounted) setAlreadyPro(true);
        return;
      }
      const ok = await initBilling(async () => {
        // Purchase listener fires after verification; refresh pro state.
        if (mounted && (await isPro())) setAlreadyPro(true);
        if (mounted) {
          setBusy(false);
          setMessage(null);
        }
      });
      if (!mounted) return;
      setBillingReady(ok);
      if (ok) setProduct(await getProProduct());
      else setMessage('Purchases are not available on this device yet.');
    })();
    return () => {
      mounted = false;
      closeBilling();
    };
  }, []);

  const onSubscribe = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      await subscribe();
      // Result arrives via purchaseUpdatedListener.
    } catch (e) {
      setBusy(false);
      const msg = e instanceof Error ? e.message : 'Purchase failed.';
      setMessage(
        msg.includes('cancelled') || msg.includes('E_USER_CANCELLED')
          ? 'Purchase cancelled.'
          : msg,
      );
    }
  }, []);

  const onRestore = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    const found = await restorePurchases();
    setBusy(false);
    if (found) setAlreadyPro(true);
    else setMessage('No previous purchase found.');
  }, []);

  const price = product?.displayPrice ?? '$4.99';

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingVertical: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { marginBottom: spacing.lg }]}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor: colors.accent,
                borderRadius: radii.full,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={36}
              color={colors.textInverse}
            />
          </View>
          <Text variant="display">Palate Pro</Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            Your food, fully understood.
          </Text>
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          {FEATURES.map((f, i) => (
            <View
              key={f.title}
              style={[
                styles.feature,
                i < FEATURES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
                { paddingVertical: spacing.sm },
              ]}
            >
              <View
                style={[
                  styles.featureIcon,
                  {
                    backgroundColor: colors.accentMuted,
                    borderRadius: radii.full,
                    marginEnd: spacing.md,
                  },
                ]}
              >
                <Ionicons name={f.icon} size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body">{f.title}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  {f.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        <Card
          style={{
            marginBottom: spacing.lg,
            backgroundColor: colors.accentMuted,
          }}
        >
          <View style={styles.priceRow}>
            <View>
              <Text variant="h1">{price}</Text>
              <Text variant="bodySmall" color="textSecondary">
                per month · cancel anytime
              </Text>
            </View>
          </View>
        </Card>

        {alreadyPro ? (
          <Card style={{ marginBottom: spacing.md }}>
            <Text variant="body" style={{ textAlign: 'center' }}>
              You're on Palate Pro — enjoy unlimited scans.
            </Text>
          </Card>
        ) : (
          <Button
            title={busy ? 'Working…' : 'Subscribe'}
            disabled={busy || !billingReady}
            onPress={onSubscribe}
          />
        )}
        {message ? (
          <Text
            variant="bodySmall"
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            {message}
          </Text>
        ) : null}
        <View style={{ marginTop: spacing.sm }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore purchase"
            onPress={onRestore}
            disabled={busy}
            style={styles.restore}
          >
            <Text variant="bodySmall" color="textSecondary">
              Restore purchase
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  logo: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feature: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restore: { alignItems: 'center', paddingVertical: 12, minHeight: 48 },
});
