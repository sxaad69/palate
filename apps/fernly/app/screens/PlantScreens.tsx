import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { SPECIES, speciesById } from '../data/plants';

// Add a plant: pick species, give it a nickname.
export function PlantAddScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { t, language, addPlant } = useApp();
  const navigation = useNavigation<any>();

  const [speciesId, setSpeciesId] = useState(SPECIES[0].id);
  const [nickname, setNickname] = useState('');

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.addPlant}
        </Text>
        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.chooseSpecies}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {SPECIES.map((s) => {
            const selected = s.id === speciesId;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSpeciesId(s.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.full,
                  backgroundColor: selected ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? colors.accent : colors.border,
                  minHeight: 48,
                  justifyContent: 'center',
                }}
              >
                <Text variant="bodySmall" color={selected ? 'textInverse' : 'textPrimary'}>
                  {language === 'ar' ? s.nameAr : s.nameEn}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.nickname}</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholder={t.nicknamePlaceholder}
          placeholderTextColor={colors.textTertiary}
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 48,
            color: colors.textPrimary,
            marginBottom: spacing.lg,
            ...typography.body,
          }}
          accessibilityLabel={t.nickname}
        />

        <Button
          title={t.savePlant}
          onPress={() => {
            const s = speciesById(speciesId)!;
            addPlant({
              speciesId,
              nickname: nickname.trim() || (language === 'ar' ? s.nameAr : s.nameEn),
            });
            navigation.goBack();
          }}
        />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

// Detail: species care card + per-type schedule with Done buttons + remove.
export function PlantDetailScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, plants, careEvents, logCare, archivePlant } = useApp();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const plantId: string = route.params?.plantId;
  const plant = plants.find((p) => p.id === plantId);

  if (!plant) {
    return (
      <Screen>
        <Text variant="body" style={{ marginTop: spacing.xl }}>{t.noPlants}</Text>
      </Screen>
    );
  }

  const s = speciesById(plant.speciesId);
  const types = [
    { type: 'water' as const, label: t.water, icon: '💧', days: s?.waterDays ?? 0 },
    { type: 'fertilize' as const, label: t.fertilize, icon: '🌿', days: s?.fertilizeDays ?? 0 },
    { type: 'mist' as const, label: t.mist, icon: '💦', days: s?.mistDays ?? 0 },
  ].filter((x) => x.days > 0);

  const lastDone = (type: string) => {
    const e = careEvents
      .filter((x) => x.plantId === plant.id && x.type === type)
      .sort((a, b) => b.at - a.at)[0];
    return e ? new Date(e.at).toLocaleDateString(language === 'ar' ? 'ar' : 'en') : t.never;
  };

  const confirmRemove = () => {
    Alert.alert(t.deletePlant, undefined, [
      { text: t.continue === 'Continue' ? 'Cancel' : 'إلغاء', style: 'cancel' },
      {
        text: t.deletePlant,
        style: 'destructive',
        onPress: () => {
          archivePlant(plant.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md }}>
          🌱 {plant.nickname}
        </Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {language === 'ar' ? s?.nameAr : s?.nameEn}
          {s ? ` · ${language === 'ar' ? s.lightAr : s.lightEn}` : ''}
        </Text>

        {s && (
          <Card style={{ marginBottom: spacing.md, backgroundColor: colors.accentMuted }}>
            <Text variant="bodySmall">💡 {language === 'ar' ? s.tipAr : s.tipEn}</Text>
          </Card>
        )}

        {types.map((x) => (
          <Card key={x.type} style={{ marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text variant="body">
                  {x.icon} {x.label} · {t.everyDays(x.days)}
                </Text>
                <Text variant="caption" color="textTertiary">
                  {t.lastDone}: {lastDone(x.type)}
                </Text>
              </View>
              <Pressable
                onPress={() => logCare(plant.id, x.type)}
                accessibilityRole="button"
                accessibilityLabel={`${t.markDone}: ${x.label}`}
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

        <View style={{ marginTop: spacing.lg }}>
          <Button title={t.deletePlant} variant="secondary" onPress={confirmRemove} />
        </View>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
