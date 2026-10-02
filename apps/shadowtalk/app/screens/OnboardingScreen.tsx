import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { getLang, setLang as setI18nLang, t, type Lang } from '../lib/i18n';
import { useShadow } from '../store/app';
import type { PackDirection } from '../data/phrases';
import { Screen } from '../components/Screen';
import { EchoText } from '../components/EchoText';
import { Button } from '../components/Button';

// 5 steps: language pick → 3 value slides → direction pick + mic rationale.
export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { setOnboarded, setLanguage, setDirection, direction } = useShadow();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<PackDirection>(direction);
  const s = t();

  const slides = [
    { title: s.onboarding1Title, body: s.onboarding1Body, glyph: '👂' },
    { title: s.onboarding2Title, body: s.onboarding2Body, glyph: '🎙️' },
    { title: s.onboarding3Title, body: s.onboarding3Body, glyph: '⚖️' },
  ];

  function pickLang(l: Lang) {
    setI18nLang(l);
    setLanguage(l);
  }

  function finish() {
    setDirection(dir);
    setOnboarded(true);
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'center' }}>
        {step === 0 && (
          <View style={{ gap: spacing.lg }}>
            <EchoText variant="display" style={{ textAlign: 'center' }}>
              {s.appName}
            </EchoText>
            <EchoText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              {s.tagline}
            </EchoText>
            <EchoText variant="h3" style={{ textAlign: 'center' }}>
              {s.pickYourLanguage}
            </EchoText>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button
                title="English"
                variant={getLang() === 'en' ? 'primary' : 'secondary'}
                onPress={() => pickLang('en')}
                style={{ flex: 1 }}
              />
              <Button
                title="العربية"
                variant={getLang() === 'ar' ? 'primary' : 'secondary'}
                onPress={() => pickLang('ar')}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

        {step >= 1 && step <= 3 && (
          <View style={{ gap: spacing.lg, alignItems: 'center' }}>
            <EchoText variant="display">{slides[step - 1]!.glyph}</EchoText>
            <EchoText variant="h1" style={{ textAlign: 'center' }}>
              {slides[step - 1]!.title}
            </EchoText>
            <EchoText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              {slides[step - 1]!.body}
            </EchoText>
            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    width: i === step ? spacing.lg : spacing.sm,
                    height: spacing.sm,
                    borderRadius: radii.full,
                    backgroundColor: i === step ? colors.accent : colors.border,
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={{ gap: spacing.lg }}>
            <EchoText variant="h1" style={{ textAlign: 'center' }}>
              {s.pickDirection}
            </EchoText>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Button
                title={s.dirArEn}
                variant={dir === 'ar-en' ? 'primary' : 'secondary'}
                onPress={() => setDir('ar-en')}
                style={{ flex: 1 }}
              />
              <Button
                title={s.dirEnAr}
                variant={dir === 'en-ar' ? 'primary' : 'secondary'}
                onPress={() => setDir('en-ar')}
                style={{ flex: 1 }}
              />
            </View>
            <View
              style={{
                backgroundColor: colors.surfaceAlt,
                borderRadius: radii.md,
                padding: spacing.md,
              }}
            >
              <EchoText variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center' }}>
                🎙️ {s.onboarding2Body}
              </EchoText>
              <EchoText
                variant="caption"
                color={colors.textTertiary}
                style={{ textAlign: 'center', marginTop: spacing.xs }}
              >
                {s.onboardingMicNote}
              </EchoText>
            </View>
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Button
            title={step === 4 ? s.start : s.continue}
            onPress={() => (step === 4 ? finish() : setStep(step + 1))}
            size="lg"
          />
        </View>
      </View>
    </Screen>
  );
}
