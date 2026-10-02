import React, { useState } from 'react';
import { View } from 'react-native';
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

export function AddWeightModal({ petId, onClose }: Props) {
  const { spacing } = useTheme();
  const { addWeight, pets } = usePaw();
  const strings = t();
  const [kg, setKg] = useState('');
  const [date, setDate] = useState(localDayKey(new Date()));
  const [touched, setTouched] = useState(false);

  const pet = pets.find((p) => p.id === petId);
  const kgNum = parseFloat(kg.replace(',', '.'));
  const kgError = touched && !(kgNum > 0 && kgNum < 500) ? strings.weightKg : null;
  const dateError = touched && !isValidDayKey(date) ? strings.invalidDate : null;

  const save = () => {
    setTouched(true);
    if (kgError || dateError) return;
    addWeight(petId, Math.round(kgNum * 100) / 100, date.trim());
    onClose();
  };

  return (
    <ModalShell title={`${strings.logWeight}${pet ? ` — ${pet.name}` : ''}`} onClose={onClose}>
      <Input
        label={strings.weightKg}
        value={kg}
        onChangeText={setKg}
        keyboardType="decimal-pad"
        placeholder="12.5"
        error={kgError}
      />
      <Input
        label={strings.visitDate}
        value={date}
        onChangeText={setDate}
        autoCapitalize="none"
        error={dateError}
      />
      <View style={{ marginTop: spacing.sm }}>
        <Button title={strings.save} onPress={save} />
      </View>
    </ModalShell>
  );
}
