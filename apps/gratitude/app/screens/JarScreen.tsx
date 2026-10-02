import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { useTG, JAR_MILESTONES } from '../store/app';
import { t, type Lang } from '../lib/i18n';

const JAR_H = 240;

const THEME_NAMES: Record<string, { en: string; ar: string }> = {
  dawn: { en: 'Dawn', ar: 'الفجر' },
  honey: { en: 'Honey', ar: 'العسل' },
  amber: { en: 'Amber', ar: 'الكهرمان' },
  ember: { en: 'Ember', ar: 'الجمر' },
  rose: { en: 'Rose', ar: 'الورد' },
  starlight: { en: 'Starlight', ar: 'ضوء النجوم' },
  aurora: { en: 'Aurora', ar: 'الشفق' },
};

function themeName(id: string, lang: Lang): string {
  const n = THEME_NAMES[id];
  return n ? (lang === 'ar' ? n.ar : n.en) : id;
}

// Tangible, shareable progress: completed days fill a jar with light.
// Streak milestones unlock new jar glow themes.
export function JarScreen() {
  const { colors, spacing, radii } = useTheme();
  const { streak, entriesThisWeek, entries, jarThemeId, setJarThemeId, jarMilestones, lang } = useTG();
  const [confirmUnlock, setConfirmUnlock] = useState<string | null>(null);

  const active = JAR_MILESTONES.find((m) => m.themeId === jarThemeId) ?? JAR_MILESTONES[0];
  const fill = Math.min(1, entriesThisWeek / 7);
  const fillH = Math.max(0, (JAR_H - 16) * fill);

  const pick = (id: string, unlocked: boolean) => {
    if (!unlocked) return;
    setJarThemeId(id);
    setConfirmUnlock(id);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => setConfirmUnlock((c) => (c === id ? null : c)), 1500);
  };

  return (
    <Screen>
      <AppText variant="h1" style={{ marginTop: spacing.md }}>
        {t().jarTitle}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        {t().jarSub}
      </AppText>

      <Card style={[styles.jarCard, { padding: spacing.lg, marginTop: spacing.lg }]}>
        <AppText variant="display" style={{ textAlign: 'center' }}>
          ☀
        </AppText>
        <View style={[styles.jar, { borderColor: colors.borderStrong, borderRadius: radii.xl, marginTop: spacing.md }]}>
          <View
            style={[
              styles.fill,
              {
                height: fillH,
                backgroundColor: active?.color ?? colors.glow,
                borderRadius: radii.lg,
                opacity: 0.9,
              },
            ]}
          />
        </View>
        <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.md }}>
          {entriesThisWeek} {t().jarOf} · {themeName(jarThemeId, lang)}
          {confirmUnlock === jarThemeId ? ' ✓' : ''}
        </AppText>
      </Card>

      <View style={[styles.stats, { marginTop: spacing.lg }]}>
        {[
          { v: `${streak}`, l: t().streakDays },
          { v: `${entries.length}`, l: t().totalDays },
        ].map((s) => (
          <Card key={s.l} style={[styles.stat, { padding: spacing.md }]}>
            <AppText variant="h2" style={{ textAlign: 'center' }}>
              {s.v}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              {s.l}
            </AppText>
          </Card>
        ))}
      </View>

      <AppText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
        {t().milestonesTitle}
      </AppText>
      <AppText variant="caption" color={colors.textTertiary} style={{ marginBottom: spacing.md }}>
        {t().tapToApply}
      </AppText>
      {jarMilestones.map(({ milestone, unlocked }) => (
        <Pressable
          key={milestone.themeId}
          onPress={() => pick(milestone.themeId, unlocked)}
          disabled={!unlocked}
          accessibilityRole="button"
          accessibilityState={{ disabled: !unlocked, selected: jarThemeId === milestone.themeId }}
          style={{ marginBottom: spacing.sm }}
        >
          <Card
            style={[
              styles.mRow,
              {
                padding: spacing.md,
                opacity: unlocked ? 1 : 0.55,
                borderColor: jarThemeId === milestone.themeId ? colors.accent : colors.border,
                borderWidth: jarThemeId === milestone.themeId ? 2 : 1,
              },
            ]}
          >
            <View style={[styles.swatch, { backgroundColor: milestone.color, borderRadius: radii.full }]} />
            <View style={{ flex: 1 }}>
              <AppText variant="body" style={{ fontWeight: '600' }}>
                {themeName(milestone.themeId, lang)}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {milestone.days === 0
                  ? t().free
                  : `${milestone.days} ${t().streakDays}`}
              </AppText>
            </View>
            <AppText variant="body" color={unlocked ? colors.success : colors.textTertiary}>
              {unlocked ? '✓' : '🔒'}
            </AppText>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  jarCard: { alignItems: 'center' },
  jar: {
    width: 150,
    height: JAR_H,
    borderWidth: 3,
    justifyContent: 'flex-end',
    padding: 6,
    overflow: 'hidden',
  },
  fill: { width: '100%' },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1 },
  mRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatch: { width: 28, height: 28 },
});
