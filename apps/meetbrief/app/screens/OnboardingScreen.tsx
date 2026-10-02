import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useMeetBrief } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';
import { getMicStatus, requestMic, type MicStatus } from '../lib/audio';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Button } from '../components/Button';

const SLIDES = [
  { icon: '🎙️', titleKey: 'ob1Title', bodyKey: 'ob1Body' },
  { icon: '✅', titleKey: 'ob2Title', bodyKey: 'ob2Body' },
  { icon: '🔒', titleKey: 'ob3Title', bodyKey: 'ob3Body' },
] as const;

function LangToggle() {
  const { colors, spacing, radii } = useTheme();
  const { setLanguage } = useMeetBrief();
  const [lang, setLangLocal] = useState<Lang>(getLang());
  const pick = (l: Lang) => {
    setLang(l);
    setLangLocal(l);
    setLanguage(l);
  };
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      {(['en', 'ar'] as Lang[]).map((l) => {
        const active = lang === l;
        return (
          <Pressable
            key={l}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => pick(l)}
            android_ripple={{ color: colors.overlay }}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radii.full,
              backgroundColor: active ? colors.accent : colors.surfaceAlt,
              minHeight: 44,
              justifyContent: 'center',
            }}
          >
            <MeetText
              variant="bodySmall"
              color={active ? colors.textInverse : colors.textSecondary}
            >
              {l === 'en' ? 'English' : 'العربية'}
            </MeetText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function OnboardingScreen() {
  const { colors, spacing } = useTheme();
  const { setOnboarded } = useMeetBrief();
  const [index, setIndex] = useState(0);
  const [micStatus, setMicStatus] = useState<MicStatus | null>(null);
  const [requesting, setRequesting] = useState(false);
  const strings = t();
  const slide = SLIDES[index]!; // index is bounded by the dots/buttons below
  const last = index === SLIDES.length - 1;

  const askMic = async () => {
    setRequesting(true);
    const existing = await getMicStatus();
    if (existing === 'granted') {
      setMicStatus('granted');
    } else {
      setMicStatus((await requestMic()) ? 'granted' : 'denied');
    }
    setRequesting(false);
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.md, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'flex-end' }}>
          <LangToggle />
        </View>

        <View style={{ alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md }}>
          <MeetText variant="display">{slide.icon}</MeetText>
          <MeetText variant="h1" style={{ textAlign: 'center' }}>
            {strings[slide.titleKey]}
          </MeetText>
          <MeetText
            variant="body"
            color={colors.textSecondary}
            style={{ textAlign: 'center' }}
          >
            {strings[slide.bodyKey]}
          </MeetText>

          {last && (
            <View
              style={{
                marginTop: spacing.md,
                width: '100%',
                backgroundColor: colors.surfaceAlt,
                borderRadius: 16,
                padding: spacing.md,
                gap: spacing.sm,
              }}
            >
              <MeetText variant="bodySmall" color={colors.textSecondary}>
                {strings.micRationale}
              </MeetText>
              <Button
                title={
                  micStatus === 'granted'
                    ? strings.micGranted
                    : micStatus === 'denied'
                      ? strings.micDenied
                      : strings.allowMic
                }
                onPress={askMic}
                loading={requesting}
                disabled={micStatus === 'granted'}
                variant={micStatus === 'granted' ? 'secondary' : 'primary'}
              />
            </View>
          )}
        </View>

        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm }}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === index ? colors.accent : colors.border,
                }}
              />
            ))}
          </View>
          <Button
            title={last ? strings.getStarted : strings.continue}
            onPress={() => (last ? setOnboarded(true) : setIndex(index + 1))}
          />
        </View>
      </View>
    </Screen>
  );
}
