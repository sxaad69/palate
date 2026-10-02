import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import {
  initBilling,
  closeBilling,
  getProProduct,
  subscribe,
  restorePurchases,
  isPro,
  type ProProduct,
} from '../lib/billing';

// Weekly plan + 7-day free trial (deep dive LTV rule).
// The trial is configured on the subscription in Play Console, not in code.
const FEATURES: { icon: 'sunny-outline' | 'bar-chart-outline' | 'list-outline' | 'moon-outline'; title: string; subtitle: string }[] = [
  {
    icon: 'sunny-outline',
    title: 'Unlimited recipes',
    subtitle: 'As many tiny habits as you want',
  },
  {
    icon: 'bar-chart-outline',
    title: 'Full win history',
    subtitle: 'Every win, searchable, forever',
  },
  {
    icon: 'list-outline',
    title: 'Shrink coach',
    subtitle: 'Auto-suggests tinier behaviors when you slip',
  },
  {
    icon: 'moon-outline',
    title: 'Anchor library',
    subtitle: '100+ proven anchors to attach habits to',
  },
];

export function PaywallScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, refreshPro } = useApp();
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
        if (mounted && (await isPro())) {
          setAlreadyPro(true);
          await refreshPro();
        }
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
  }, [refreshPro]);

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
    if (found) {
      setAlreadyPro(true);
      await refreshPro();
    } else {
      setMessage('No previous purchase found.');
    }
  }, [refreshPro]);

  const price = product?.displayPrice ?? '$2.99';

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
            <Ionicons name="sunny-outline" size={36} color={colors.textInverse} />
          </View>
          <Text variant="display">Pip Pro</Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            {t.appTagline}
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
                {t.trialThen.replace('{price}', price)}
              </Text>
            </View>
          </View>
        </Card>

        {alreadyPro ? (
          <Card style={{ marginBottom: spacing.md }}>
            <Text variant="body" style={{ textAlign: 'center' }}>
              {t.proActive}
            </Text>
          </Card>
        ) : (
          <Button
            title={busy ? 'Working…' : t.startFreeTrial}
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
            accessibilityLabel={t.restore}
            onPress={onRestore}
            disabled={busy}
            style={styles.restore}
          >
            <Text variant="bodySmall" color="textSecondary">
              {t.restore}
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
