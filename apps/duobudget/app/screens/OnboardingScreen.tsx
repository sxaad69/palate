import React, { useState } from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { TPText } from '../components/TPText';
import { Button } from '../components/Button';
import { useTwoPurse, type StarterSpec } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';
import { CURRENCIES } from '../lib/money';

const SLIDE_GLYPHS = ['✉', '◈', '♡'];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radii.full,
        borderWidth: 1,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: selected ? colors.accentMuted : colors.surface,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
      }}
    >
      <TPText variant="body" color={selected ? colors.accent : colors.textPrimary}>
        {label}
      </TPText>
    </Pressable>
  );
}

export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { completeOnboarding } = useTwoPurse();
  const [slide, setSlide] = useState(0);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [currency, setCurrency] = useState<string>('USD');
  const [meName, setMeName] = useState('');
  const [partnerName, setPartnerName] = useState('');

  const pickLang = (l: Lang) => {
    setLang(l);
    setLangState(l);
  };

  const finish = () => {
    const en = lang === 'en';
    const starters: StarterSpec[] = [
      { name: en ? 'Groceries' : 'بقالة', amount: 400, kind: 'joint', rollover: true, isSavings: false },
      { name: en ? 'Dining out' : 'مطاعم', amount: 150, kind: 'joint', rollover: true, isSavings: false },
      { name: en ? 'Rent & bills' : 'إيجار وفواتير', amount: 900, kind: 'joint', rollover: false, isSavings: false },
      { name: en ? 'Fun money' : 'ترفيه', amount: 120, kind: 'mine', rollover: false, isSavings: false },
      { name: en ? 'Fun money' : 'ترفيه', amount: 120, kind: 'theirs', rollover: false, isSavings: false },
      { name: t().savings, amount: 200, kind: 'joint', rollover: false, isSavings: true },
    ];
    completeOnboarding({
      lang,
      currency,
      meName: meName.trim() || t().you,
      partnerName: partnerName.trim() || t().partner,
      starters,
    });
  };

  const titles = [t().slide1Title, t().slide2Title, t().slide3Title];
  const bodies = [t().slide1Body, t().slide2Body, t().slide3Body];

  return (
    <Screen scroll={false}>
      <View style={[styles.root, { padding: spacing.lg }]}>
        <TPText variant="overline" color={colors.accent} style={styles.center}>
          {t().appName}
        </TPText>
        <TPText variant="display" style={[styles.center, { fontSize: 72, marginVertical: spacing.md }]}>
          {SLIDE_GLYPHS[slide] ?? '✉'}
        </TPText>
        <TPText variant="h1" style={styles.center}>
          {titles[slide]}
        </TPText>
        <TPText
          variant="body"
          color={colors.textSecondary}
          style={[styles.center, { marginTop: spacing.sm }]}
        >
          {bodies[slide]}
        </TPText>

        <View style={{ height: spacing.lg }} />

        {slide === 0 && (
          <>
            <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
              {t().language}
            </TPText>
            <View style={styles.row}>
              <Chip label="English" selected={lang === 'en'} onPress={() => pickLang('en')} />
              <Chip label="العربية" selected={lang === 'ar'} onPress={() => pickLang('ar')} />
            </View>
          </>
        )}

        {slide === 1 && (
          <>
            <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
              {t().currency}
            </TPText>
            <View style={styles.row}>
              {CURRENCIES.map((c) => (
                <Chip key={c} label={c} selected={currency === c} onPress={() => setCurrency(c)} />
              ))}
            </View>
            <View style={{ height: spacing.sm }} />
            <TPText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: 4 }}>
              {t().yourName}
            </TPText>
            <TextInput
              value={meName}
              onChangeText={setMeName}
              placeholder={t().you}
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderRadius: radii.md,
                  padding: spacing.md,
                },
              ]}
            />
            <View style={{ height: spacing.sm }} />
            <TPText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: 4 }}>
              {t().partnerName}
            </TPText>
            <TextInput
              value={partnerName}
              onChangeText={setPartnerName}
              placeholder={t().partner}
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderRadius: radii.md,
                  padding: spacing.md,
                },
              ]}
            />
          </>
        )}

        <View style={{ flex: 1 }} />

        <View style={styles.row}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === slide ? colors.accent : colors.border,
                marginRight: 6,
              }}
            />
          ))}
        </View>
        <View style={{ height: spacing.md }} />

        <View style={styles.row}>
          {slide > 0 && (
            <Button title={t().back} variant="ghost" onPress={() => setSlide(slide - 1)} style={{ flex: 1, marginRight: spacing.sm }} />
          )}
          <Button
            title={slide === 2 ? t().getStarted : t().continue}
            onPress={() => (slide === 2 ? finish() : setSlide(slide + 1))}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  input: { borderWidth: 1, fontSize: 16 },
});
