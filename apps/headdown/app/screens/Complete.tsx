import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useFocus, focusScore, type Session } from '../store/focus';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function fmtTime(sec: number): string {
  const m = Math.round(sec / 60);
  return `${m}'`;
}

// The debrief: score, distraction log, optional reflection.
export default function CompleteScreen({
  session,
  onHome,
  onNew,
}: {
  session: Session;
  onHome: () => void;
  onNew: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { setReflection } = useFocus();
  const [note, setNote] = useState(session.reflection);
  const [saved, setSaved] = useState(false);

  const score = Math.round(focusScore(session) * 100);
  const status = session.strictBroken ? t.broken : session.completed ? t.sessionComplete : t.sessionEnded;

  const save = () => {
    setReflection(session.id, note.trim());
    setSaved(true);
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="display" align="center">{session.strictBroken ? '💥' : score >= 80 ? '🔥' : '🎯'}</Text>
        <Text variant="h1" align="center">{status}</Text>
        {session.label ? (
          <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{session.label}</Text>
        ) : null}

        <Card tone="action" style={styles.score}>
          <Text variant="display" align="center">{score}%</Text>
          <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{t.focusScore}</Text>
          <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>
            {fmtTime(session.focusedSec)} {t.focusedOf} {fmtTime((session.endedAt - session.startedAt) / 1000)}
          </Text>
        </Card>

        <Card style={styles.row}>
          <Text variant="body">{t.distractions}</Text>
          <Text variant="h3">{session.distractions.length}</Text>
        </Card>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          placeholder={t.reflectionPlaceholder}
          placeholderTextColor={colors.textTertiary}
          value={note}
          onChangeText={(v) => { setNote(v); setSaved(false); }}
          multiline
        />
        <Button title={saved ? '✓' : t.saveReflection} onPress={save} variant="secondary" disabled={saved} />

        <Button title={t.newSession} onPress={onNew} variant="primary" />
        <Button title={t.backHome} onPress={onHome} variant="ghost" />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  score: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, minHeight: 80, ...typography.body, textAlignVertical: 'top' },
});
