import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { speciesById } from '../data/plants';
import type { CareType } from '../lib/plants';

// Today: due/overdue care tasks with one-tap Done, streak, upcoming.
export function TodayScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, plants, due, streak, logCare } = useApp();

  const plantName = (plantId: string) => {
    const p = plants.find((x) => x.id === plantId);
    if (!p) return '';
    return p.nickname || (language === 'ar'
      ? speciesById(p.speciesId)?.nameAr ?? ''
      : speciesById(p.speciesId)?.nameEn ?? '');
  };

  const typeLabel = (type: CareType) =>
    type === 'water' ? t.water : type === 'fertilize' ? t.fertilize : t.mist;
  const typeIcon = (type: CareType) =>
    type === 'water' ? '💧' : type === 'fertilize' ? '🌿' : '💦';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: spacing.sm }}>
          <Text variant="h1">{t.today}</Text>
          {streak > 0 && (
            <Text variant="bodySmall" color="accent">🔥 {streak} {t.careStreak}</Text>
          )}
        </View>

        {due.length === 0 && (
          <Card style={{ backgroundColor: colors.accentMuted }}>
            <Text variant="body" style={{ textAlign: 'center' }}>{t.allCaughtUp}</Text>
          </Card>
        )}

        {due.map((task) => (
          <Card key={`${task.plantId}-${task.type}`} style={{ marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text variant="body">
                  {typeIcon(task.type)} {typeLabel(task.type)} — {plantName(task.plantId)}
                </Text>
                <Text variant="caption" color={task.overdueDays > 0 ? 'danger' : 'textTertiary'}>
                  {task.overdueDays > 0 ? `${task.overdueDays}d ${t.overdue}` : t.dueToday}
                </Text>
              </View>
              <Pressable
                onPress={() => logCare(task.plantId, task.type)}
                accessibilityRole="button"
                accessibilityLabel={`${t.markDone}: ${typeLabel(task.type)}`}
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: radii.full,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  minHeight: 48,
                  justifyContent: 'center',
                }}
              >
                <Text variant="body" color="textInverse">{t.markDone}</Text>
              </Pressable>
            </View>
          </Card>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
