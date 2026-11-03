import React, { useEffect, useState } from 'react';
import { Alert, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import {
  buyWeekly,
  buyAnnual,
  getWeeklyPrice,
  getAnnualPrice,
  initBilling,
} from '../lib/billing';

export function PaywallScreen() {
  const { colors, spacing, radii } = useTheme();
  const { isPro, setPro } = useModestFit();
  const s = t();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'weekly'>('annual');
  const [weeklyPrice, setWeeklyPrice] = useState<string | null>(null);
  const [annualPrice, setAnnualPrice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getWeeklyPrice().then(setWeeklyPrice);
    void getAnnualPrice().then(setAnnualPrice);
  }, []);

  const handleSubscribe = async () => {
    setBusy(true);
    try {
      if (selectedPlan === 'annual') {
        await buyAnnual();
      } else {
        await buyWeekly();
      }
    } catch {
      // user cancelled or billing unavailable — stay on paywall
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
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

  const bullets = [
    s.proBullet1,
    s.proBullet2,
    s.proBullet3,
    s.proBullet4,
    s.proBullet5,
  ];

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing.lg }}>
        <MFText variant="display" style={{ textAlign: 'center' }}>
          🧕
        </MFText>
        <MFText variant="caption" color={colors.gold} style={styles.eyebrow}>
          MODESTFIT ATELIER VIP
        </MFText>
        <MFText variant="h1" style={{ textAlign: 'center', marginTop: 4 }}>
          {s.paywallTitle}
        </MFText>
        <MFText
          variant="bodySmall"
          color={colors.textSecondary}
          style={{ textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.md }}
        >
          {s.paywallSubtitle}
        </MFText>

        {/* Feature Bullets Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              borderColor: colors.border,
            },
          ]}
        >
          {bullets.map((b) => (
            <View key={b} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View
                style={[
                  styles.checkCircle,
                  { backgroundColor: colors.goldMuted, borderColor: colors.gold },
                ]}
              >
                <MFText variant="caption" color={colors.gold} style={styles.checkText}>
                  ✓
                </MFText>
              </View>
              <MFText variant="body" style={{ flex: 1 }}>
                {b}
              </MFText>
            </View>
          ))}
        </View>

        {/* Plan Selector */}
        {!isPro && (
          <View style={styles.planContainer}>
            {/* Annual Plan (Hero) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                setSelectedPlan('annual');
              }}
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedPlan === 'annual' ? colors.gold : colors.border,
                  borderWidth: selectedPlan === 'annual' ? 2 : 1,
                },
              ]}
            >
              <View style={[styles.heroBadge, { backgroundColor: colors.gold }]}>
                <MFText variant="caption" color="#FFFFFF" style={styles.heroBadgeText}>
                  {s.paywallHeroBadge}
                </MFText>
              </View>
              <View style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <MFText variant="h3" color={colors.textPrimary}>
                    {s.paywallAnnualPlan}
                  </MFText>
                  <MFText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {annualPrice ? `${annualPrice} / yr` : s.paywallAnnualTrial}
                  </MFText>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedPlan === 'annual' ? colors.gold : colors.border,
                      backgroundColor: selectedPlan === 'annual' ? colors.gold : 'transparent',
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Weekly Plan */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                void Haptics.selectionAsync().catch(() => {});
                setSelectedPlan('weekly');
              }}
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedPlan === 'weekly' ? colors.gold : colors.border,
                  borderWidth: selectedPlan === 'weekly' ? 2 : 1,
                  marginTop: 10,
                },
              ]}
            >
              <View style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <MFText variant="body" style={{ fontWeight: '700' }} color={colors.textPrimary}>
                    {s.paywallWeeklyPlan}
                  </MFText>
                  <MFText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {weeklyPrice ? `${weeklyPrice} / wk` : 'Billed weekly · cancel anytime'}
                  </MFText>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedPlan === 'weekly' ? colors.gold : colors.border,
                      backgroundColor: selectedPlan === 'weekly' ? colors.gold : 'transparent',
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{ marginTop: spacing.md }}>
          {isPro ? (
            <View style={[styles.alreadyProBox, { backgroundColor: colors.goldMuted, borderColor: colors.gold }]}>
              <MFText variant="body" color={colors.gold} style={{ textAlign: 'center', fontWeight: '700' }}>
                👑 {s.alreadyPro}
              </MFText>
            </View>
          ) : (
            <>
              <Button
                title={selectedPlan === 'annual' ? s.subscribe : 'Subscribe Weekly'}
                onPress={() => void handleSubscribe()}
                loading={busy}
              />
              <Button
                title={s.restore}
                variant="ghost"
                onPress={() => void handleRestore()}
                style={{ marginTop: spacing.xs }}
              />
            </>
          )}
        </View>

        <MFText
          variant="caption"
          color={colors.textTertiary}
          style={{ textAlign: 'center', marginTop: spacing.sm }}
        >
          {s.termsNote}
        </MFText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 6,
  },
  card: {
    borderWidth: 1,
    padding: 16,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkText: {
    fontSize: 11,
    fontWeight: '800',
  },
  planContainer: {
    marginTop: 14,
  },
  planCard: {
    padding: 14,
    borderRadius: 14,
    position: 'relative',
  },
  heroBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  alreadyProBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
