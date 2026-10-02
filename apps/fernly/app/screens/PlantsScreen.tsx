import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { speciesById } from '../data/plants';
import { dueTasks } from '../lib/plants';

// Collection: every plant with its due-task count.
export function PlantsScreen() {
  const { colors, spacing } = useTheme();
  const { t, language, plants, careEvents } = useApp();
  const navigation = useNavigation<any>();

  const active = plants.filter((p) => !p.archived);

  const dueCount = (plantId: string) =>
    dueTasks(
      active.filter((p) => p.id === plantId),
      careEvents,
    ).length;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: spacing.sm }}>
          <Text variant="h1">{t.myPlants}</Text>
          <Pressable
            onPress={() => navigation.navigate('PlantAdd')}
            accessibilityRole="button"
            accessibilityLabel={t.addPlant}
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
            <Text variant="bodySmall" color="textSecondary">{t.noPlants}</Text>
          </Card>
        )}
        {active.map((p) => {
          const s = speciesById(p.speciesId);
          const due = dueCount(p.id);
          return (
            <Pressable
              key={p.id}
              onPress={() => navigation.navigate('PlantDetail', { plantId: p.id })}
              accessibilityRole="button"
            >
              <Card style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text variant="body">
                      🌱 {p.nickname || (language === 'ar' ? s?.nameAr : s?.nameEn)}
                    </Text>
                    <Text variant="caption" color="textTertiary">
                      {language === 'ar' ? s?.nameAr : s?.nameEn}
                      {s ? ` · ${t.everyDays(s.waterDays)} 💧` : ''}
                    </Text>
                  </View>
                  {due > 0 && (
                    <View
                      style={{
                        backgroundColor: colors.danger,
                        borderRadius: 9999,
                        minWidth: 28,
                        height: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: spacing.xs,
                      }}
                    >
                      <Text variant="bodySmall" color="textInverse">{due}</Text>
                    </View>
                  )}
                </View>
              </Card>
            </Pressable>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
