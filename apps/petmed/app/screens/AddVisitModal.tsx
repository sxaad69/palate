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

export function AddVisitModal({ petId, onClose }: Props) {
  const { spacing } = useTheme();
  const { addVetVisit, pets } = usePaw();
  const strings = t();
  const [date, setDate] = useState(localDayKey(new Date()));
  const [vet, setVet] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  const pet = pets.find((p) => p.id === petId);
  const dateError = touched && !isValidDayKey(date) ? strings.invalidDate : null;

  const save = () => {
    setTouched(true);
    if (dateError || reason.trim() === '') return;
    addVetVisit({
      petId,
      date: date.trim(),
      vet: vet.trim() || undefined,
      reason: reason.trim(),
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <ModalShell title={`${strings.addVisit}${pet ? ` — ${pet.name}` : ''}`} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input label={strings.visitDate} value={date} onChangeText={setDate} autoCapitalize="none" error={dateError} />
        <Input label={strings.vetName} value={vet} onChangeText={setVet} autoCapitalize="words" />
        <Input label={strings.reason} value={reason} onChangeText={setReason} />
        <Input label={strings.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
        <View style={{ marginTop: spacing.sm }}>
          <Button title={strings.save} onPress={save} />
        </View>
      </ScrollView>
    </ModalShell>
  );
}
