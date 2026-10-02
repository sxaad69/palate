import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { FableText } from '../components/FableText';
import { Button } from '../components/Button';
import { useFable } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';

const SLIDES = [
  {
    title: { en: 'Stories you breathe through', ar: 'قصص تتنفّس من خلالها' },
    body: {
      en: 'Every session is a short story. Your breath sets the pace — the tale unfolds as you inhale and release.',
      ar: 'كل جلسة قصة قصيرة. نَفَسُك يحدّد الإيقاع — وتتكشّف الحكاية مع الشهيق والزفير.',
    },
  },
  {
    title: { en: 'Chapters, not exercises', ar: 'فصول، لا تمارين' },
    body: {
      en: 'Return each day to continue the arc. Streaks unlock the next chapter of the story.',
      ar: 'عُد كل يوم لمواصلة الحكاية. الأيام المتتالية تفتح الفصل التالي من القصة.',
    },
  },
  {
    title: { en: 'Your storyteller', ar: 'الراوي الخاص بك' },
    body: {
      en: 'Choose how much guidance you hear — full narration, gentle cues, or silence with the breath ring.',
      ar: 'اختر مقدار التوجيه الذي تسمعه — سرد كامل، أو إشارات لطيفة، أو صمت مع حلقة التنفس.',
    },
  },
];

export function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const { setOnboarded, setLanguage } = useFable();
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
          <FableText variant="display" style={styles.title}>
            {t().appName}
          </FableText>
          <FableText variant="h2" color={colors.accent} style={styles.slideTitle}>
            {slide.title[lang]}
          </FableText>
          <FableText variant="body" color={colors.textSecondary} style={styles.body}>
            {slide.body[lang]}
          </FableText>
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
  root: { flex: 1 },
  langRow: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 24, letterSpacing: 4 },
  slideTitle: { textAlign: 'center', marginBottom: 12 },
  body: { textAlign: 'center', maxWidth: 320 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
