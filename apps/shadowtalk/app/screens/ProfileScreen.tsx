import React from 'react';
import { View } from 'react-native';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { t, type Lang } from '../lib/i18n';
import { useShadow } from '../store/app';
import type { PackDirection } from '../data/phrases';
import { Screen } from '../components/Screen';
import { EchoText } from '../components/EchoText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <EchoText variant="h3">{label}</EchoText>
      {children}
    </View>
  );
}

export function ProfileScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, spacing } = useTheme();
  const { themeMode, setThemeMode } = useTheme();
  const { lang, setLanguage, direction, setDirection, voiceRate, setVoiceRate, isPro, attemptsLeftToday } =
    useShadow();
  const s = t();

  const themeOptions: { id: ThemeMode; label: string }[] = [
    { id: 'light', label: s.light },
    { id: 'dark', label: s.dark },
    { id: 'system', label: s.system },
  ];
  const langOptions: { id: Lang; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'ar', label: 'العربية' },
  ];
  const dirOptions: { id: PackDirection; label: string }[] = [
    { id: 'ar-en', label: s.dirArEn },
    { id: 'en-ar', label: s.dirEnAr },
  ];
  const rateOptions: { id: number; label: string }[] = [
    { id: 0.65, label: '🐢' },
    { id: 0.85, label: '▶' },
    { id: 1.0, label: '🐇' },
  ];

  function optionBar<T extends string | number>(
    options: { id: T; label: string }[],
    selected: T,
    onPick: (id: T) => void,
  ) {
    return (
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {options.map((o) => (
          <Button
            key={String(o.id)}
            title={o.label}
            variant={selected === o.id ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => onPick(o.id)}
            style={{ flex: 1 }}
          />
        ))}
      </View>
    );
  }

  return (
    <Screen>
      <View style={{ marginTop: spacing.sm, gap: spacing.lg }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <EchoText variant="h2">{s.appName}</EchoText>
              <EchoText variant="caption" color={colors.textSecondary}>
                {isPro ? 'Pro' : `${s.free} · ${attemptsLeftToday} ${s.attemptsLeft}`}
              </EchoText>
            </View>
            {!isPro && <Button title={s.goPro} onPress={onPaywall} />}
          </View>
        </Card>

        <Row label={s.appearance}>{optionBar(themeOptions, themeMode, setThemeMode)}</Row>
        <Row label={s.yourInterface}>{optionBar(langOptions, lang, setLanguage)}</Row>
        <Row label={s.learningDirection}>{optionBar(dirOptions, direction, setDirection)}</Row>
        <Row label={s.ttsRate}>
          {optionBar(rateOptions, voiceRate, setVoiceRate)}
        </Row>

        <EchoText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
          {s.signInLater}
        </EchoText>
      </View>
    </Screen>
  );
}
