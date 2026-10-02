import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { ModalShell } from '../components/ModalShell';
import { PawText } from '../components/PawText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PetAvatar, petColor } from '../components/PetAvatar';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { adherence } from '../lib/schedule';

interface Props {
  petId: string;
  onClose: () => void;
  onAddMedication: (petId: string) => void;
  onAddWeight: (petId: string) => void;
  onPrepSheet: (petId: string) => void;
}

export function PetDetailModal({ petId, onClose, onAddMedication, onAddWeight, onPrepSheet }: Props) {
  const { colors, spacing, petColors } = useTheme();
  const { pets, meds, doseEvents, removePet, removeMedication } = usePaw();
  const strings = t();

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return null;
  const color = petColor(pet, [...petColors]);
  const petMeds = meds.filter((m) => m.petId === petId);

  const weights = pet.weightLog;
  const latest = weights[weights.length - 1];
  const oldest = weights.length > 1 ? weights[0] : undefined;
  const delta =
    latest && oldest && weights.length > 1
      ? Math.round((latest.kg - oldest.kg) * 100) / 100
      : null;

  const confirmDelete = () => {
    Alert.alert(strings.deletePet, strings.deletePetConfirm, [
      { text: strings.cancel, style: 'cancel' },
      { text: strings.delete, style: 'destructive', onPress: () => { removePet(petId); onClose(); } },
    ]);
  };

  return (
    <ModalShell title={pet.name} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PetAvatar pet={pet} size={72} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <PawText variant="h2">{pet.name}</PawText>
              <PawText variant="bodySmall" color={colors.textSecondary}>
                {[pet.breed, pet.birthdate].filter(Boolean).join(' · ')}
              </PawText>
              {!!pet.notes && (
                <PawText variant="bodySmall" style={{ marginTop: spacing.xs }}>
                  {pet.notes}
                </PawText>
              )}
            </View>
          </View>
          <Button title={strings.prepSheet} variant="dose" onPress={() => onPrepSheet(petId)} style={{ marginTop: spacing.md }} />
        </Card>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
          <PawText variant="h2">{strings.medications}</PawText>
          <Button title={strings.add} size="sm" variant="secondary" onPress={() => onAddMedication(petId)} />
        </View>
        {petMeds.length === 0 ? (
          <PawText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
            {strings.noMedsBody}
          </PawText>
        ) : (
          petMeds.map((m) => {
            const a = adherence(m, doseEvents, 7);
            return (
              <Card key={m.id} accentBorder={color} style={{ marginBottom: spacing.sm }}>
                <PawText variant="h3">{m.name}</PawText>
                <PawText variant="bodySmall" color={colors.textSecondary}>
                  {m.dose} · {m.times.join(', ')}
                </PawText>
                <PawText variant="caption" color={a.pct >= 80 ? colors.success : a.pct >= 50 ? colors.warning : colors.danger} style={{ fontWeight: '700', marginTop: spacing.xs }}>
                  {strings.prepAdherence}: {a.pct}%
                </PawText>
                <Button title={strings.delete} variant="ghost" size="sm" onPress={() => removeMedication(m.id)} style={{ marginTop: spacing.xs, alignSelf: 'flex-start' }} />
              </Card>
            );
          })
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md }}>
          <PawText variant="h2">{strings.weightLog}</PawText>
          <Button title={strings.add} size="sm" variant="secondary" onPress={() => onAddWeight(petId)} />
        </View>
        {weights.length === 0 ? (
          <PawText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
            {strings.noWeights}
          </PawText>
        ) : (
          <Card style={{ marginBottom: spacing.md }}>
            {latest && (
              <PawText variant="h3">
                {latest.kg} kg
                {delta !== null && delta !== 0 && (
                  <PawText variant="bodySmall" color={delta > 0 ? colors.warning : colors.success}>
                    {`  ${delta > 0 ? '+' : ''}${delta} kg ${strings.weightTrend}`}
                  </PawText>
                )}
              </PawText>
            )}
            {weights.slice(-5).reverse().map((w) => (
              <PawText key={w.date} variant="bodySmall" color={colors.textSecondary}>
                {w.date} — {w.kg} kg
              </PawText>
            ))}
          </Card>
        )}

        <Button title={strings.deletePet} variant="destructive" onPress={confirmDelete} />
      </ScrollView>
    </ModalShell>
  );
}
