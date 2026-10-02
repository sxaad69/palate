import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PawText } from '../components/PawText';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { localDayKey } from '../lib/schedule';

interface Props {
  onAddPet: () => void;
  onAddVaccine: (petId: string) => void;
  onAddVisit: (petId: string) => void;
}

const DUE_SOON_DAYS = 14;

export function RecordsScreen({ onAddPet, onAddVaccine, onAddVisit }: Props) {
  const { colors, spacing } = useTheme();
  const { pets, vaccinations, vetVisits, removeVaccination, removeVetVisit } = usePaw();
  const strings = t();
  const today = localDayKey(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const petId = selected ?? pets[0]?.id ?? null;

  if (pets.length === 0) {
    return (
      <Screen>
        <PawText variant="h1" style={{ marginTop: spacing.md }}>{strings.tabRecords}</PawText>
        <EmptyState icon="🩺" title={strings.noPetsTitle} body={strings.noPetsBody} actionLabel={strings.addPet} onAction={onAddPet} />
      </Screen>
    );
  }

  const petVaccines = vaccinations.filter((v) => v.petId === petId);
  const petVisits = vetVisits.filter((v) => v.petId === petId);

  const vaccineBadge = (dueDate?: string): { label: string; color: string } | null => {
    if (!dueDate) return null;
    if (dueDate < today) return { label: strings.overdueBadge, color: colors.danger };
    const soon = localDayKey(new Date(Date.now() + DUE_SOON_DAYS * 86_400_000));
    if (dueDate <= soon) return { label: strings.dueSoon, color: colors.warning };
    return { label: strings.upToDate, color: colors.success };
  };

  return (
    <Screen>
      <PawText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        {strings.tabRecords}
      </PawText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
        {pets.map((p) => (
          <Chip key={p.id} label={p.name} selected={p.id === petId} onPress={() => setSelected(p.id)} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <PawText variant="h2">{strings.vaccinations}</PawText>
        {petId && <Button title={strings.add} size="sm" variant="secondary" onPress={() => onAddVaccine(petId)} />}
      </View>
      {petVaccines.length === 0 ? (
        <EmptyState icon="💉" title={strings.emptyVaccinesTitle} body={strings.emptyVaccinesBody} />
      ) : (
        petVaccines.map((v) => {
          const badge = vaccineBadge(v.dueDate);
          return (
            <Card key={v.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <PawText variant="h3">{v.name}</PawText>
                  <PawText variant="bodySmall" color={colors.textSecondary}>
                    {strings.givenDate}: {v.givenDate}
                    {v.dueDate ? `  ·  ${strings.dueDate}: ${v.dueDate}` : ''}
                  </PawText>
                </View>
                {badge && (
                  <PawText variant="caption" color={badge.color} style={{ fontWeight: '700' }}>
                    {badge.label}
                  </PawText>
                )}
              </View>
              <Button title={strings.delete} variant="ghost" size="sm" onPress={() => removeVaccination(v.id)} style={{ marginTop: spacing.xs, alignSelf: 'flex-start' }} />
            </Card>
          );
        })
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm, marginTop: spacing.lg }}>
        <PawText variant="h2">{strings.vetVisits}</PawText>
        {petId && <Button title={strings.add} size="sm" variant="secondary" onPress={() => onAddVisit(petId)} />}
      </View>
      {petVisits.length === 0 ? (
        <EmptyState icon="🩺" title={strings.emptyVisitsTitle} body={strings.emptyVisitsBody} />
      ) : (
        petVisits.map((v) => (
          <Card key={v.id} style={{ marginBottom: spacing.sm }}>
            <PawText variant="h3">{v.date}</PawText>
            <PawText variant="bodySmall" color={colors.textSecondary}>
              {v.reason}{v.vet ? ` — ${v.vet}` : ''}
            </PawText>
            {!!v.notes && (
              <PawText variant="bodySmall" style={{ marginTop: spacing.xs }}>
                {v.notes}
              </PawText>
            )}
            <Button title={strings.delete} variant="ghost" size="sm" onPress={() => removeVetVisit(v.id)} style={{ marginTop: spacing.xs, alignSelf: 'flex-start' }} />
          </Card>
        ))
      )}
    </Screen>
  );
}
