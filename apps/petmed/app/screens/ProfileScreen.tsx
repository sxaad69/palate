import React from 'react';
import { Alert, View } from 'react-native';
import Constants from 'expo-constants';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PawText } from '../components/PawText';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { t, type Lang } from '../lib/i18n';
import { usePaw } from '../store/app';
import { setProLocal } from '../lib/billing';

interface Props {
  onOpenPaywall: () => void;
}

export function ProfileScreen({ onOpenPaywall }: Props) {
  const { colors, spacing, themeMode, setThemeMode } = useTheme();
  const { lang, setLanguage, isPro, setPro, eraseAll } = usePaw();
  const strings = t();

  const confirmErase = () => {
    Alert.alert(strings.eraseData, strings.eraseConfirm, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.delete,
        style: 'destructive',
        onPress: () => {
          eraseAll();
          void setProLocal(false);
          setPro(false);
        },
      },
    ]);
  };

  return (
    <Screen>
      <PawText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        {strings.tabProfile}
      </PawText>

      <Card style={{ marginBottom: spacing.md }}>
        <PawText variant="h3" style={{ marginBottom: spacing.sm }}>{strings.appearance}</PawText>
        <View style={{ flexDirection: 'row' }}>
          {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
            <Chip
              key={m}
              label={m === 'system' ? strings.themeSystem : m === 'light' ? strings.themeLight : strings.themeDark}
              selected={themeMode === m}
              onPress={() => setThemeMode(m)}
            />
          ))}
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <PawText variant="h3" style={{ marginBottom: spacing.sm }}>{strings.language}</PawText>
        <View style={{ flexDirection: 'row' }}>
          {(['en', 'ar'] as Lang[]).map((l) => (
            <Chip key={l} label={l === 'en' ? 'English' : 'العربية'} selected={lang === l} onPress={() => setLanguage(l)} />
          ))}
        </View>
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <PawText variant="h3" style={{ marginBottom: spacing.sm }}>
          {isPro ? strings.proActive : 'Pawscript Pro'}
        </PawText>
        <PawText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
          {isPro ? strings.proPlan : strings.freePlan}
        </PawText>
        {!isPro && <Button title={strings.unlockPro} onPress={onOpenPaywall} />}
      </Card>

      <Button title={strings.eraseData} variant="destructive" onPress={confirmErase} style={{ marginBottom: spacing.md }} />

      <PawText variant="caption" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {strings.disclaimer}
      </PawText>
      <PawText variant="caption" color={colors.textTertiary}>
        {strings.version} {Constants.expoConfig?.version ?? '1.0.0'}
      </PawText>
    </Screen>
  );
}
