import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { FableText } from '../components/FableText';
import { Button } from '../components/Button';
import { useFable } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { getGuidanceDensity, setGuidanceDensity, type GuidanceDensity } from '../lib/speech';
import { PaywallScreen } from './PaywallScreen';

const DENSITIES: GuidanceDensity[] = ['full', 'minimal', 'silent'];
const DENSITY_LABEL: Record<GuidanceDensity, { en: string; ar: string }> = {
  full: { en: 'Full narration', ar: 'سرد كامل' },
  minimal: { en: 'Gentle cues', ar: 'إشارات لطيفة' },
  silent: { en: 'Silent', ar: 'صامت' },
};

export function ProfileScreen() {
  const { colors, spacing, radii, themeMode, setThemeMode, isDark } = useTheme();
  const { lang, setLanguage, isPro } = useFable();
  const [guidance, setGuidance] = useState<GuidanceDensity>(getGuidanceDensity());
  const [showPaywall, setShowPaywall] = useState(false);

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  const changeGuidance = (d: GuidanceDensity) => {
    setGuidanceDensity(d);
    setGuidance(d);
  };

  return (
    <Screen>
      <FableText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        {t().profile}
      </FableText>

      <FableText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {lang === 'ar' ? 'المظهر' : 'Appearance'}
      </FableText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {(['system', 'light', 'dark'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setThemeMode(m)}
            accessibilityRole="button"
            accessibilityState={{ selected: themeMode === m }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <FableText variant="body">{m === 'system' ? (lang === 'ar' ? 'النظام' : 'System') : m === 'light' ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}</FableText>
            <FableText variant="body" color={colors.accent}>{themeMode === m ? '●' : '○'}</FableText>
          </Pressable>
        ))}
      </View>

      <FableText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        {lang === 'ar' ? 'اللغة' : 'Language'}
      </FableText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {(['en', 'ar'] as const).map((l) => (
          <Pressable
            key={l}
            onPress={() => setLanguage(l)}
            accessibilityRole="button"
            accessibilityState={{ selected: lang === l }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <FableText variant="body">{l === 'en' ? 'English' : 'العربية'}</FableText>
            <FableText variant="body" color={colors.accent}>{lang === l ? '●' : '○'}</FableText>
          </Pressable>
        ))}
      </View>

      <FableText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        {lang === 'ar' ? 'التوجيه الصوتي' : 'Voice guidance'}
      </FableText>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {DENSITIES.map((d) => (
          <Pressable
            key={d}
            onPress={() => changeGuidance(d)}
            accessibilityRole="button"
            accessibilityState={{ selected: guidance === d }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <FableText variant="body">{DENSITY_LABEL[d][lang]}</FableText>
            <FableText variant="body" color={colors.accent}>{guidance === d ? '●' : '○'}</FableText>
          </Pressable>
        ))}
      </View>

      <View style={{ height: spacing.xl }} />
      {!isPro && (
        <Button
          title={t().paywallTitle}
          onPress={() => setShowPaywall(true)}
          size="lg"
        />
      )}
      {isPro && (
        <FableText variant="body" color={colors.success} style={{ textAlign: 'center' }}>
          ✦ {lang === 'ar' ? 'عضو Pro' : 'Pro member'}
        </FableText>
      )}
      <View style={{ height: spacing.md }} />
      <FableText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        Fable 1.0.0 · {isDark ? 'night' : 'dawn'} · {lang}
      </FableText>
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
