import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { mealTotals, useApp } from '../store/app';

// ponytail: static sample week — real history comes from the backend later.
const PAST_WEEK = [1650, 1420, 1780, 1510, 1890, 1340];
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function dayLetters(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return DAY_LETTERS[d.getDay()];
  });
}

function WeekChart({ values }: { values: number[] }) {
  const { colors, spacing, radii } = useTheme();
  const max = 2200;
  return (
    <View>
      <View style={[styles.bars, { height: 160, gap: spacing.sm }]}>
        {values.map((v, i) => {
          const isToday = i === values.length - 1;
          return (
            <View key={i} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${Math.max((v / max) * 100, 4)}%`,
                    borderRadius: radii.sm,
                    backgroundColor: isToday ? colors.accent : colors.border,
                  },
                ]}
              />
              <Text
                variant="caption"
                color={isToday ? 'textPrimary' : 'textTertiary'}
                style={{ marginTop: spacing.xs }}
              >
                {dayLetters()[i]}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={[styles.chartFoot, { marginTop: spacing.sm }]}>
        <Text variant="caption" color="textSecondary">
          Daily calories · target 2,000
        </Text>
      </View>
    </View>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={[
        styles.statRow,
        {
          paddingVertical: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: colors.accentMuted,
            borderRadius: radii.full,
            marginEnd: spacing.md,
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <Text variant="body" color="textSecondary" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

export function ProgressScreen() {
  const { colors, spacing } = useTheme();
  const { meals } = useApp();
  const totals = mealTotals(meals);
  const week = [...PAST_WEEK, Math.round(totals.calories)];
  const avgProtein = Math.round(
    (PAST_WEEK.length * 88 + totals.protein) / (PAST_WEEK.length + 1),
  );

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
          Progress
        </Text>

        <Card style={{ marginBottom: spacing.md }}>
          <WeekChart values={week} />
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <StatRow icon="flame-outline" label="Current streak" value="6 days" />
          <StatRow icon="globe-outline" label="Top cuisine" value="Saudi" />
          <StatRow
            icon="barbell-outline"
            label="Avg protein / day"
            value={`${avgProtein}g`}
          />
        </Card>

        <Card>
          <View style={[styles.insightHead, { marginBottom: spacing.xs }]}>
            <Ionicons
              name="bulb-outline"
              size={20}
              color={colors.accent}
              style={{ marginEnd: spacing.sm }}
            />
            <Text variant="h3">Insight</Text>
          </View>
          <Text variant="body" color="textSecondary">
            Your protein is trending up this week — the kabsa lunches are doing
            the heavy lifting. Keep it up.
          </Text>
        </Card>
        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: '60%' },
  chartFoot: { alignItems: 'center' },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  statIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightHead: { flexDirection: 'row', alignItems: 'center' },
});
