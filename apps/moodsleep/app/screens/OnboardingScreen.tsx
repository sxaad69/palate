import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { RestoryText } from '../components/RestoryText';
import { Button } from '../components/Button';
import { useRestory } from '../store/app';
import { getLang, t, type Lang } from '../lib/i18n';

const SLIDES = [
  {
    title: { en: 'Your sleep writes your days', ar: 'نومك يكتب أيامك' },
    body: {
      en: "Every night writes the next day. Restory starts with last night's sleep — not another mood checkbox.",
      ar: 'كل ليلة تكتب اليوم التالي. ريستوري يبدأ من نوم الليلة الماضية — لا من خانة مزاج أخرى.',
    },
  },
  {
    title: { en: 'Twenty seconds, twice a day', ar: 'عشرون ثانية، مرتين في اليوم' },
    body: {
      en: 'One tap for sleep, one tap for mood, one optional line. Under 30 seconds — morning and night.',
      ar: 'نقرة للنوم، ونقرة للمزاج، وسطر اختياري واحد. أقل من ٣٠ ثانية — صباحًا ومساءً.',
    },
  },
  {
    title: { en: 'The pattern is yours', ar: 'النمط نمطك أنت' },
    body: {
      en: 'Restory finds your own sleep↔mood pattern — how many mood points a good night is worth to you, computed on your phone from your data.',
      ar: 'ريستوري يكتشف نمط نومك ومزاجك الخاص — كم نقطة مزاج تستحقها ليلة نوم جيدة، يُحسب على هاتفك من بياناتك.',
    },
  },
];

export function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const { setOnboarded, setLanguage } = useRestory();
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
          <RestoryText variant="h1" color={colors.accent} style={styles.moon}>
            ☾
          </RestoryText>
          <RestoryText variant="display" style={styles.title}>
            {t().appName}
          </RestoryText>
          <RestoryText variant="h2" color={colors.accent} style={styles.slideTitle}>
            {slide.title[lang]}
          </RestoryText>
          <RestoryText variant="body" color={colors.textSecondary} style={styles.body}>
            {slide.body[lang]}
          </RestoryText>
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
  moon: { marginBottom: 12 },
  title: { marginBottom: 24, letterSpacing: 4 },
  slideTitle: { textAlign: 'center', marginBottom: 12 },
  body: { textAlign: 'center', maxWidth: 320 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
