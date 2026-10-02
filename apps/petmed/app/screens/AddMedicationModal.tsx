import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ModalShell } from '../components/ModalShell';
import { PawText } from '../components/PawText';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { usePaw } from '../store/app';
import {
  DEFAULT_TIMES,
  isValidDayKey,
  isValidTime,
  localDayKey,
  type Frequency,
} from '../lib/schedule';

const FREQS: Frequency[] = ['daily', 'twice', 'three', 'weekly'];

interface Props {
  petId: string;
  onClose: () => void;
}

export function AddMedicationModal({ petId, onClose }: Props) {
  const { colors, spacing } = useTheme();
  const { addMedication, pets } = usePaw();
  const strings = t();
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [times, setTimes] = useState<string[]>(DEFAULT_TIMES.daily);
  const [startDate, setStartDate] = useState(localDayKey(new Date()));
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  const pet = pets.find((p) => p.id === petId);

  const freqLabel: Record<Frequency, string> = {
    daily: strings.freqDaily,
    twice: strings.freqTwice,
    three: strings.freqThree,
    weekly: strings.freqWeekly,
  };

  const timeError = touched && times.some((x) => !isValidTime(x)) ? strings.invalidTime : null;
  const startError = touched && !isValidDayKey(startDate) ? strings.invalidDate : null;
  const endError = touched && endDate.trim() !== '' && !isValidDayKey(endDate.trim()) ? strings.invalidDate : null;
  const valid =
    name.trim() !== '' && !timeError && !startError && !endError && times.length > 0;

  const save = () => {
    setTouched(true);
    if (!valid) return;
    addMedication({
      petId,
      name: name.trim(),
      dose: dose.trim(),
      frequency,
      times: times.map((x) => x.trim()),
      startDate: startDate.trim(),
      endDate: endDate.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const setFreq = (f: Frequency) => {
    setFrequency(f);
    setTimes(DEFAULT_TIMES[f]);
  };

  return (
    <ModalShell title={`${strings.addMedication}${pet ? ` — ${pet.name}` : ''}`} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input label={strings.medName} value={name} onChangeText={setName} autoCapitalize="words" />
        <Input label={strings.doseAmount} value={dose} onChangeText={setDose} />
        <PawText variant="bodySmall" style={{ marginBottom: spacing.xs }}>{strings.frequency}</PawText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
          {FREQS.map((f) => (
            <Chip key={f} label={freqLabel[f]} selected={frequency === f} onPress={() => setFreq(f)} />
          ))}
        </View>
        <PawText variant="bodySmall" style={{ marginBottom: spacing.xs }}>{strings.times}</PawText>
        {times.map((x, i) => (
          <Input
            key={i}
            label={`${strings.times} ${i + 1}`}
            value={x}
            onChangeText={(v) => setTimes(times.map((y, j) => (j === i ? v : y)))}
            placeholder="09:00"
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
            error={i === 0 ? timeError : null}
          />
        ))}
        {times.length < 6 && (
          <Button
            title={strings.addTime}
            variant="secondary"
            size="sm"
            onPress={() => setTimes([...times, '09:00'])}
            style={{ marginBottom: spacing.md, alignSelf: 'flex-start' }}
          />
        )}
        <Input
          label={strings.startDate}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="2026-10-02"
          autoCapitalize="none"
          error={startError}
        />
        <Input
          label={strings.endDate}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="2026-11-02"
          autoCapitalize="none"
          error={endError}
        />
        <Input label={strings.notes} value={notes} onChangeText={setNotes} multiline numberOfLines={2} />
        {!valid && touched && (
          <PawText variant="bodySmall" color={colors.danger} style={{ marginBottom: spacing.sm }}>
            {strings.retry}
          </PawText>
        )}
        <Button title={strings.save} onPress={save} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </ModalShell>
  );
}
