import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { SPECIES } from '../data/plants';

// Pick starter plants from the library. ponytail: single scroll, no wizard.
export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, addPlant, setOnboarded } = useApp();
  const [picked, setPicked] = useState<Set<string>>(new Set(['pothos']));

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg }}>
          {/* Brand mark: sprout */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radii.full,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
            accessibilityRole="image"
            accessibilityLabel="Fernly"
          >
            <Text style={{ fontSize: 36 }}>🌱</Text>
          </View>
          <Text variant="h1">{t.onboardingTitle}</Text>
          <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {t.onboardingSubtitle}
          </Text>
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.pickPlants}</Text>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.sm }}>
          {t.pickPlantsHint}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {SPECIES.map((s) => {
            const selected = picked.has(s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => toggle(s.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.full,
                  backgroundColor: selected ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? colors.accent : colors.border,
                  minHeight: 48,
                  justifyContent: 'center',
                }}
              >
                <Text variant="body" color={selected ? 'textInverse' : 'textPrimary'}>
                  {language === 'ar' ? s.nameAr : s.nameEn}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          title={t.continue}
          onPress={() => {
            for (const id of picked) {
              const s = SPECIES.find((x) => x.id === id)!;
              addPlant({
                speciesId: id,
                nickname: language === 'ar' ? s.nameAr : s.nameEn,
              });
            }
            setOnboarded(true);
          }}
        />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
