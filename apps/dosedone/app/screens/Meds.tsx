import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useMeds, FREE_MED_LIMIT, type Med } from '../store/meds';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value.split(':').map(Number);
  const set = (nh: number, nm: number) =>
    onChange(`${pad2((nh + 24) % 24)}:${pad2((nm + 60) % 60)}`);
  return (
    <View style={styles.timeRow}>
      <Button title="−" variant="secondary" onPress={() => set(h - 1, m)} style={styles.stepper} />
      <Text variant="display">{pad2(h)}:{pad2(m)}</Text>
      <Button title="+" variant="secondary" onPress={() => set(h + 1, m)} style={styles.stepper} />
      <Button title="−" variant="secondary" onPress={() => set(h, m - 15)} style={styles.stepper} />
      <Button title="+" variant="secondary" onPress={() => set(h, m + 15)} style={styles.stepper} />
    </View>
  );
}

// Add/edit form. One screen, big fields, times as a list of HH:MM pickers.
export function MedFormScreen({
  medId,
  onDone,
}: {
  medId: string | null;
  onDone: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { meds, addMed, updateMed, deleteMed } = useMeds();
  const existing = medId ? meds.find((m) => m.id === medId) ?? null : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [dosage, setDosage] = useState(existing?.dosage ?? '');
  // Default first dose: the next hour — sensible for the user and keeps the
  // Maestro smoke test deterministic (TAKE is always visible for it).
  const [times, setTimes] = useState<string[]>(() => {
    if (existing) return existing.times;
    const h = (new Date().getHours() + 1) % 24;
    return [`${String(h).padStart(2, '0')}:00`];
  });
  const [pillsPerDose, setPillsPerDose] = useState(existing?.pillsPerDose ?? 1);
  const [pillsLeft, setPillsLeft] = useState(existing ? String(existing.pillsLeft) : '30');
  const [lowThreshold, setLowThreshold] = useState(existing ? String(existing.lowThreshold) : '7');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const canSave = name.trim().length > 0 && times.length > 0;

  const save = () => {
    if (!canSave) return;
    const payload = {
      name: name.trim(),
      dosage: dosage.trim() || '—',
      times: [...times].sort(),
      pillsPerDose: Math.max(1, pillsPerDose),
      pillsLeft: Math.max(0, parseInt(pillsLeft, 10) || 0),
      lowThreshold: Math.max(1, parseInt(lowThreshold, 10) || 1),
    };
    if (existing) updateMed(existing.id, payload);
    else addMed(payload);
    onDone();
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
          {existing ? t.medEdit : t.medAdd}
        </Text>

        <Text variant="overline" color="textSecondary">{t.medName}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.medName}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          accessibilityLabel={t.medName}
        />

        <Text variant="overline" color="textSecondary" style={{ marginTop: spacing.md }}>{t.medDosage}</Text>
        <TextInput
          value={dosage}
          onChangeText={setDosage}
          placeholder={t.medDosage}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          accessibilityLabel={t.medDosage}
        />

        <Text variant="overline" color="textSecondary" style={{ marginTop: spacing.md }}>{t.medTimes}</Text>
        {times.map((tm, i) => (
          <Card key={i} style={[styles.timeCard, { marginTop: spacing.sm }]}>
            <TimePicker value={tm} onChange={(v) => setTimes(times.map((x, j) => (j === i ? v : x)))} />
            {times.length > 1 && (
              <Button title="✕" variant="ghost" onPress={() => setTimes(times.filter((_, j) => j !== i))} style={styles.remove} />
            )}
          </Card>
        ))}
        <Button title={`+ ${t.medAddTime}`} variant="secondary" onPress={() => setTimes([...times, '20:00'])} style={{ marginTop: spacing.sm }} />

        <Text variant="overline" color="textSecondary" style={{ marginTop: spacing.md }}>{t.medPills}</Text>
        <View style={styles.stepperRow}>
          <Button title="−" variant="secondary" onPress={() => setPillsPerDose((p) => Math.max(1, p - 1))} style={styles.stepper} />
          <Text variant="h2">{pillsPerDose}</Text>
          <Button title="+" variant="secondary" onPress={() => setPillsPerDose((p) => Math.min(10, p + 1))} style={styles.stepper} />
        </View>

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Text variant="overline" color="textSecondary">{t.medPills}</Text>
            <TextInput
              value={pillsLeft}
              onChangeText={(v) => setPillsLeft(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              accessibilityLabel={t.medPills}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="overline" color="textSecondary">{t.medLowAt}</Text>
            <TextInput
              value={lowThreshold}
              onChangeText={(v) => setLowThreshold(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              accessibilityLabel={t.medLowAt}
            />
          </View>
        </View>

        <Button title={t.medSave} variant="action" onPress={save} disabled={!canSave} style={{ marginTop: spacing.lg, minHeight: 60 }} />

        {existing && (
          !confirmDelete ? (
            <Button title={t.medDelete} variant="ghost" onPress={() => setConfirmDelete(true)} style={{ marginTop: spacing.md }} />
          ) : (
            <View style={[styles.row, { marginTop: spacing.md }]}>
              <Button title={t.commonDelete} onPress={() => { deleteMed(existing.id); onDone(); }} />
              <Button title={t.commonCancel} variant="ghost" onPress={() => setConfirmDelete(false)} />
            </View>
          )
        )}
      </ScrollView>
    </Screen>
  );
}

export function MedsScreen({
  onEdit,
  onAdd,
  onPaywall,
}: {
  onEdit: (medId: string) => void;
  onAdd: () => void;
  onPaywall: () => void;
}) {
  const { spacing } = useTheme();
  const { t } = useStrings();
  const { meds, pro } = useMeds();

  const limitHit = !pro && meds.length >= FREE_MED_LIMIT;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.medsTitle}</Text>

        {limitHit && (
          <Card tone="action" style={{ marginBottom: spacing.md }}>
            <Text variant="body">{t.medFreeLimit}</Text>
            <Button title={t.sGoPlus} variant="action" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        {meds.length === 0 ? (
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
            {t.medEmpty}
          </Text>
        ) : (
          meds.map((med) => (
            <MedRow key={med.id} med={med} onEdit={() => onEdit(med.id)} />
          ))
        )}

        {!limitHit && (
          <Button title={`+ ${t.medAdd}`} onPress={onAdd} style={{ marginTop: spacing.md, minHeight: 60 }} />
        )}
      </ScrollView>
    </Screen>
  );
}

function MedRow({ med, onEdit }: { med: Med; onEdit: () => void }) {
  const { spacing } = useTheme();
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1 }}>
          <Text variant="h3">{med.name}</Text>
          <Text variant="body" color="textSecondary">{med.dosage}</Text>
          <Text variant="bodySmall" color="textSecondary">
            {med.times.join(' · ')}  —  {med.pillsLeft} {med.pillsLeft <= med.lowThreshold ? '⚠️' : ''}
          </Text>
        </View>
        <Button title="›" variant="secondary" onPress={onEdit} style={styles.go} accessibilityLabel={med.name} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  input: { fontSize: 20, borderBottomWidth: 1, paddingVertical: 8, marginTop: 4, marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 },
  timeCard: { flexDirection: 'row', alignItems: 'center' },
  remove: { minWidth: 48, paddingHorizontal: 0 },
  stepper: { minWidth: 56, paddingHorizontal: 0 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  twoCol: { flexDirection: 'row', gap: 16, marginTop: 8 },
  go: { minWidth: 56, minHeight: 56 },
});
