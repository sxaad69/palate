import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { TEMPLATES } from '../data/recipes';

// Pick 1–3 starter recipes (Fogg: start with three tiny recipes).
// ponytail: single scroll view, no wizard.
export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, addRecipe, setOnboarded } = useApp();
  const [picked, setPicked] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else if (next.size < 3) next.add(i);
      return next;
    });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg }}>
          {/* Brand mark: a pip (seed) */}
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
            accessibilityLabel="Pip"
          >
            <View
              style={{
                width: 24,
                height: 34,
                borderRadius: radii.full,
                backgroundColor: colors.textInverse,
                transform: [{ rotate: '24deg' }],
              }}
            />
          </View>
          <Text variant="h1">{t.onboardingTitle}</Text>
          <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {t.onboardingSubtitle}
          </Text>
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.pickRecipes}</Text>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.sm }}>
          {t.tapToAdd}
        </Text>
        {TEMPLATES.map((tpl, i) => {
          const selected = picked.has(i);
          return (
            <Pressable key={i} onPress={() => toggle(i)} accessibilityRole="button" accessibilityState={{ selected }}>
              <Card
                style={{
                  marginBottom: spacing.sm,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? colors.accent : colors.border,
                }}
              >
                <Text variant="bodySmall" color="textSecondary">
                  {t.afterI} {language === 'ar' ? tpl.anchorAr : tpl.anchorEn},
                </Text>
                <Text variant="body" style={{ marginTop: spacing.xs }}>
                  {t.iWill} {language === 'ar' ? tpl.behaviorAr : tpl.behaviorEn}.
                </Text>
              </Card>
            </Pressable>
          );
        })}

        <View style={{ marginVertical: spacing.lg }}>
          <Button
            title={t.continue}
            disabled={picked.size === 0}
            onPress={() => {
              for (const i of picked) {
                const tpl = TEMPLATES[i];
                addRecipe(
                  language === 'ar'
                    ? { anchor: tpl.anchorAr, behavior: tpl.behaviorAr, celebration: tpl.celebrationAr }
                    : { anchor: tpl.anchorEn, behavior: tpl.behaviorEn, celebration: tpl.celebrationEn },
                );
              }
              setOnboarded(true);
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
