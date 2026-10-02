import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { mealTotals, useApp, type LoggedMeal } from '../store/app';
import type { RootTabParamList, TodayStackParamList } from '../navigation';

type Props = NativeStackScreenProps<TodayStackParamList, 'TodayHome'>;

const CALORIE_TARGET = 2000;
const MACRO_TARGETS = { protein: 120, carbs: 220, fat: 65 };

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const { colors, spacing } = useTheme();
  const size = 200;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / target, 1);
  const remaining = Math.max(target - Math.round(consumed), 0);

  return (
    <View style={[styles.ringWrap, { marginVertical: spacing.md }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text variant="h1">{remaining}</Text>
        <Text variant="caption" color="textSecondary">
          kcal remaining
        </Text>
      </View>
    </View>
  );
}

function MacroBar({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  const { colors, spacing, radii } = useTheme();
  const progress = Math.min(value / target, 1);
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.macroHead, { marginBottom: spacing.xs }]}>
        <Text variant="caption" color="textSecondary">
          {label}
        </Text>
        <Text variant="caption">
          {Math.round(value)}
          {unit}
        </Text>
      </View>
      <View
        style={{
          height: spacing.sm,
          borderRadius: radii.full,
          backgroundColor: colors.border,
        }}
      >
        <View
          style={{
            height: spacing.sm,
            borderRadius: radii.full,
            backgroundColor: colors.accent,
            width: `${progress * 100}%`,
          }}
        />
      </View>
    </View>
  );
}

function MealRow({
  meal,
  onPress,
}: {
  meal: LoggedMeal;
  onPress: () => void;
}) {
  const { colors, spacing } = useTheme();
  const kcal = Math.round(meal.nutrition.calories * meal.plates);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${meal.nameEn}, ${kcal} kilocalories`}
      android_ripple={
        Platform.OS === 'android' ? { color: colors.overlay } : undefined
      }
      style={({ pressed }) => [
        { opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1 },
      ]}
    >
      <Card style={{ marginBottom: spacing.sm }}>
        <View style={styles.mealRow}>
          <View style={styles.mealInfo}>
            <Text variant="body">
              {meal.nameEn}{' '}
              <Text variant="bodySmall" color="textSecondary">
                · {meal.nameAr}
              </Text>
            </Text>
            <View style={[styles.chipRow, { marginTop: spacing.xs }]}>
              <Chip label={meal.cuisine} />
              <Chip label={meal.mealType} />
            </View>
          </View>
          <Text variant="h3" color="textSecondary">
            {kcal}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

export function TodayScreen({ navigation }: Props) {
  const { spacing } = useTheme();
  const { meals } = useApp();
  const tabNav = useNavigation<NavigationProp<RootTabParamList>>();
  const totals = mealTotals(meals);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.sm }}>
          {greeting()}
        </Text>
        <Text variant="bodySmall" color="textSecondary">
          {todayLabel()}
        </Text>

        <CalorieRing consumed={totals.calories} target={CALORIE_TARGET} />

        <View
          style={[styles.macros, { gap: spacing.md, marginBottom: spacing.lg }]}
        >
          <MacroBar
            label="Protein"
            value={totals.protein}
            target={MACRO_TARGETS.protein}
            unit="g"
          />
          <MacroBar
            label="Carbs"
            value={totals.carbs}
            target={MACRO_TARGETS.carbs}
            unit="g"
          />
          <MacroBar
            label="Fat"
            value={totals.fat}
            target={MACRO_TARGETS.fat}
            unit="g"
          />
        </View>

        <View style={[styles.sectionHead, { marginBottom: spacing.sm }]}>
          <Text variant="h2">Today's meals</Text>
          <Text variant="bodySmall" color="textSecondary">
            {meals.length} logged
          </Text>
        </View>

        {meals.map((meal) => (
          <MealRow
            key={meal.id}
            meal={meal}
            onPress={() =>
              navigation.navigate('DishDetail', { mealId: meal.id })
            }
          />
        ))}

        <View style={{ marginVertical: spacing.lg }}>
          <Button title="Snap your meal" onPress={() => tabNav.navigate('Scan')} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macros: { flexDirection: 'row' },
  macroHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: { flex: 1 },
  chipRow: { flexDirection: 'row', gap: 6 },
});
