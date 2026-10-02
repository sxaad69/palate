import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { PRESETS, type Preset } from '../data/presets';

// One screen: brand hero → goal chips → preset picker → continue.
// ponytail: a single scroll view beats a multi-step wizard for v1.
export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, setGoal, setPresetId, setOnboarded } = useApp();
  const [goalIdx, setGoalIdx] = useState<number | null>(null);
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);

  const canContinue = goalIdx !== null;

  const wedgeBadge = (p: Preset): string | null => {
    if (!p.wedge) return null;
    if (language === 'ar') {
      return p.wedge === 'ramadan' ? 'رمضان' : p.wedge === 'night-shift' ? 'وردية ليلية' : 'لطيف';
    }
    return p.wedge === 'ramadan' ? 'Ramadan' : p.wedge === 'night-shift' ? 'Night shift' : 'Gentle';
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg }}>
          {/* Brand mark: teal ring */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radii.full,
              borderWidth: 6,
              borderColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
            accessibilityRole="image"
            accessibilityLabel="Fastuna"
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: radii.full,
                backgroundColor: colors.accent,
              }}
            />
          </View>
          <Text variant="h1">{t.onboardingTitle}</Text>
          <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {t.onboardingSubtitle}
          </Text>
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.goalLabel}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {t.goals.map((g, i) => {
            const selected = goalIdx === i;
            return (
              <Pressable
                key={g}
                onPress={() => setGoalIdx(i)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.full,
                  backgroundColor: selected ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? colors.accent : colors.border,
                }}
              >
                <Text variant="bodySmall" color={selected ? 'textInverse' : 'textPrimary'}>
                  {g}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.presetLabel}</Text>
        {PRESETS.map((p) => {
          const selected = preset.id === p.id;
          const badge = wedgeBadge(p);
          return (
            <Pressable key={p.id} onPress={() => setPreset(p)} accessibilityRole="button" accessibilityState={{ selected }}>
              <Card
                style={{
                  marginBottom: spacing.sm,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? colors.accent : colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text variant="h3">{language === 'ar' ? p.nameAr : p.nameEn}</Text>
                  {badge && (
                    <View style={{ backgroundColor: colors.accentMuted, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                      <Text variant="caption" color="accent">{badge}</Text>
                    </View>
                  )}
                </View>
                <Text variant="bodySmall" color="textSecondary" style={{ marginTop: spacing.xs }}>
                  {p.fastHours}{t.hours} {t.fastingWindow} · {p.eatHours}{t.hours} {t.eatingWindow}
                </Text>
                <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.xs }}>
                  {language === 'ar' ? p.descAr : p.descEn}
                </Text>
              </Card>
            </Pressable>
          );
        })}

        <View style={{ marginVertical: spacing.lg }}>
          <Button
            title={t.continue}
            disabled={!canContinue}
            onPress={() => {
              if (goalIdx !== null) setGoal(t.goals[goalIdx]);
              setPresetId(preset.id);
              setOnboarded(true);
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
