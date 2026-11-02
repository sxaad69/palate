import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Share } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useDreams, type Mood } from '../store/dreams';
import { SYMBOLS } from '../data/symbols';
import { getDreamReflection } from '../lib/interpretation';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const MOOD_EMOJI: Record<Mood, string> = { good: '😌', neutral: '😐', bad: '😟' };

// The reflection view: your words + confirmed symbols + the disclaimer.
export default function DreamDetailScreen({
  dreamId,
  onBack,
  onEdit,
  onSymbol,
}: {
  dreamId: string;
  onBack: () => void;
  onEdit: () => void;
  onSymbol: (symbolId: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { dreams, deleteDream, pro } = useDreams();
  const dream = dreams.find((d) => d.id === dreamId);
  const rtl = t.dir === 'rtl';

  if (!dream) {
    return (
      <Screen padded>
        <Button title={t.cancel} onPress={onBack} variant="ghost" />
      </Screen>
    );
  }

  const confirmDelete = () => {
    Alert.alert(t.deleteDream, t.deleteConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.deleteDream, style: 'destructive', onPress: () => { deleteDream(dream.id); onBack(); } },
    ]);
  };

  const reflection = getDreamReflection(dream.narrative, dream.symbolIds, rtl ? 'ar' : 'en');

  const handleShareCard = async () => {
    const symbolNames = dream.symbolIds
      .map((sid) => SYMBOLS.find((s) => s.id === sid))
      .filter((s): s is NonNullable<typeof s> => !!s)
      .map((s) => (rtl ? s.ar : s.en))
      .join(', ');

    const cardText = `🌙 Hulm Dream Card: "${dream.title || 'Dream Reflection'}"\n\n` +
      `✨ ${t.archetype}: ${reflection.archetype}\n` +
      `🔍 ${reflection.theme}\n\n` +
      `💭 ${t.reflectionQuestion}:\n"${reflection.reflectionQuestion}"\n\n` +
      (symbolNames ? `🏷️ ${t.confirmedSymbols}: ${symbolNames}\n\n` : '') +
      `— Journaled with Hulm (${t.disclaimerShort})`;

    try {
      await Share.share({ message: cardText });
    } catch {
      // dismissed
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.topRow}>
          <Pressable onPress={onBack}>
            <Text variant="body" style={{ color: colors.accent }}>‹ {t.journal}</Text>
          </Pressable>
          <Pressable onPress={onEdit}>
            <Text variant="body" style={{ color: colors.accent }}>{t.editDream}</Text>
          </Pressable>
        </View>

        <View style={styles.titleRow}>
          <Text variant="h1" style={styles.title}>{dream.title || t.logDream}</Text>
          <Text variant="h2">{MOOD_EMOJI[dream.mood]}</Text>
        </View>
        <Text variant="caption" style={{ color: colors.textTertiary }}>
          {new Date(dream.date).toLocaleDateString(rtl ? 'ar' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>

        <Card>
          <Text variant="body">{dream.narrative}</Text>
        </Card>

        {/* AI Archetypal Reflection Card */}
        <Card style={{ borderColor: colors.accent, borderWidth: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
            <Text variant="h3" style={{ color: colors.accent }}>✨ {t.aiReflection}</Text>
          </View>
          <Text variant="caption" style={{ color: colors.textTertiary, marginBottom: spacing.xs }}>
            {t.archetype}: {reflection.archetype}
          </Text>
          <Text variant="body" style={{ marginBottom: spacing.sm }}>
            {reflection.theme}
          </Text>
          <View style={{ backgroundColor: colors.highlight, padding: spacing.sm, borderRadius: 8, marginTop: spacing.xs }}>
            <Text variant="caption" style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 2 }}>
              💭 {t.reflectionQuestion}
            </Text>
            <Text variant="bodySmall">
              {reflection.reflectionQuestion}
            </Text>
          </View>
        </Card>

        <Button
          title={`🌙 ${t.shareCard}`}
          onPress={handleShareCard}
          variant="secondary"
        />

        <Text variant="h3">{t.reflect}</Text>
        {dream.symbolIds.length === 0 ? (
          <Text variant="body" style={{ color: colors.textTertiary }}>{t.noSymbols}</Text>
        ) : (
          dream.symbolIds.map((sid) => {
            const s = SYMBOLS.find((x) => x.id === sid);
            if (!s) return null;
            const locked = !s.free && !pro;
            return (
              <Pressable key={sid} onPress={() => onSymbol(sid)}>
                <Card style={styles.symRow}>
                  <View style={styles.symInfo}>
                    <Text variant="h3">{rtl ? s.ar : s.en}</Text>
                    <Text variant="caption" style={{ color: colors.textSecondary }} numberOfLines={1}>
                      {rtl ? s.themesAr : s.themes}
                    </Text>
                  </View>
                  {locked && (
                    <View style={[styles.lockChip, { backgroundColor: colors.highlight }]}>
                      <Text variant="caption">{t.plus}</Text>
                    </View>
                  )}
                </Card>
              </Pressable>
            );
          })
        )}

        <Card tone="action">
          <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>
            {t.disclaimerShort}
          </Text>
        </Card>

        <Button title={t.deleteDream} onPress={confirmDelete} variant="ghost" />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1 },
  symRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  symInfo: { flex: 1, gap: 2 },
  lockChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999 },
});
