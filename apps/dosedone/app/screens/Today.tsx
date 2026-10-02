import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useMeds, type TodayDose } from '../store/meds';

function DoseCard({ dose }: { dose: TodayDose }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { takeDose, undoDose } = useMeds();
  const { med, time, status, logId } = dose;

  const statusLabel =
    status === 'taken' ? t.taken : status === 'due' ? t.dueNow : status === 'missed' ? t.missed : t.upcoming;
  const statusColor =
    status === 'taken' ? 'success' : status === 'missed' ? 'danger' : status === 'due' ? 'highlight' : 'textSecondary';

  return (
    <Card
      tone={status === 'due' ? 'action' : 'default'}
      style={[styles.card, { marginBottom: spacing.md, borderWidth: status === 'due' ? 2 : 1 }]}
    >
      <View style={styles.topRow}>
        <Text variant="display" color="accent">{time}</Text>
        <Text variant="body" color={statusColor} style={{ fontWeight: '600' }}>{statusLabel}</Text>
      </View>
      <Text variant="h2" style={{ marginBottom: spacing.xs }}>{med.name}</Text>
      <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>{med.dosage}</Text>

      {status === 'taken' && logId ? (
        <View style={styles.takenRow}>
          <Text variant="h3" color="success">{t.taken}</Text>
          <Button title={t.undo} variant="ghost" onPress={() => undoDose(logId)} />
        </View>
      ) : status === 'missed' ? (
        <Text variant="body" color="danger" style={{ fontWeight: '600' }}>{t.missed}</Text>
      ) : (
        <Button
          title={t.take}
          variant="action"
          onPress={() => takeDose(med.id, time)}
          style={{ minHeight: 64 }}
          accessibilityLabel={`${t.take}: ${med.name} ${time}`}
        />
      )}
    </Card>
  );
}

export function TodayScreen({ onAddMed }: { onAddMed: () => void }) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { todayDoses, takenToday, dueCount, lowStockMeds, refillMed } = useMeds();
  const [refillFor, setRefillFor] = useState<string | null>(null);
  const [refillCount, setRefillCount] = useState('');

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md }}>{t.todayTitle}</Text>
        <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {takenToday}/{todayDoses.length}
          {dueCount > 0 ? ` · ${dueCount} ${t.dueNow.toLowerCase()}` : ''}
        </Text>

        {lowStockMeds.map((med) => (
          <Card key={med.id} tone="action" style={{ marginBottom: spacing.md }}>
            <Text variant="h3">⚠️ {med.name} — {t.lowStock}</Text>
            <Text variant="body" color="textSecondary" style={{ marginBottom: spacing.sm }}>
              {med.pillsLeft} {t.medPills.toLowerCase()}
            </Text>
            {refillFor === med.id ? (
              <View style={styles.refillRow}>
                <TextInput
                  value={refillCount}
                  onChangeText={(v) => setRefillCount(v.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  placeholder="30"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.refillInput, { color: colors.textPrimary, borderColor: colors.border }]}
                  accessibilityLabel={t.medPills}
                />
                <Button
                  title={t.refill}
                  variant="action"
                  onPress={() => {
                    const n = parseInt(refillCount, 10);
                    if (n > 0) {
                      refillMed(med.id, n);
                      setRefillFor(null);
                      setRefillCount('');
                    }
                  }}
                />
              </View>
            ) : (
              <Button title={t.refill} variant="secondary" onPress={() => setRefillFor(med.id)} />
            )}
          </Card>
        ))}

        {todayDoses.length === 0 ? (
          <>
            <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
              {t.todayEmpty}
            </Text>
            <Button title={`+ ${t.medAdd}`} onPress={onAddMed} style={{ marginTop: spacing.md }} />
          </>
        ) : (
          todayDoses.map((d) => <DoseCard key={`${d.med.id}-${d.time}`} dose={d} />)
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  takenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refillRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  refillInput: { fontSize: 24, fontWeight: '700', borderBottomWidth: 1, paddingVertical: 4, minWidth: 80, textAlign: 'center' },
});
