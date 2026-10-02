import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useStrings, CURRENCIES, type Currency, type Locale } from '../lib/strings';
import { useLedger } from '../store/ledger';

export function ProfileScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, spacing, colorScheme, preference, setColorScheme } = useTheme();
  const { t, locale, setLocale } = useStrings();
  const { currency, setCurrency, taxRate, setTaxRate, pro, buildCsv, eraseAll } = useLedger();
  const [confirmErase, setConfirmErase] = useState(false);
  const [copied, setCopied] = useState(false);

  const locales: Locale[] = ['en', 'ar'];
  const appearances: { key: ColorSchemePreference; label: string }[] = [
    { key: 'system', label: t.pSystem },
    { key: 'light', label: t.pLight },
    { key: 'dark', label: t.pDark },
  ];

  const exportAll = async () => {
    if (!pro) {
      onPaywall();
      return;
    }
    await Clipboard.setStringAsync(buildCsv());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.pTitle}</Text>

        {!pro && (
          <Card tone="highlight" style={{ marginBottom: spacing.md }}>
            <Text variant="h3">{t.pwTitle}</Text>
            <Button title={t.pGoPlus} variant="highlight" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        <Text variant="overline" color="textSecondary">{t.pCurrency}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {CURRENCIES.map((c: Currency) => (
            <Chip key={c} label={c} selected={currency === c} onPress={() => setCurrency(c)} />
          ))}
        </View>

        <Text variant="overline" color="textSecondary">{t.pTaxRate}</Text>
        <View style={[styles.stepperRow, { marginVertical: spacing.sm }]}>
          <Button title="−" variant="secondary" onPress={() => setTaxRate(Math.max(0, taxRate - 5))} style={styles.stepper} />
          <Text variant="h2">{taxRate}%</Text>
          <Button title="+" variant="secondary" onPress={() => setTaxRate(Math.min(50, taxRate + 5))} style={styles.stepper} />
        </View>

        <Text variant="overline" color="textSecondary">{t.pLanguage}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {locales.map((l) => (
            <Chip key={l} label={l === 'en' ? 'English' : 'العربية'} selected={locale === l} onPress={() => setLocale(l)} />
          ))}
        </View>

        <Text variant="overline" color="textSecondary">{t.pAppearance}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {appearances.map((a) => (
            <Chip key={a.key} label={a.label} selected={preference === a.key} onPress={() => setColorScheme(a.key)} />
          ))}
        </View>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.md }}>
          {t.pSystem}: {colorScheme}
        </Text>

        <Button
          title={copied ? '✓ CSV' : `${t.pExport}${pro ? '' : ' (Plus)'}`}
          variant="secondary"
          onPress={exportAll}
        />

        <Text variant="overline" color="textSecondary" style={{ marginTop: spacing.lg }}>{t.pReset}</Text>
        <Card style={{ marginVertical: spacing.sm }}>
          {!confirmErase ? (
            <Button title={t.pReset} variant="secondary" onPress={() => setConfirmErase(true)} />
          ) : (
            <>
              <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.sm }}>
                {t.pResetConfirm}
              </Text>
              <View style={styles.row}>
                <Button title={t.pResetYes} onPress={() => { eraseAll(); setConfirmErase(false); }} />
                <Button title={t.pCancel} variant="ghost" onPress={() => setConfirmErase(false)} />
              </View>
            </>
          )}
        </Card>

        <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.md }}>
          {t.pTaxNote}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { minWidth: 56, paddingHorizontal: 0 },
});
