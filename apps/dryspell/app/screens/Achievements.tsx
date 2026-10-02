import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings, type Locale } from '../lib/strings';
import { useSobriety } from '../store/sobriety';

interface Badge {
  id: string;
  days?: number;
  money?: number;
  en: string;
  ar: string;
}

const BADGES: Badge[] = [
  { id: 'd1', days: 1, en: 'First sunrise', ar: 'أول شروق' },
  { id: 'd3', days: 3, en: 'Three strong', ar: 'ثلاثة بقوة' },
  { id: 'd7', days: 7, en: 'One full week', ar: 'أسبوع كامل' },
  { id: 'd14', days: 14, en: 'Fortnight', ar: 'أسبوعان' },
  { id: 'd30', days: 30, en: 'Moon cycle', ar: 'دورة قمرية' },
  { id: 'd60', days: 60, en: 'Two months deep', ar: 'شهران بعمق' },
  { id: 'd90', days: 90, en: 'Quarter year', ar: 'ربع عام' },
  { id: 'd180', days: 180, en: 'Half year hero', ar: 'بطل نصف العام' },
  { id: 'd365', days: 365, en: 'Full circle', ar: 'دائرة كاملة' },
  { id: 'm100', money: 100, en: 'First hundred saved', ar: 'أول مئة مُدخرة' },
  { id: 'm500', money: 500, en: 'Half grand saved', ar: 'خمسمئة مُدخرة' },
  { id: 'm1000', money: 1000, en: 'Grand saved', ar: 'ألف مُدخرة' },
  { id: 'm5000', money: 5000, en: 'Five grand saved', ar: 'خمسة آلاف مُدخرة' },
];

function badgeName(b: Badge, locale: Locale) {
  return locale === 'ar' ? b.ar : b.en;
}

function badgeDetail(b: Badge, t: { msDays: string; currency: string }) {
  if (b.days) return `${b.days} ${t.msDays}`;
  return `${t.currency}${(b.money ?? 0).toLocaleString('en-US')}`;
}

export function AchievementsScreen() {
  const { colors, spacing } = useTheme();
  const { t, locale } = useStrings();
  const { daysClean, moneySaved } = useSobriety();

  const unlocked = (b: Badge) =>
    (b.days !== undefined && daysClean >= b.days) ||
    (b.money !== undefined && moneySaved >= b.money);

  const count = BADGES.filter(unlocked).length;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md }}>{t.achTitle}</Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {t.achUnlocked}: {count}/{BADGES.length}
        </Text>
        <View style={styles.grid}>
          {BADGES.map((b) => {
            const isUnlocked = unlocked(b);
            return (
              <Card
                key={b.id}
                tone={isUnlocked ? 'gold' : 'default'}
                style={[styles.badge, { opacity: isUnlocked ? 1 : 0.55 }]}
              >
                <Text variant="display" style={{ textAlign: 'center' }}>
                  {isUnlocked ? '🏅' : '🔒'}
                </Text>
                <Text variant="bodySmall" style={{ textAlign: 'center', fontWeight: '500', marginTop: 4 }}>
                  {badgeName(b, locale)}
                </Text>
                <Text variant="caption" color="textSecondary" style={{ textAlign: 'center' }}>
                  {isUnlocked ? t.achUnlocked : badgeDetail(b, t)}
                </Text>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { width: '48%', alignItems: 'center' },
});
