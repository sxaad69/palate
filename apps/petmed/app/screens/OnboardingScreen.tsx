import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PawText } from '../components/PawText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { t, type Lang } from '../lib/i18n';
import { usePaw } from '../store/app';
import { requestNotificationPermissions } from '../lib/notifications';

const SLIDES = [
  { icon: '🐾', titleKey: 'slide1Title', bodyKey: 'slide1Body' },
  { icon: '⏰', titleKey: 'slide2Title', bodyKey: 'slide2Body' },
  { icon: '🩺', titleKey: 'slide3Title', bodyKey: 'slide3Body' },
] as const;

export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { setOnboarded, setLanguage, lang } = usePaw();
  const [step, setStep] = useState(0);
  const strings = t();
  const last = step === SLIDES.length - 1;

  const finish = () => setOnboarded(true);

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            {(['en', 'ar'] as Lang[]).map((l) => (
              <Chip key={l} label={l === 'en' ? 'English' : 'العربية'} selected={lang === l} onPress={() => setLanguage(l)} />
            ))}
          </View>
          <View style={{ alignItems: 'center', marginTop: spacing['2xl'] }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.accentMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PawText variant="display">{SLIDES[step]?.icon}</PawText>
            </View>
            <PawText variant="h1" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
              {strings[SLIDES[step]?.titleKey ?? 'slide1Title']}
            </PawText>
            <PawText
              variant="body"
              color={colors.textSecondary}
              style={{ marginTop: spacing.sm, textAlign: 'center' }}
            >
              {strings[SLIDES[step]?.bodyKey ?? 'slide1Body']}
            </PawText>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg }}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === step ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === step ? colors.accent : colors.border,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
          {!last ? (
            <Button title={strings.continue} onPress={() => setStep(step + 1)} />
          ) : (
            <>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radii.lg,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: spacing.md,
                }}
              >
                <PawText variant="h3">{strings.notifTitle}</PawText>
                <PawText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
                  {strings.notifBody}
                </PawText>
                <Button
                  title={strings.enableReminders}
                  variant="secondary"
                  size="sm"
                  onPress={() => void requestNotificationPermissions()}
                  style={{ marginTop: spacing.sm }}
                />
              </View>
              <Button title={strings.getStarted} onPress={finish} />
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}
