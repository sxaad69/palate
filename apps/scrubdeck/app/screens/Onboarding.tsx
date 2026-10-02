import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useStudy } from '../store/study';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { completeOnboarding } = useStudy();
  const [step, setStep] = useState(0);

  const steps = [
    { title: t.ob1Title, body: t.ob1Body, glyph: '🩺' },
    { title: t.ob2Title, body: t.ob2Body, glyph: '🔁' },
    { title: t.ob3Title, body: t.ob3Body, glyph: '🔥' },
  ];
  const last = step === steps.length - 1;
  const s = steps[step];

  return (
    <Screen padded>
      <View style={styles.wrap}>
        <View style={[styles.glyphBox, { backgroundColor: colors.accentMuted, borderColor: colors.accent }]}>
          <Text variant="display">{s.glyph}</Text>
        </View>
        <Text variant="h1" align="center">{s.title}</Text>
        <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{s.body}</Text>
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === step ? colors.highlight : colors.border }]} />
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          title={last ? t.obStart : '→'}
          onPress={() => (last ? completeOnboarding() : setStep(step + 1))}
          variant={last ? 'primary' : 'secondary'}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg },
  glyphBox: { width: 120, height: 120, borderRadius: radii.xl, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  dots: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5 },
  footer: { paddingBottom: spacing.lg },
});
