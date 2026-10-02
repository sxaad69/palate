import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useDreams, type Mood } from '../store/dreams';
import { SYMBOLS } from '../data/symbols';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const MOOD_EMOJI: Record<Mood, string> = { good: '😌', neutral: '😐', bad: '😟' };

function fmtDate(iso: string, rtl: boolean): string {
  return new Date(iso).toLocaleDateString(rtl ? 'ar' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export default function JournalScreen({
  onOpen,
  onNew,
}: {
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { dreams, streak } = useDreams();
  const rtl = t.dir === 'rtl';

  const symbolName = (id: string) => {
    const s = SYMBOLS.find((x) => x.id === id);
    return s ? (rtl ? s.ar : s.en) : id;
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text variant="h1">{t.journal}</Text>
          {streak > 0 && (
            <View style={[styles.streakChip, { backgroundColor: colors.highlightMuted }]}>
              <Text variant="body">🌙 {streak}</Text>
            </View>
          )}
        </View>

        {dreams.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="display">🌙</Text>
            <Text variant="h2" align="center">{t.emptyTitle}</Text>
            <Text variant="body" align="center" style={{ color: colors.textSecondary }}>{t.emptyBody}</Text>
          </View>
        ) : (
          dreams.map((d) => (
            <Pressable key={d.id} onPress={() => onOpen(d.id)}>
              <Card style={styles.row}>
                <Text variant="h2">{MOOD_EMOJI[d.mood]}</Text>
                <View style={styles.info}>
                  <Text variant="h3" numberOfLines={1}>{d.title || fmtDate(d.date, rtl)}</Text>
                  <Text variant="caption" style={{ color: colors.textTertiary }}>
                    {fmtDate(d.date, rtl)}
                    {d.symbolIds.length > 0 && ` · ${d.symbolIds.map(symbolName).slice(0, 3).join(', ')}`}
                  </Text>
                </View>
                <Text variant="h3" style={{ color: colors.textTertiary }}>›</Text>
              </Card>
            </Pressable>
          ))
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button title={t.logDream} onPress={onNew} variant="primary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm, paddingBottom: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  streakChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing['3xl'] },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info: { flex: 1, gap: 2 },
  footer: { padding: spacing.lg, paddingTop: spacing.sm },
});
