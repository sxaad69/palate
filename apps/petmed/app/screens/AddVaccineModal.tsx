import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ModalShell } from '../components/ModalShell';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import { isValidDayKey, localDayKey } from '../lib/schedule';

interface Props {
  petId: string;
  onClose: () => void;
}

export function AddVaccineModal({ petId, onClose }: Props) {
  const { spacing } = useTheme();
  const { addVaccination, pets } = usePaw();
  const strings = t();
  const [name, setName] = useState('');
  const [givenDate, setGivenDate] = useState(localDayKey(new Date()));
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  const pet = pets.find((p) => p.id === petId);
  const givenError = touched && !isValidDayKey(givenDate) ? strings.invalidDate : null;
  const dueError = touched && dueDate.trim() !== '' && !isValidDayKey(dueDate.trim()) ? strings.invalidDate : null;

  const save = () => {
    setTouched(true);
    if (givenError || dueError || name.trim() === '') return;
    addVaccination({
      petId,
      name: name.trim(),
      givenDate: givenDate.trim(),
      dueDate: dueDate.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <ModalShell title={`${strings.addVaccine}${pet ? ` — ${pet.name}` : ''}`} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input label={strings.vaccineName} value={name} onChangeText={setName} autoCapitalize="words" />
        <Input label={strings.givenDate} value={givenDate} onChangeText={setGivenDate} autoCapitalize="none" error={givenError} />
        <Input label={strings.dueDate} value={dueDate} onChangeText={setDueDate} autoCapitalize="none" error={dueError} />
        <Input label={strings.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={2} />
        <View style={{ marginTop: spacing.sm }}>
          <Button title={strings.save} onPress={save} />
        </View>
      </ScrollView>
    </ModalShell>
  );
}
