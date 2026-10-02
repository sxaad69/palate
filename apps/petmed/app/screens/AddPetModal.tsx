import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ModalShell } from '../components/ModalShell';
import { PawText } from '../components/PawText';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { usePaw, type Species } from '../store/app';
import { pickPetPhoto } from '../lib/photos';
import { PetAvatar } from '../components/PetAvatar';

const SPECIES: Species[] = ['dog', 'cat', 'bird', 'rabbit', 'other'];

interface Props {
  onClose: () => void;
  onDone: (petId: string) => void;
}

export function AddPetModal({ onClose, onDone }: Props) {
  const { spacing } = useTheme();
  const { addPet } = usePaw();
  const strings = t();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [picking, setPicking] = useState(false);

  const speciesLabel: Record<Species, string> = {
    dog: strings.speciesDog,
    cat: strings.speciesCat,
    bird: strings.speciesBird,
    rabbit: strings.speciesRabbit,
    other: strings.speciesOther,
  };

  const save = () => {
    if (!name.trim()) return;
    const id = addPet({
      name: name.trim(),
      species,
      breed: breed.trim() || undefined,
      birthdate: birthdate.trim() || undefined,
      notes: notes.trim() || undefined,
      photoUri,
    });
    onDone(id);
  };

  const pickPhoto = async () => {
    setPicking(true);
    try {
      const uri = await pickPetPhoto(`tmp-${Date.now()}`);
      if (uri) setPhotoUri(uri);
    } finally {
      setPicking(false);
    }
  };

  return (
    <ModalShell title={strings.addPet} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input label={strings.petName} value={name} onChangeText={setName} autoCapitalize="words" testID="pet-name-input" />
        <PawText variant="bodySmall" style={{ marginBottom: spacing.xs }}>{strings.species}</PawText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
          {SPECIES.map((s) => (
            <Chip key={s} label={speciesLabel[s]} selected={species === s} onPress={() => setSpecies(s)} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          {photoUri && (
            <PetAvatar pet={{ id: '', name, species, colorIndex: 0, weightLog: [], photoUri }} size={48} />
          )}
          <Button
            title={picking ? '…' : strings.addPhoto}
            variant="secondary"
            size="sm"
            onPress={() => void pickPhoto()}
            disabled={picking}
            style={{ marginLeft: spacing.sm }}
          />
        </View>
        <Input label={strings.breed} value={breed} onChangeText={setBreed} autoCapitalize="words" />
        <Input label={strings.birthdate} value={birthdate} onChangeText={setBirthdate} placeholder="2024-05-01" autoCapitalize="none" />
        <Input label={strings.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
        <Button title={strings.save} onPress={save} disabled={!name.trim()} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </ModalShell>
  );
}
