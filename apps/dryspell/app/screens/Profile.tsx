import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useStrings, type Locale } from '../lib/strings';
import { useSobriety } from '../store/sobriety';

export function ProfileScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, spacing, colorScheme, preference, setColorScheme } = useTheme();
  const { t, locale, setLocale } = useStrings();
  const { reasons, setReasons, resetCount, pro } = useSobriety();
  const [reasonsDraft, setReasonsDraft] = useState(reasons.join('\n'));
  const [confirmReset, setConfirmReset] = useState(false);

  const locales: Locale[] = ['en', 'ar'];
  const appearances: { key: ColorSchemePreference; label: string }[] = [
    { key: 'system', label: t.pSystem },
    { key: 'light', label: t.pLight },
    { key: 'dark', label: t.pDark },
  ];

  const saveReasons = () => {
    setReasons(
      reasonsDraft
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
    );
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.pTitle}</Text>

        {!pro && (
          <Card tone="gold" style={{ marginBottom: spacing.md }}>
            <Text variant="h3">{t.pwTitle}</Text>
            <Button title={t.pGoPlus} variant="gold" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        <Text variant="overline" color="textSecondary">{t.pLanguage}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {locales.map((l) => (
            <Chip key={l} label={l === 'en' ? 'English' : 'العربية'} selected={locale === l} onPress={() => setLocale(l)} />
          ))}
        </View>

        <Text variant="overline" color="textSecondary">{t.pAppearance}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {appearances.map((a) => (
            <Chip
              key={a.key}
              label={a.label}
              selected={preference === a.key}
              onPress={() => setColorScheme(a.key)}
            />
          ))}
        </View>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.md }}>
          {t.pSystem}: {colorScheme}
        </Text>

        <Text variant="overline" color="textSecondary">{t.pReasons}</Text>
        <Card style={{ marginVertical: spacing.sm }}>
          <TextInput
            value={reasonsDraft}
            onChangeText={setReasonsDraft}
            placeholder={t.pReasonsPh}
            placeholderTextColor={colors.textTertiary}
            multiline
            style={[styles.input, { color: colors.textPrimary, minHeight: 88 }]}
            accessibilityLabel={t.pReasons}
          />
          <Button title={t.commonSave} onPress={saveReasons} style={{ marginTop: spacing.sm }} />
        </Card>

        <Text variant="overline" color="textSecondary">{t.pReset}</Text>
        <Card style={{ marginVertical: spacing.sm }}>
          {!confirmReset ? (
            <Button title={t.pReset} variant="secondary" onPress={() => setConfirmReset(true)} />
          ) : (
            <>
              <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.sm }}>
                {t.pResetConfirm}
              </Text>
              <View style={styles.row}>
                <Button title={t.pResetYes} onPress={() => { resetCount(); setConfirmReset(false); }} />
                <Button title={t.pCancel} variant="ghost" onPress={() => setConfirmReset(false)} />
              </View>
            </>
          )}
        </Card>

        <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.md }}>
          {t.pMedical}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { fontSize: 16, lineHeight: 24, textAlignVertical: 'top' },
});
