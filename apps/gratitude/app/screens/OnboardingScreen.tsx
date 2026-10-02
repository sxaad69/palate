import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTG } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';
import { ensureReminder, cancelReminder, type ReminderTime } from '../lib/reminders';

const PRESETS: (ReminderTime & { period: 'morning' | 'afternoon' | 'evening' })[] = [
  { hour: 7, minute: 0, period: 'morning' },
  { hour: 12, minute: 30, period: 'afternoon' },
  { hour: 18, minute: 0, period: 'evening' },
  { hour: 21, minute: 0, period: 'evening' },
];

function fmt(rt: ReminderTime, lang: Lang): string {
  const h12 = rt.hour % 12 === 0 ? 12 : rt.hour % 12;
  const mm = `${rt.minute}`.padStart(2, '0');
  const suffix = rt.hour < 12 ? t().morning : rt.hour < 18 ? t().afternoon : t().evening;
  void lang;
  return lang === 'ar' ? `${h12}:${mm} ${suffix}` : `${h12}:${mm} ${suffix}`;
}

export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { setOnboarded, setLanguage, setReminder } = useTG();
  const [slide, setSlide] = useState(0);
  const [langPick, setLangPick] = useState<Lang>(getLang());
  const [preset, setPreset] = useState<ReminderTime | null>({ hour: 21, minute: 0 });

  const pickLang = (l: Lang) => {
    setLang(l);
    setLangPick(l);
  };

  const finish = async () => {
    setLanguage(langPick);
    setReminder(preset);
    if (preset) await ensureReminder(preset);
    else await cancelReminder();
    setOnboarded(true);
  };

  return (
    <Screen scroll={false}>
      <View style={[styles.root, { padding: spacing.lg }]}>
        {slide === 0 && (
          <>
            <AppText variant="display" style={styles.sun}>
              ☀
            </AppText>
            <AppText variant="display" style={styles.center}>
              {t().slide1Title}
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={[styles.center, { marginTop: spacing.md }]}>
              {t().slide1Body}
            </AppText>
          </>
        )}

        {slide === 1 && (
          <>
            <AppText variant="h1" style={[styles.center, { marginBottom: spacing.lg }]}>
              {t().slide2Title}
            </AppText>
            {[t().slide2b1, t().slide2b2, t().slide2b3].map((b) => (
              <Card key={b} style={{ padding: spacing.md, marginBottom: spacing.sm }}>
                <AppText variant="body">{b}</AppText>
              </Card>
            ))}
          </>
        )}

        {slide === 2 && (
          <>
            <AppText variant="h1" style={[styles.center, { marginBottom: spacing.lg }]}>
              {t().slide3Title}
            </AppText>
            <AppText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
              {t().langLabel}
            </AppText>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
              {(['en', 'ar'] as const).map((l) => (
                <Pressable
                  key={l}
                  onPress={() => pickLang(l)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: langPick === l }}
                  style={[styles.row, { borderBottomColor: colors.border }]}
                >
                  <AppText variant="body">{l === 'en' ? 'English' : 'العربية'}</AppText>
                  <AppText variant="body" color={colors.accent}>
                    {langPick === l ? '●' : '○'}
                  </AppText>
                </Pressable>
              ))}
            </View>

            <AppText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
              {t().reminderLabel}
            </AppText>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
              {PRESETS.map((p) => {
                const active = preset?.hour === p.hour && preset?.minute === p.minute;
                return (
                  <Pressable
                    key={`${p.hour}:${p.minute}`}
                    onPress={() => setPreset({ hour: p.hour, minute: p.minute })}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.row, { borderBottomColor: colors.border }]}
                  >
                    <AppText variant="body">{fmt(p, langPick)}</AppText>
                    <AppText variant="body" color={colors.accent}>
                      {active ? '●' : '○'}
                    </AppText>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setPreset(null)}
                accessibilityRole="button"
                accessibilityState={{ selected: preset === null }}
                style={[styles.row, { borderBottomWidth: 0 }]}
              >
                <AppText variant="body">{t().noReminder}</AppText>
                <AppText variant="body" color={colors.accent}>
                  {preset === null ? '●' : '○'}
                </AppText>
              </Pressable>
            </View>
          </>
        )}

        <View style={{ flex: 1 }} />
        <View style={[styles.dots, { marginBottom: spacing.md }]}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === slide ? colors.accent : colors.borderStrong },
              ]}
            />
          ))}
        </View>
        {slide < 2 ? (
          <Button title={t().continue} onPress={() => setSlide(slide + 1)} size="lg" />
        ) : (
          <Button title={t().begin} onPress={finish} size="lg" />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { textAlign: 'center' },
  sun: { textAlign: 'center', fontSize: 64, marginBottom: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  card: { borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
});
