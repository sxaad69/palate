import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { useTG } from '../store/app';
import { getLang, t, type Lang } from '../lib/i18n';
import { ensureReminder, cancelReminder, type ReminderTime } from '../lib/reminders';
import { PaywallScreen } from './PaywallScreen';

const PRESETS: ReminderTime[] = [
  { hour: 7, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 18, minute: 0 },
  { hour: 21, minute: 0 },
];

function fmt(rt: ReminderTime, lang: Lang): string {
  const h12 = rt.hour % 12 === 0 ? 12 : rt.hour % 12;
  const mm = `${rt.minute}`.padStart(2, '0');
  const suffix = rt.hour < 12 ? t().morning : rt.hour < 18 ? t().afternoon : t().evening;
  void lang;
  return `${h12}:${mm} ${suffix}`;
}

export function ProfileScreen() {
  const { colors, spacing, radii, themeMode, setThemeMode, isDark } = useTheme();
  const { lang, setLanguage, reminder, setReminder, isPro } = useTG();
  const [showPaywall, setShowPaywall] = useState(false);

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  const pickLang = (l: Lang) => setLanguage(l);

  const pickReminder = async (r: ReminderTime | null) => {
    setReminder(r);
    if (r) await ensureReminder(r);
    else await cancelReminder();
  };

  return (
    <Screen>
      <AppText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        {t().profile}
      </AppText>

      <AppText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {t().appearance}
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {(['system', 'light', 'dark'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setThemeMode(m)}
            accessibilityRole="button"
            accessibilityState={{ selected: themeMode === m }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <AppText variant="body">
              {m === 'system' ? (lang === 'ar' ? 'النظام' : 'System') : m === 'light' ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}
            </AppText>
            <AppText variant="body" color={colors.accent}>
              {themeMode === m ? '●' : '○'}
            </AppText>
          </Pressable>
        ))}
      </View>

      <AppText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        {t().language}
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {(['en', 'ar'] as const).map((l) => (
          <Pressable
            key={l}
            onPress={() => pickLang(l)}
            accessibilityRole="button"
            accessibilityState={{ selected: lang === l }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <AppText variant="body">{l === 'en' ? 'English' : 'العربية'}</AppText>
            <AppText variant="body" color={colors.accent}>
              {lang === l ? '●' : '○'}
            </AppText>
          </Pressable>
        ))}
      </View>

      <AppText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        {t().reminder}
      </AppText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {PRESETS.map((p) => {
          const active = reminder?.hour === p.hour && reminder?.minute === p.minute;
          return (
            <Pressable
              key={`${p.hour}:${p.minute}`}
              onPress={() => void pickReminder(p)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.row, { borderBottomColor: colors.border }]}
            >
              <AppText variant="body">{fmt(p, lang)}</AppText>
              <AppText variant="body" color={colors.accent}>
                {active ? '●' : '○'}
              </AppText>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => void pickReminder(null)}
          accessibilityRole="button"
          accessibilityState={{ selected: reminder === null }}
          style={[styles.row, { borderBottomWidth: 0 }]}
        >
          <AppText variant="body">{t().noReminder}</AppText>
          <AppText variant="body" color={colors.accent}>
            {reminder === null ? '●' : '○'}
          </AppText>
        </Pressable>
      </View>

      <View style={{ height: spacing.xl }} />
      {!isPro ? (
        <Button title={t().paywallTitle} onPress={() => setShowPaywall(true)} size="lg" />
      ) : (
        <AppText variant="body" color={colors.success} style={{ textAlign: 'center' }}>
          ✦ {t().proMember}
        </AppText>
      )}
      <View style={{ height: spacing.md }} />
      <AppText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        {t().versionLabel}
      </AppText>
      <AppText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center', marginTop: 4 }}>
        {getLang()} · {isDark ? 'dark' : 'light'}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
});
