import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PawText } from '../components/PawText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PetAvatar, petColor } from '../components/PetAvatar';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { occurrencesInRange, localDayKey } from '../lib/schedule';

interface Props {
  onAddPet: () => void;
  onOpenPet: (petId: string) => void;
  onOpenPaywall: () => void;
}

export function PetsScreen({ onAddPet, onOpenPet, onOpenPaywall }: Props) {
  const { colors, spacing, petColors } = useTheme();
  const { pets, meds, canAddPet } = usePaw();
  const strings = t();
  const today = localDayKey(new Date());
  const todaysDoses = occurrencesInRange(meds, today, today);

  const addPressed = () => (canAddPet ? onAddPet() : onOpenPaywall());

  return (
    <Screen>
      <PawText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        {strings.myPets}
      </PawText>

      {pets.length === 0 ? (
        <EmptyState
          icon="🐾"
          title={strings.noPetsTitle}
          body={strings.noPetsBody}
          actionLabel={strings.addPet}
          onAction={addPressed}
        />
      ) : (
        <>
          {pets.map((pet) => {
            const count = todaysDoses.filter((o) => o.petId === pet.id).length;
            const color = petColor(pet, [...petColors]);
            return (
              <Pressable
                key={pet.id}
                accessibilityRole="button"
                accessibilityLabel={pet.name}
                onPress={() => onOpenPet(pet.id)}
                android_ripple={{ color: colors.overlay }}
              >
                <Card accentBorder={color} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PetAvatar pet={pet} />
                    <View style={{ marginLeft: spacing.md, flex: 1 }}>
                      <PawText variant="h2">{pet.name}</PawText>
                      <PawText variant="bodySmall" color={colors.textSecondary}>
                        {pet.breed ?? strings[`species${pet.species[0]?.toUpperCase()}${pet.species.slice(1)}` as keyof typeof strings]}
                      </PawText>
                      <PawText variant="caption" color={color} style={{ fontWeight: '700', marginTop: spacing.xs }}>
                        {count} {strings.dosesToday}
                      </PawText>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
          <Button
            title={strings.addPet}
            variant="secondary"
            onPress={addPressed}
            style={{ marginTop: spacing.sm }}
          />
        </>
      )}
    </Screen>
  );
}
