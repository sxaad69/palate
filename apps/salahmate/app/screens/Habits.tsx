import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings, prayerName } from '../lib/strings';
import { useSalah, FREE_HABIT_LIMIT } from '../store/salah';
import { TRACKED_PRAYERS, type PrayerKey } from '../lib/prayer';

// Add-habit form: name + anchor prayer. Habits live "after" a prayer.
export function HabitFormScreen({ onDone }: { onDone: () => void }) {
  const { colors, spacing } = useTheme();
  const { t, locale } = useStrings();
  const { addHabit } = useSalah();
  const [name, setName] = useState('');
  const [anchor, setAnchor] = useState<PrayerKey>('fajr');

  const save = () => {
    if (!name.trim()) return;
    addHabit(name, anchor);
    onDone();
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.hbAdd}</Text>

        <Text variant="overline" color="textSecondary">{t.hbName}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.hbName}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
          accessibilityLabel={t.hbName}
          autoFocus
        />

        <Text variant="overline" color="textSecondary" style={{ marginTop: spacing.md }}>{t.hbAnchor}</Text>
        <View style={[styles.row, { marginVertical: spacing.sm }]}>
          {TRACKED_PRAYERS.map((p) => (
            <Chip
              key={p}
              label={prayerName(p, t, locale)}
              selected={anchor === p}
              onPress={() => setAnchor(p)}
            />
          ))}
        </View>

        <Button title={t.hbSave} onPress={save} disabled={!name.trim()} style={{ marginTop: spacing.lg, minHeight: 56 }} />
      </ScrollView>
    </Screen>
  );
}

export function HabitsScreen({
  onAdd,
  onPaywall,
}: {
  onAdd: () => void;
  onPaywall: () => void;
}) {
  const { spacing } = useTheme();
  const { t, locale } = useStrings();
  const { habitsToday, deleteHabit, pro } = useSalah();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const limitHit = !pro && habitsToday.length >= FREE_HABIT_LIMIT;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t.hbTitle}</Text>

        {limitHit && (
          <Card tone="action" style={{ marginBottom: spacing.md }}>
            <Text variant="body">{t.hbFreeLimit}</Text>
            <Button title={t.sGoPlus} variant="secondary" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        {habitsToday.length === 0 ? (
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
            {t.hbEmpty}
          </Text>
        ) : (
          habitsToday.map(({ habit, streak }) => (
            <Card key={habit.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text variant="h3">{habit.name}</Text>
                  <Text variant="caption" color="textSecondary">
                    {t.hbAnchor} {prayerName(habit.anchorPrayer, t, locale)}
                    {streak > 0 ? ` · 🔥 ${streak} ${t.hbStreak}` : ''}
                  </Text>
                </View>
                {confirmId === habit.id ? (
                  <View style={styles.row}>
                    <Button title={t.commonDelete} onPress={() => { deleteHabit(habit.id); setConfirmId(null); }} />
                    <Button title={t.commonCancel} variant="ghost" onPress={() => setConfirmId(null)} />
                  </View>
                ) : (
                  <Button title="✕" variant="ghost" onPress={() => setConfirmId(habit.id)} style={styles.mini} accessibilityLabel={t.hbDelete} />
                )}
              </View>
            </Card>
          ))
        )}

        {!limitHit && (
          <Button title={`+ ${t.hbAdd}`} onPress={onAdd} style={{ marginTop: spacing.md, minHeight: 56 }} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  input: { fontSize: 20, borderBottomWidth: 1, paddingVertical: 8, marginTop: 4 },
  mini: { minWidth: 48, paddingHorizontal: 0 },
});
