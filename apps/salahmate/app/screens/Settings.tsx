import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useStrings, type Locale } from '../lib/strings';
import { useSalah } from '../store/salah';
import { CALC_METHODS, type CalcMethod } from '../lib/prayer';
import { getCoordinates } from '../lib/location';

export function SettingsScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, spacing, colorScheme, preference, setColorScheme } = useTheme();
  const { t, locale, setLocale } = useStrings();
  const {
    pro,
    lat,
    lng,
    useDeviceLocation,
    methodId,
    setMethod,
    setLocation,
    remindersOn,
    setRemindersOn,
    eraseAll,
  } = useSalah();
  const [confirmErase, setConfirmErase] = useState(false);
  const [locating, setLocating] = useState(false);

  const locales: Locale[] = ['en', 'ar'];
  const appearances: { key: ColorSchemePreference; label: string }[] = [
    { key: 'system', label: t.sSystem },
    { key: 'light', label: t.sLight },
    { key: 'dark', label: t.sDark },
  ];

  const refreshLocation = async () => {
    setLocating(true);
    const coords = await getCoordinates();
    setLocation(coords.lat, coords.lng, coords.fromDevice);
    setLocating(false);
  };

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
            <Button title={t.sGoPlus} onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        <Text variant="overline" color="textSecondary">{t.sLocation}</Text>
        <Card style={{ marginVertical: spacing.sm }}>
          <Text variant="body" color="textSecondary">
            {lat.toFixed(2)}, {lng.toFixed(2)}
            {useDeviceLocation ? ' · 📍' : ''}
          </Text>
          <Button
            title={t.sUseDevice}
            variant="secondary"
            onPress={refreshLocation}
            loading={locating}
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        <Text variant="overline" color="textSecondary">{t.sMethod}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {CALC_METHODS.map((m: CalcMethod) => (
            <Chip
              key={m.id}
              label={locale === 'ar' ? m.ar : m.en}
              selected={methodId === m.id}
              onPress={() => setMethod(m.id)}
            />
          ))}
        </View>

        <View style={[styles.switchRow, { marginVertical: spacing.sm }]}>
          <Text variant="body" style={{ flex: 1, fontWeight: '500' }}>{t.sReminders}</Text>
          <Switch value={remindersOn} onValueChange={setRemindersOn} trackColor={{ true: colors.accent }} />
        </View>

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
          {t.sVerify}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
});
