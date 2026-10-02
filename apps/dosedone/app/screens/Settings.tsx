import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useStrings, type Locale } from '../lib/strings';
import { useMeds } from '../store/meds';

export function SettingsScreen({ onPaywall }: { onPaywall: () => void }) {
  const { spacing, colorScheme, preference, setColorScheme } = useTheme();
  const { t, locale, setLocale } = useStrings();
  const { pro, eraseAll } = useMeds();
  const [confirmErase, setConfirmErase] = useState(false);

  const locales: Locale[] = ['en', 'ar'];
  const appearances: { key: ColorSchemePreference; label: string }[] = [
    { key: 'system', label: t.sSystem },
    { key: 'light', label: t.sLight },
    { key: 'dark', label: t.sDark },
  ];

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.sTitle}</Text>

        {!pro && (
          <Card tone="action" style={{ marginBottom: spacing.md }}>
            <Text variant="h3">{t.pwTitle}</Text>
            <Button title={t.sGoPlus} variant="action" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        <Text variant="overline" color="textSecondary">{t.sLanguage}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {locales.map((l) => (
            <Chip key={l} label={l === 'en' ? 'English' : 'العربية'} selected={locale === l} onPress={() => setLocale(l)} />
          ))}
        </View>

        <Text variant="overline" color="textSecondary">{t.sAppearance}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {appearances.map((a) => (
            <Chip key={a.key} label={a.label} selected={preference === a.key} onPress={() => setColorScheme(a.key)} />
          ))}
        </View>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.md }}>
          {t.sSystem}: {colorScheme}
        </Text>

        <Text variant="overline" color="textSecondary">{t.sErase}</Text>
        <Card style={{ marginVertical: spacing.sm }}>
          {!confirmErase ? (
            <Button title={t.sErase} variant="secondary" onPress={() => setConfirmErase(true)} />
          ) : (
            <>
              <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.sm }}>
                {t.sEraseConfirm}
              </Text>
              <View style={styles.row}>
                <Button title={t.sEraseYes} onPress={() => { eraseAll(); setConfirmErase(false); }} />
                <Button title={t.sCancel} variant="ghost" onPress={() => setConfirmErase(false)} />
              </View>
            </>
          )}
        </Card>

        <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.md }}>
          {t.sMedical}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
