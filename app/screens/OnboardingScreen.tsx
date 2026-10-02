import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';

const GOALS = [
  {
    id: 'lose',
    title: 'Lose weight',
    subtitle: 'A gentle daily calorie target',
    icon: 'trending-down-outline' as const,
  },
  {
    id: 'habits',
    title: 'Build healthy habits',
    subtitle: 'Eat better, one meal at a time',
    icon: 'heart-outline' as const,
  },
  {
    id: 'macros',
    title: 'Track macros',
    subtitle: 'Protein, carbs and fat in balance',
    icon: 'pie-chart-outline' as const,
  },
];

export function OnboardingScreen() {
  const { colors, spacing, radii } = useTheme();
  const { setGoal, setOnboarded } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const goal = GOALS.find((g) => g.id === selected);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingVertical: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { marginBottom: spacing.xl }]}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor: colors.accent,
                borderRadius: radii.full,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Ionicons
              name="restaurant-outline"
              size={40}
              color={colors.textInverse}
            />
          </View>
          <Text variant="display">Palate</Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            The food logger that knows your food — from kabsa to biryani.
          </Text>
        </View>

        <Text variant="h2" style={{ marginBottom: spacing.md }}>
          What's your goal?
        </Text>

        {GOALS.map((g) => {
          const active = selected === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => setSelected(g.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={g.title}
              android_ripple={
                Platform.OS === 'android'
                  ? { color: colors.overlay }
                  : undefined
              }
              style={({ pressed }) => [
                { opacity: pressed && Platform.OS === 'ios' ? 0.7 : 1 },
              ]}
            >
              <Card
                style={{
                  ...styles.goalCard,
                  marginBottom: spacing.sm,
                  borderWidth: 2,
                  borderColor: active ? colors.accent : 'transparent',
                }}
              >
                <View
                  style={[
                    styles.goalIcon,
                    {
                      backgroundColor: active
                        ? colors.accent
                        : colors.accentMuted,
                      borderRadius: radii.full,
                      marginEnd: spacing.md,
                    },
                  ]}
                >
                  <Ionicons
                    name={g.icon}
                    size={22}
                    color={active ? colors.textInverse : colors.accent}
                  />
                </View>
                <View style={styles.goalText}>
                  <Text variant="body">{g.title}</Text>
                  <Text variant="bodySmall" color="textSecondary">
                    {g.subtitle}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Continue"
            disabled={!goal}
            onPress={() => {
              if (goal) {
                setGoal(goal.title);
                setOnboarded(true);
              }
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  logo: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: { flexDirection: 'row', alignItems: 'center' },
  goalIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: { flex: 1 },
});
