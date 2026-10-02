import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety } from '../store/sobriety';

// Craving SOS: one screen for the hardest 10 minutes. Breathing pacer,
// the user's own reasons, and the daily pledge — no decisions required.
export function SOSScreen({ onClose }: { onClose: () => void }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { reasons, pledgeToday } = useSobriety();
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [done, setDone] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;
    const cycle = () => {
      if (!mounted) return;
      setPhase('in');
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (!mounted) return;
        setPhase('out');
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => cycle());
      });
    };
    cycle();
    return () => {
      mounted = false;
      scale.stopAnimation();
    };
  }, [scale]);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, textAlign: 'center' }}>{t.sosTitle}</Text>
        <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          {t.sosSubtitle}
        </Text>

        <View style={styles.breathWrap}>
          <Animated.View
            style={[
              styles.circle,
              { backgroundColor: colors.accentMuted, borderColor: colors.accent, transform: [{ scale }] },
            ]}
          />
          <Text variant="h2" color="accent" style={styles.phaseLabel}>
            {phase === 'in' ? t.sosIn : t.sosOut}
          </Text>
        </View>
        <Text variant="caption" color="textSecondary" style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          {t.sosBreathe}
        </Text>

        <Card style={{ marginBottom: spacing.md }}>
          <Text variant="overline" color="textSecondary">{t.sosWhy}</Text>
          {reasons.length === 0 ? (
            <Text variant="bodySmall" color="textSecondary" style={{ marginTop: spacing.xs }}>
              {t.sosWhyEmpty}
            </Text>
          ) : (
            reasons.map((r, i) => (
              <Text key={i} variant="body" style={{ marginTop: spacing.xs }}>• {r}</Text>
            ))
          )}
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text variant="overline" color="textSecondary">{t.sosDistract}</Text>
          <Text variant="bodySmall" color="textSecondary" style={{ marginTop: spacing.xs }}>
            {t.sosDistractIdeas}
          </Text>
        </Card>

        {!done ? (
          <Button
            title={t.sosPledge}
            onPress={() => {
              pledgeToday();
              setDone(true);
            }}
          />
        ) : (
          <Card tone="gold">
            <Text variant="h3" color="highlight" style={{ textAlign: 'center' }}>{t.sosDone}</Text>
            <Button title={t.commonClose} variant="ghost" onPress={onClose} style={{ marginTop: spacing.sm }} />
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  breathWrap: { alignItems: 'center', justifyContent: 'center', height: 220 },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    position: 'absolute',
  },
  phaseLabel: { textAlign: 'center' },
});
