import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';

// Today: each recipe is a card. Tap Done → the celebration ("Shine") moment.
// If a recipe was missed 2+ days, the Fogg shrink nudge appears.
export function TodayScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, recipes, completeToday, isDoneToday, streakFor, shrinkFor } = useApp();
  const navigation = useNavigation<any>();
  const [celebrating, setCelebrating] = useState<string | null>(null);

  const active = recipes.filter((r) => !r.archived);
  const celebratedRecipe = celebrating ? active.find((r) => r.id === celebrating) : undefined;

  if (celebratedRecipe) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="display" color="accent" style={{ marginBottom: spacing.sm }}>
            {t.shineTitle}
          </Text>
          <Text variant="h2" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
            {celebratedRecipe.celebration}
          </Text>
          <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            {t.shineSubtitle}
          </Text>
          <View style={{ width: '100%' }}>
            <Button title={t.celebrated} onPress={() => setCelebrating(null)} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.today}
        </Text>
        {active.length === 0 && (
          <Card>
            <Text variant="bodySmall" color="textSecondary">{t.noRecipes}</Text>
            <View style={{ marginTop: spacing.md }}>
              <Button title={t.addRecipe} onPress={() => navigation.navigate('Recipes', { screen: 'RecipeEditor' })} />
            </View>
          </Card>
        )}
        {active.map((r) => {
          const done = isDoneToday(r.id);
          const streak = streakFor(r.id);
          const shrink = !done && shrinkFor(r.id);
          return (
            <Card key={r.id} style={{ marginBottom: spacing.sm, opacity: done ? 0.65 : 1 }}>
              <Text variant="bodySmall" color="textSecondary">
                {t.afterI} {r.anchor},
              </Text>
              <Text variant="h3" style={{ marginVertical: spacing.xs }}>
                {t.iWill} {r.behavior}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }}>
                <Text variant="caption" color="textTertiary">
                  {streak > 0 ? `${streak} ${t.streak}` : t.appTagline}
                </Text>
                {done ? (
                  <View style={{ backgroundColor: colors.accentMuted, borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
                    <Text variant="bodySmall" color="accent">{t.doneToday}</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      if (completeToday(r.id)) setCelebrating(r.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t.doIt}
                    style={{
                      backgroundColor: colors.accent,
                      borderRadius: radii.full,
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      minHeight: 48,
                      justifyContent: 'center',
                    }}
                  >
                    <Text variant="body" color="textInverse">{t.doIt}</Text>
                  </Pressable>
                )}
              </View>
              {shrink && (
                <Pressable
                  onPress={() => navigation.navigate('Recipes', { screen: 'RecipeEditor', params: { recipeId: r.id } })}
                  style={{ marginTop: spacing.sm }}
                  accessibilityRole="button"
                >
                  <Text variant="caption" color="warning">
                    {t.shrinkNudge} {t.shrinkIt} →
                  </Text>
                </Pressable>
              )}
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
