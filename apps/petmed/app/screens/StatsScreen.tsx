import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PawText } from '../components/PawText';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { petColor } from '../components/PetAvatar';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { adherence, dosesGiven, streak } from '../lib/schedule';

interface Props {
  onAddMedication: () => void;
}

export function StatsScreen({ onAddMedication }: Props) {
  const { colors, spacing, petColors } = useTheme();
  const { pets, meds, doseEvents } = usePaw();
  const strings = t();

  if (meds.length === 0) {
    return (
      <Screen>
        <PawText variant="h1" style={{ marginTop: spacing.md }}>{strings.tabStats}</PawText>
        <EmptyState icon="📊" title={strings.noStatsTitle} body={strings.noStatsBody} actionLabel={strings.addMedication} onAction={onAddMedication} />
      </Screen>
    );
  }

  const petById = new Map(pets.map((p) => [p.id, p]));
  const weekDoses = dosesGiven(meds, doseEvents, 7);

  return (
    <Screen>
      <PawText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        {strings.tabStats}
      </PawText>

      <Card style={{ marginBottom: spacing.md, alignItems: 'center' }}>
        <PawText variant="display">{weekDoses}</PawText>
        <PawText variant="bodySmall" color={colors.textSecondary}>
          {strings.dosesThisWeek}
        </PawText>
      </Card>

      <PawText variant="h2" style={{ marginBottom: spacing.sm }}>
        {strings.adherence7d}
      </PawText>
      {meds.map((m) => {
        const a = adherence(m, doseEvents, 7);
        const pet = petById.get(m.petId);
        const color = pet ? petColor(pet, [...petColors]) : colors.accent;
        const petStreak = pet ? streak(pet.id, meds, doseEvents) : 0;
        return (
          <Card key={m.id} accentBorder={color} style={{ marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <PawText variant="bodySmall" color={color} style={{ fontWeight: '700' }}>
                  {pet?.name ?? ''}
                </PawText>
                <PawText variant="h3">{m.name}</PawText>
                <PawText variant="caption" color={colors.textSecondary}>
                  {a.given}/{a.expected} · {petStreak} {strings.dayStreak}
                </PawText>
              </View>
              <PawText
                variant="h1"
                color={a.pct >= 80 ? colors.success : a.pct >= 50 ? colors.warning : colors.danger}
              >
                {a.pct}%
              </PawText>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt, marginTop: spacing.sm }}>
              <View
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: `${a.pct}%`,
                  backgroundColor: a.pct >= 80 ? colors.success : a.pct >= 50 ? colors.warning : colors.danger,
                }}
              />
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
