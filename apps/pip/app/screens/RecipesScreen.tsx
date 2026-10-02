import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';

// Recipe list: edit, archive, add. Each shows its streak.
export function RecipesScreen() {
  const { colors, spacing } = useTheme();
  const { t, recipes, archiveRecipe, streakFor } = useApp();
  const navigation = useNavigation<any>();

  const active = recipes.filter((r) => !r.archived);

  const confirmArchive = (id: string) => {
    Alert.alert(t.deleteRecipe, undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: t.deleteRecipe, style: 'destructive', onPress: () => archiveRecipe(id) },
    ]);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: spacing.sm }}>
          <Text variant="h1">{t.recipes}</Text>
          <Pressable
            onPress={() => navigation.navigate('RecipeEditor')}
            accessibilityRole="button"
            accessibilityLabel={t.addRecipe}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 9999,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="add" size={24} color={colors.textInverse} />
          </Pressable>
        </View>
        {active.length === 0 && (
          <Card>
            <Text variant="bodySmall" color="textSecondary">{t.noRecipes}</Text>
          </Card>
        )}
        {active.map((r) => (
          <Card key={r.id} style={{ marginBottom: spacing.sm }}>
            <Text variant="bodySmall" color="textSecondary">
              {t.afterI} {r.anchor},
            </Text>
            <Text variant="body" style={{ marginVertical: spacing.xs }}>
              {t.iWill} {r.behavior}.
            </Text>
            <Text variant="caption" color="textTertiary">
              {t.celebrateWith}: {r.celebration} · {streakFor(r.id)} {t.streak}
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={t.editRecipe}
                  variant="secondary"
                  onPress={() => navigation.navigate('RecipeEditor', { recipeId: r.id })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title={t.deleteRecipe} variant="secondary" onPress={() => confirmArchive(r.id)} />
              </View>
            </View>
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
