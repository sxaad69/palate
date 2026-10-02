import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety } from '../store/sobriety';

const FREE_JOURNAL_LIMIT = 30;

// ponytail: journal is local-first and simple. Free tier gets 30 entries —
// enough to build the habit; unlimited journal is a Plus perk.
export function JournalScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { t } = useStrings();
  const { journal, addJournal, deleteJournal, pro } = useSobriety();
  const [draft, setDraft] = useState('');

  const limitHit = !pro && journal.length >= FREE_JOURNAL_LIMIT;

  const save = () => {
    if (!draft.trim() || limitHit) return;
    addJournal(draft.trim());
    setDraft('');
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>{t.jTitle}</Text>

        {limitHit ? (
          <Card tone="gold" style={{ marginBottom: spacing.md }}>
            <Text variant="body">{t.pwTitle}</Text>
            <Button title={t.pGoPlus} variant="gold" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        ) : (
          <Card style={{ marginBottom: spacing.md }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t.jPlaceholder}
              placeholderTextColor={colors.textTertiary}
              multiline
              style={[styles.input, { color: colors.textPrimary, minHeight: 88 }]}
              accessibilityLabel={t.jPlaceholder}
            />
            <Button title={t.jSave} onPress={save} disabled={!draft.trim()} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        {journal.length === 0 ? (
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
            {t.jEmpty}
          </Text>
        ) : (
          journal.map((entry) => (
            <Card key={entry.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.entryHeader}>
                <Text variant="caption" color="textSecondary">{entry.date}</Text>
                <Pressable
                  onPress={() => deleteJournal(entry.id)}
                  accessibilityRole="button"
                  accessibilityLabel={t.commonClose}
                  hitSlop={12}
                >
                  <Text variant="caption" color="textTertiary">✕</Text>
                </Pressable>
              </View>
              <Text variant="body">{entry.text}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { fontSize: 16, lineHeight: 24, textAlignVertical: 'top' },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
});
