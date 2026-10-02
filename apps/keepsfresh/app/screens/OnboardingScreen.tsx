import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Button } from '../components/Button';
import { useKeeps } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';

const SLIDES = [
  {
    glyph: '🥬',
    title: { en: 'Nothing goes to waste', ar: 'لا شيء يذهب هدراً' },
    body: {
      en: 'Log your groceries with expiry dates. KeepsFresh keeps the whole pantry in one place.',
      ar: 'سجّل مشترياتك مع تواريخ الانتهاء. KeepsFresh يجمع مخزنك كله في مكان واحد.',
    },
  },
  {
    glyph: '⏳',
    title: { en: 'Use soon, not too late', ar: 'استخدم قريباً، لا متأخراً' },
    body: {
      en: 'Your “use soon” queue is sorted by waste risk — days left, quantity, and how perishable it is.',
      ar: 'قائمة «استخدم قريباً» مرتبة حسب خطر الهدر — الأيام المتبقية والكمية وسرعة التلف.',
    },
  },
  {
    glyph: '💰',
    title: { en: 'Watch your savings grow', ar: 'شاهد مدخراتك تنمو' },
    body: {
      en: 'Every item you use up before it spoils adds to your waste-saved counter.',
      ar: 'كل صنف تستهلكه قبل فساده يُضاف إلى عدّاد التوفير من الهدر.',
    },
  },
];

export function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const { setOnboarded, setLanguage } = useKeeps();
  const [idx, setIdx] = useState(0);
  const lang = getLang();
  const slide = SLIDES[idx]!;
  const last = idx === SLIDES.length - 1;

  return (
    <Screen scroll={false}>
      <View style={[styles.root, { padding: spacing.lg }]}>
        <View style={styles.langRow}>
          {(['en', 'ar'] as Lang[]).map((l) => (
            <Button
              key={l}
              title={l === 'en' ? 'English' : 'العربية'}
              variant={lang === l ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => setLanguage(l)}
            />
          ))}
        </View>

        <View style={styles.center}>
          <KText variant="display" style={styles.glyph}>
            {slide.glyph}
          </KText>
          <KText variant="display" style={styles.title}>
            {t().appName}
          </KText>
          <KText variant="h2" color={colors.accent} style={styles.slideTitle}>
            {slide.title[lang]}
          </KText>
          <KText variant="body" color={colors.textSecondary} style={styles.body}>
            {slide.body[lang]}
          </KText>
        </View>

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === idx ? colors.accent : colors.borderStrong },
              ]}
            />
          ))}
        </View>

        <Button
          title={last ? t().start : t().continue}
          onPress={() => (last ? setOnboarded(true) : setIdx(idx + 1))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  langRow: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  center: { alignItems: 'center', gap: 8 },
  glyph: { fontSize: 64 },
  title: { textAlign: 'center' },
  slideTitle: { textAlign: 'center', marginTop: 8 },
  body: { textAlign: 'center', marginTop: 4, maxWidth: 320 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
