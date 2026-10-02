import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useDreams, type Mood } from '../store/dreams';
import { SYMBOLS, detectSymbols } from '../data/symbols';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const MOODS: { id: Mood; emoji: string; label: (t: any) => string }[] = [
  { id: 'good', emoji: '😌', label: (t) => t.moodGood },
  { id: 'neutral', emoji: '😐', label: (t) => t.moodNeutral },
  { id: 'bad', emoji: '😟', label: (t) => t.moodBad },
];

// Log a dream: narrative → auto-suggested symbols → confirm → save.
export default function DreamFormScreen({
  dreamId,
  onDone,
  onCancel,
}: {
  dreamId: string | null;
  onDone: (id: string) => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { dreams, addDream, updateDream } = useDreams();
  const existing = dreamId ? dreams.find((d) => d.id === dreamId) : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [narrative, setNarrative] = useState(existing?.narrative ?? '');
  const [mood, setMood] = useState<Mood>(existing?.mood ?? 'neutral');
  const [confirmed, setConfirmed] = useState<string[]>(existing?.symbolIds ?? []);
  const rtl = t.dir === 'rtl';

  const suggested = useMemo(
    () => (narrative.trim().length >= 10 ? detectSymbols(narrative) : []),
    [narrative],
  );

  const toggle = (id: string) =>
    setConfirmed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = () => {
    if (narrative.trim().length < 10) {
      Alert.alert(t.logDream, t.needNarrative);
      return;
    }
    const data = {
      title: title.trim(),
      narrative: narrative.trim(),
      mood,
      date: existing?.date ?? new Date().toISOString(),
      symbolIds: confirmed,
    };
    if (existing) {
      updateDream(existing.id, data);
      onDone(existing.id);
    } else {
      const d = addDream(data);
      onDone(d.id);
    }
  };

  const name = (s: (typeof SYMBOLS)[number]) => (rtl ? s.ar : s.en);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text variant="h1">{existing ? t.editDream : t.logDream}</Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          placeholder={t.titlePlaceholder}
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.area, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          placeholder={t.narrativePlaceholder}
          placeholderTextColor={colors.textTertiary}
          value={narrative}
          onChangeText={setNarrative}
          multiline
          textAlignVertical="top"
        />

        <Text variant="h3" style={{ color: colors.textSecondary }}>{t.mood}</Text>
        <View style={styles.moods}>
          {MOODS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMood(m.id)}
              style={[
                styles.mood,
                { backgroundColor: mood === m.id ? colors.highlightMuted : colors.surface, borderColor: mood === m.id ? colors.highlight : colors.border },
              ]}
            >
              <Text variant="h2" align="center">{m.emoji}</Text>
              <Text variant="caption" align="center">{m.label(t)}</Text>
            </Pressable>
          ))}
        </View>

        <Text variant="h3" style={{ color: colors.textSecondary }}>{t.symbolsFound}</Text>
        {suggested.length === 0 ? (
          <Text variant="body" style={{ color: colors.textTertiary }}>{t.noSymbols}</Text>
        ) : (
          <View style={styles.chips}>
            {suggested.map((s) => {
              const on = confirmed.includes(s.id);
              return (
                <Pressable
                  key={s.id}
                  onPress={() => toggle(s.id)}
                  style={[
                    styles.chip,
                    { backgroundColor: on ? colors.highlight : colors.surface, borderColor: on ? colors.highlight : colors.border },
                  ]}
                >
                  <Text variant="body" style={{ color: on ? colors.textPrimary : colors.textSecondary }}>
                    {on ? '✓ ' : ''}{name(s)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button title={t.saveDream} onPress={save} variant="primary" />
        <Button title={t.cancel} onPress={onCancel} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm, paddingBottom: 0 },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, ...typography.body },
  area: { minHeight: 160 },
  moods: { flexDirection: 'row', gap: spacing.sm },
  mood: { flex: 1, borderWidth: 2, borderRadius: radii.lg, paddingVertical: spacing.md, gap: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full },
  footer: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
});
