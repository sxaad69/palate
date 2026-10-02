import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { ANCHORS, CELEBRATIONS } from '../data/recipes';

// One editor for new + existing recipes: anchor (+suggestion chips),
// tiny behavior, celebration chips. The shrink hint shows when editing a
// recipe the Fogg rule flagged as too big.
export function RecipeEditorScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { t, language, recipes, addRecipe, updateRecipe, shrinkFor } = useApp();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const recipeId: string | undefined = route.params?.recipeId;
  const existing = recipeId ? recipes.find((r) => r.id === recipeId) : undefined;

  const [anchor, setAnchor] = useState(existing?.anchor ?? '');
  const [behavior, setBehavior] = useState(existing?.behavior ?? '');
  const [celebration, setCelebration] = useState(existing?.celebration ?? '');

  const canSave = anchor.trim() !== '' && behavior.trim() !== '' && celebration.trim() !== '';

  const inputStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    color: colors.textPrimary,
    ...typography.body,
  };

  const onSave = () => {
    if (!canSave) return;
    if (existing) {
      updateRecipe(existing.id, {
        anchor: anchor.trim(),
        behavior: behavior.trim(),
        celebration: celebration.trim(),
      });
    } else {
      addRecipe({ anchor: anchor.trim(), behavior: behavior.trim(), celebration: celebration.trim() });
    }
    navigation.goBack();
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {existing ? t.editRecipe : t.addRecipe}
        </Text>
        {existing && shrinkFor(existing.id) && (
          <Text variant="bodySmall" color="warning" style={{ marginBottom: spacing.md }}>
            {t.shrinkHint}
          </Text>
        )}

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.afterI}…</Text>
        <TextInput
          value={anchor}
          onChangeText={setAnchor}
          placeholder={t.anchorPlaceholder}
          placeholderTextColor={colors.textTertiary}
          style={inputStyle}
          accessibilityLabel={t.anchorPlaceholder}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginVertical: spacing.sm }}>
          {ANCHORS.map((a) => (
            <Pressable
              key={a.en}
              onPress={() => setAnchor(language === 'ar' ? a.ar : a.en)}
              accessibilityRole="button"
              style={{
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.md,
                borderRadius: radii.full,
                backgroundColor: colors.surfaceAlt,
              }}
            >
              <Text variant="caption" color="textSecondary">{language === 'ar' ? a.ar : a.en}</Text>
            </Pressable>
          ))}
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.iWill}…</Text>
        <TextInput
          value={behavior}
          onChangeText={setBehavior}
          placeholder={t.behaviorPlaceholder}
          placeholderTextColor={colors.textTertiary}
          style={[inputStyle, { marginBottom: spacing.md }]}
          accessibilityLabel={t.behaviorPlaceholder}
        />

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.celebrateWith}…</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {CELEBRATIONS.map((c) => {
            const label = language === 'ar' ? c.ar : c.en;
            const selected = celebration === label;
            return (
              <Pressable
                key={c.en}
                onPress={() => setCelebration(label)}
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
                <Text variant="bodySmall" color={selected ? 'textInverse' : 'textPrimary'}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Button title={t.saveRecipe} disabled={!canSave} onPress={onSave} />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
