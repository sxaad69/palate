import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { todayStr } from '../lib/gamification';
import type { TodayStackParamList } from '../navigation';

type Props = NativeStackScreenProps<TodayStackParamList, 'DishDetail'>;

const MIN_PLATES = 0.5;
const MAX_PLATES = 4;

function StepperButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: 'remove' | 'add';
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const { colors, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      android_ripple={
        Platform.OS === 'android' ? { color: colors.overlay } : undefined
      }
      style={({ pressed }) => [
        styles.stepperBtn,
        {
          backgroundColor: colors.surfaceAlt,
          borderRadius: radii.full,
          opacity: disabled ? 0.4 : pressed && Platform.OS === 'ios' ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={24} color={colors.textPrimary} />
    </Pressable>
  );
}

export function DishDetailScreen({ route, navigation }: Props) {
  const { colors, spacing, radii } = useTheme();
  const { meals, addMeal } = useApp();
  const [plates, setPlates] = useState(1);

  const params = route.params;
  const previewInput = 'preview' in params ? params.preview : null;
  const isPreview = previewInput !== null;
  // A preview is an AI scan result not yet logged — confirming logs it
  // with the portion the user picked on the stepper below.
  const meal = isPreview
    ? { ...previewInput, id: 'preview', loggedDate: todayStr() }
    : ('mealId' in params
        ? (meals.find((m) => m.id === params.mealId) ?? null)
        : null);
  if (!meal) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text variant="body" color="textSecondary">
            Meal not found.
          </Text>
        </View>
      </Screen>
    );
  }

  const n = meal.nutrition;
  const scaled = {
    calories: Math.round(n.calories * plates),
    protein: Math.round(n.protein * plates),
    carbs: Math.round(n.carbs * plates),
    fat: Math.round(n.fat * plates),
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1, marginBottom: spacing.sm },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text variant="h1">{meal.nameEn}</Text>
        <Text variant="body" color="textSecondary">
          {meal.nameAr}
        </Text>
        {isPreview && (
          <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.xs }}>
            AI estimate — confirm before logging
          </Text>
        )}
        <View style={[styles.chipRow, { marginVertical: spacing.md }]}>
          <Chip label={meal.cuisine} />
          <Chip label={meal.region} />
          <Chip label={meal.mealType} />
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <Text variant="h3" style={{ marginBottom: spacing.sm }}>
            Portion
          </Text>
          <View style={styles.stepperRow}>
            <StepperButton
              icon="remove"
              label="Decrease portion"
              disabled={plates <= MIN_PLATES}
              onPress={() =>
                setPlates((p) => Math.max(MIN_PLATES, p - 0.5))
              }
            />
            <Text variant="h2" style={styles.platesText}>
              {plates} {plates === 1 ? 'plate' : 'plates'}
            </Text>
            <StepperButton
              icon="add"
              label="Increase portion"
              disabled={plates >= MAX_PLATES}
              onPress={() =>
                setPlates((p) => Math.min(MAX_PLATES, p + 0.5))
              }
            />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text variant="h3" style={{ marginBottom: spacing.sm }}>
            Nutrition
          </Text>
          {(
            [
              ['Calories', `${scaled.calories} kcal`],
              ['Protein', `${scaled.protein} g`],
              ['Carbs', `${scaled.carbs} g`],
              ['Fat', `${scaled.fat} g`],
            ] as const
          ).map(([label, value], i, arr) => (
            <View
              key={label}
              style={[
                styles.nutRow,
                i < arr.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
                { paddingVertical: spacing.sm },
              ]}
            >
              <Text variant="body" color="textSecondary">
                {label}
              </Text>
              <Text variant="body">{value}</Text>
            </View>
          ))}
        </Card>

        {meal.allergens.length > 0 && (
          <Card
            style={{
              marginBottom: spacing.md,
              backgroundColor: colors.accentMuted,
            }}
          >
            <Text variant="h3" style={{ marginBottom: spacing.xs }}>
              Allergens
            </Text>
            <View style={styles.chipRow}>
              {meal.allergens.map((a) => (
                <Chip key={a} label={a} />
              ))}
            </View>
          </Card>
        )}

        {meal.tags.length > 0 && (
          <View style={{ marginBottom: spacing.lg }}>
            <View style={styles.chipRow}>
              {meal.tags.map((t) => (
                <Chip key={t} label={t} />
              ))}
            </View>
          </View>
        )}

        {previewInput && (
          <View style={{ marginBottom: spacing.lg }}>
            <Button
              title="Log this meal"
              onPress={() => {
                addMeal({ ...previewInput, plates });
                navigation.popToTop();
              }}
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platesText: { textAlign: 'center' },
  nutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
