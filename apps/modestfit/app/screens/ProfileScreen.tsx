import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { setLang, t, type Lang } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import type { RootStackParamList } from '../navigation';

export function ProfileScreen() {
  const { colors, spacing, radii } = useTheme();
  const { themeMode, setThemeMode, lang, setLanguage, prefs, setPrefs, isPro, pieces } =
    useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = t();

  const pickLang = (l: Lang) => {
    setLang(l);
    setLanguage(l);
  };

  const rowStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  };

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.md }}>
        {s.profileTitle}
      </MFText>

      <View style={rowStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <MFText variant="h3">{s.yourPlan}</MFText>
            <MFText variant="bodySmall" color={colors.textSecondary}>
              {isPro ? s.proPlan : `${s.freePlan} · ${pieces.length}/20`}
            </MFText>
          </View>
          {!isPro && (
            <Button title={s.upgrade} size="sm" onPress={() => nav.navigate('Paywall')} />
          )}
        </View>
      </View>

      <View style={rowStyle}>
        <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
          {s.appearance}
        </MFText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
            <Chip
              key={m}
              label={m === 'light' ? s.themeLight : m === 'dark' ? s.themeDark : s.themeSystem}
              selected={themeMode === m}
              onPress={() => setThemeMode(m)}
            />
          ))}
        </View>
      </View>

      <View style={rowStyle}>
        <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
          {s.language}
        </MFText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Chip label="English" selected={lang === 'en'} onPress={() => pickLang('en')} />
          <Chip label="العربية" selected={lang === 'ar'} onPress={() => pickLang('ar')} />
        </View>
      </View>

      <View style={rowStyle}>
        <MFText variant="h3" style={{ marginBottom: spacing.xs }}>
          {s.modestyPrefs}
        </MFText>
        <MFText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.sm }}>
          {s.prefSleeve}
        </MFText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['short', 'threeQuarter', 'long'] as const).map((o) => (
            <Chip
              key={o}
              label={s[`sleeve_${o}`]}
              selected={prefs.minSleeve === o}
              onPress={() => setPrefs({ ...prefs, minSleeve: o })}
            />
          ))}
        </View>
        <MFText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.sm }}>
          {s.prefHem}
        </MFText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['knee', 'midi', 'maxi', 'floor'] as const).map((o) => (
            <Chip
              key={o}
              label={s[`hem_${o}`]}
              selected={prefs.minHem === o}
              onPress={() => setPrefs({ ...prefs, minHem: o })}
            />
          ))}
        </View>
        <MFText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.sm }}>
          {s.prefSheer}
        </MFText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(['opaqueOnly', 'allowSemi'] as const).map((o) => (
            <Chip
              key={o}
              label={s[`sheer_${o}`]}
              selected={prefs.sheer === o}
              onPress={() => setPrefs({ ...prefs, sheer: o })}
            />
          ))}
        </View>
      </View>

      <View style={rowStyle}>
        <Button
          title={`📊 ${s.insightsTitle}`}
          variant="ghost"
          onPress={() => nav.navigate('Insights')}
        />
      </View>
    </Screen>
  );
}
