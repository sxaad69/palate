import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSalah } from '../store/salah';
import { CALC_METHODS, type CalcMethod } from '../lib/prayer';
import { getCoordinates } from '../lib/location';

// Location permission (for prayer times) + calculation method. No account.
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { colors, spacing } = useTheme();
  const { t, locale } = useStrings();
  const { completeOnboarding } = useSalah();
  const [useLocation, setUseLocation] = useState(true);
  const [methodId, setMethodId] = useState<CalcMethod['id']>('MWL');
  const [busy, setBusy] = useState(false);

  const start = async () => {
    setBusy(true);
    const coords = useLocation ? await getCoordinates() : null;
    completeOnboarding({
      lat: coords?.lat ?? 24.7136,
      lng: coords?.lng ?? 46.6753,
      useDeviceLocation: useLocation && (coords?.fromDevice ?? false),
      methodId,
    });
    onDone();
  };

  return (
    <Screen>
      <View style={[styles.flex, { paddingTop: spacing['2xl'] }]}>
        <Text variant="display" style={{ marginBottom: spacing.sm }}>🌙</Text>
        <Text variant="display" style={{ marginBottom: spacing.sm }}>{t.obTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.xl }}>
          {t.obSubtitle}
        </Text>

        <View style={[styles.row, { marginBottom: spacing.sm }]}>
          <View style={{ flex: 1 }}>
            <Text variant="body" style={{ fontWeight: '500' }}>{t.obLocation}</Text>
          </View>
          <Switch value={useLocation} onValueChange={setUseLocation} trackColor={{ true: colors.accent }} />
        </View>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.xl }}>
          {t.obLocationNote}
        </Text>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.obMethod}</Text>
        <View style={[styles.row, { marginBottom: spacing.xl }]}>
          {CALC_METHODS.map((m) => (
            <Chip
              key={m.id}
              label={locale === 'ar' ? m.ar : m.en}
              selected={methodId === m.id}
              onPress={() => setMethodId(m.id)}
            />
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <Button title={t.obStart} onPress={start} loading={busy} style={{ minHeight: 56 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
});
