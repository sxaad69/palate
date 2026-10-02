import React from 'react';
import { ScrollView, Share, View } from 'react-native';
import { ModalShell } from '../components/ModalShell';
import { PawText } from '../components/PawText';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { buildVetPrepSheet } from '../lib/prepSheet';

interface Props {
  petId: string;
  onClose: () => void;
}

export function PrepSheetModal({ petId, onClose }: Props) {
  const { spacing } = useTheme();
  const { pets, meds, vaccinations, vetVisits, doseEvents } = usePaw();
  const strings = t();

  const pet = pets.find((p) => p.id === petId);
  if (!pet) return null;

  const sheet = buildVetPrepSheet(
    pet,
    meds.filter((m) => m.petId === petId),
    vaccinations.filter((v) => v.petId === petId),
    vetVisits.filter((v) => v.petId === petId),
    doseEvents.filter((e) => e.petId === petId),
    strings,
  );

  const share = async () => {
    try {
      await Share.share({ message: sheet, title: strings.prepTitle });
    } catch {
      // user dismissed — nothing to do
    }
  };

  return (
    <ModalShell title={strings.prepSheet} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <PawText variant="body" style={{ fontFamily: 'monospace' }}>
          {sheet}
        </PawText>
      </ScrollView>
      <View style={{ marginTop: spacing.md }}>
        <Button title={strings.sharePrep} variant="dose" onPress={() => void share()} />
      </View>
    </ModalShell>
  );
}
