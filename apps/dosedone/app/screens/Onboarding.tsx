import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useMeds } from '../store/meds';
import { requestNotificationPermissions } from '../lib/notifications';

// One screen, three plain steps, one permission ask. Big everything.
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { spacing } = useTheme();
  const { t } = useStrings();
  const { completeOnboarding } = useMeds();
  const [remindersOn, setRemindersOn] = useState(false);

  const steps = [t.obStep1, t.obStep2, t.obStep3];

  const enable = async () => {
    const granted = await requestNotificationPermissions();
    setRemindersOn(granted);
  };

  return (
    <Screen>
      <View style={[styles.flex, { paddingTop: spacing['2xl'] }]}>
        <Text variant="display" style={{ marginBottom: spacing.sm }}>{t.obTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.xl }}>
          {t.obSubtitle}
        </Text>

        {steps.map((s, i) => (
          <Card key={i} style={[styles.step, { marginBottom: spacing.sm }]}>
            <View style={styles.stepNum}>
              <Text variant="h2" color="accent">{i + 1}</Text>
            </View>
            <Text variant="body" style={styles.stepText}>{s}</Text>
          </Card>
        ))}

        <View style={{ flex: 1 }} />

        {!remindersOn ? (
          <Button title={t.obEnable} onPress={enable} style={{ marginBottom: spacing.sm }} />
        ) : (
          <Text variant="body" color="success" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
            ✓
          </Text>
        )}
        <Button
          title={t.obStart}
          variant="secondary"
          onPress={() => {
            completeOnboarding();
            onDone();
          }}
        />
        <Button title={t.obSkip} variant="ghost" onPress={() => { completeOnboarding(); onDone(); }} style={{ marginTop: spacing.xs }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  step: { flexDirection: 'row', alignItems: 'center' },
  stepNum: { width: 48, alignItems: 'center' },
  stepText: { flex: 1 },
});
