import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useStudy, FREE_DAILY_CAP, isMastered } from '../store/study';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export default function HomeScreen({
  onStartSession,
  onPaywall,
}: {
  onStartSession: () => void;
  onPaywall: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { dueCards, streak, reviewsToday, pro, allDecks, progress } = useStudy();

  const remaining = pro ? Infinity : Math.max(0, FREE_DAILY_CAP - reviewsToday);

  const handleStart = () => {
    if (dueCards.length === 0) return;
    if (!pro && remaining <= 0) {
      Alert.alert(t.capTitle, t.capBody, [
        { text: t.later, style: 'cancel' },
        { text: t.upgrade, onPress: onPaywall },
      ]);
      return;
    }
    onStartSession();
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text variant="h1">{t.today}</Text>
          {streak > 0 && (
            <View style={[styles.streakChip, { backgroundColor: colors.highlightMuted }]}>
              <Text variant="body">🔥 {streak}</Text>
            </View>
          )}
        </View>

        <Card tone="action" style={styles.hero}>
          <Text variant="display" align="center">{dueCards.length}</Text>
          <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
            {t.dueCards}
          </Text>
          <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>
            {t.reviewsToday}: {reviewsToday}{!pro && ` / ${FREE_DAILY_CAP}`}
          </Text>
        </Card>

        {dueCards.length > 0 ? (
          <Button
            title={t.startSession}
            onPress={handleStart}
            variant="primary"
          />
        ) : (
          <Card>
            <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
              {t.allCaughtUp}
            </Text>
          </Card>
        )}
        {!pro && (
          <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>
            {t.freeCapNote}
          </Text>
        )}

        <Text variant="h3" style={styles.deckHeader}>{t.decks}</Text>
        {allDecks.map((deck) => {
          const mastered = deck.cards.filter((c) => isMastered(progress[c.id])).length;
          const due = deck.cards.filter((c) => {
            const s = progress[c.id];
            return !s || s.nextDue <= Date.now();
          }).length;
          return (
            <Card key={deck.id} style={styles.deckRow}>
              <View style={styles.deckInfo}>
                <Text variant="h3">{t.dir === 'rtl' ? deck.titleAr : deck.titleEn}</Text>
                <Text variant="caption" style={{ color: colors.textTertiary }}>
                  {deck.cards.length} {t.cards} · {mastered} {t.mastered}
                </Text>
              </View>
              {due > 0 && (
                <View style={[styles.dueChip, { backgroundColor: colors.accent }]}>
                  <Text variant="caption" color="textInverse">{due}</Text>
                </View>
              )}
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  hero: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
  deckHeader: { marginTop: spacing.sm },
  deckRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deckInfo: { gap: 2, flex: 1 },
  dueChip: { minWidth: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
});
