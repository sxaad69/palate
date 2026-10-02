import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import type { ModestyPrefs } from '../data/pieces';
import { DEFAULT_PREFS } from '../data/pieces';

const SLIDES = [
  { glyph: '🧕', titleKey: 'onb1Title', descKey: 'onb1Desc' },
  { glyph: '📅', titleKey: 'onb2Title', descKey: 'onb2Desc' },
  { glyph: '✨', titleKey: 'onb3Title', descKey: 'onb3Desc' },
] as const;

export function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const { setOnboarded, setLanguage, setPrefs } = useModestFit();
  const [step, setStep] = useState(0);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [prefs, setPrefsLocal] = useState<ModestyPrefs>(DEFAULT_PREFS);
  const s = t();

  const pickLang = (l: Lang) => {
    setLang(l);
    setLangState(l);
    setLanguage(l);
  };

  const finish = () => {
    setPrefs(prefs);
    setOnboarded(true);
  };

  return (
    <Screen>
      {step < 3 ? (
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing['2xl'] }}>
          <MFText variant="display" style={{ textAlign: 'center', fontSize: 64 }}>
            {SLIDES[step]?.glyph}
          </MFText>
          <MFText variant="h1" style={{ textAlign: 'center', marginTop: spacing.lg }}>
            {s[SLIDES[step]?.titleKey ?? 'onb1Title']}
          </MFText>
          <MFText
            variant="body"
            color={colors.textSecondary}
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            {s[SLIDES[step]?.descKey ?? 'onb1Desc']}
          </MFText>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === step ? colors.accent : colors.border,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
          <Button
            title={step === 2 ? s.start : s.continue}
            onPress={() => setStep(step + 1)}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      ) : step === 3 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <MFText variant="h1" style={{ textAlign: 'center' }}>
            {s.langPrompt}
          </MFText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: spacing.lg,
            }}
          >
            <Chip label="English" selected={lang === 'en'} onPress={() => pickLang('en')} />
            <Chip label="العربية" selected={lang === 'ar'} onPress={() => pickLang('ar')} />
          </View>
          <Button title={s.continue} onPress={() => setStep(4)} style={{ marginTop: spacing.xl }} />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <MFText variant="h1" style={{ textAlign: 'center' }}>
            {s.modestyTitle}
          </MFText>
          <MFText
            variant="bodySmall"
            color={colors.textSecondary}
            style={{ textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg }}
          >
            {s.modestyDesc}
          </MFText>

          <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
            {s.prefSleeve}
          </MFText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(['short', 'threeQuarter', 'long'] as const).map((o) => (
              <Chip
                key={o}
                label={s[`sleeve_${o}`]}
                selected={prefs.minSleeve === o}
                onPress={() => setPrefsLocal({ ...prefs, minSleeve: o })}
              />
            ))}
          </View>

          <MFText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
            {s.prefHem}
          </MFText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(['knee', 'midi', 'maxi', 'floor'] as const).map((o) => (
              <Chip
                key={o}
                label={s[`hem_${o}`]}
                selected={prefs.minHem === o}
                onPress={() => setPrefsLocal({ ...prefs, minHem: o })}
              />
            ))}
          </View>

          <MFText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
            {s.prefSheer}
          </MFText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(['opaqueOnly', 'allowSemi'] as const).map((o) => (
              <Chip
                key={o}
                label={s[`sheer_${o}`]}
                selected={prefs.sheer === o}
                onPress={() => setPrefsLocal({ ...prefs, sheer: o })}
              />
            ))}
          </View>

          <Button title={s.done} onPress={finish} style={{ marginTop: spacing.xl }} />
        </View>
      )}
    </Screen>
  );
}
