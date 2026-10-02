import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useStudy, type Grade } from '../store/study';
import { ALL_CARDS } from '../data/decks';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const GRADES: { g: Grade; label: (t: any) => string; color: string }[] = [
  { g: 1, label: (t) => t.again, color: '#DC2626' },
  { g: 2, label: (t) => t.hard, color: '#D97706' },
  { g: 3, label: (t) => t.good, color: '#15803D' },
  { g: 4, label: (t) => t.easy, color: '#1D4ED8' },
];

// One card at a time: flip, then grade honestly. SM-2 does the rest.
export default function StudyScreen({
  cardIds,
  onDone,
}: {
  cardIds: string[];
  onDone: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { gradeCard } = useStudy();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = ALL_CARDS.find((c) => c.id === cardIds[index]);
  const close = () => onDone();

  if (done || !card) {
    return (
      <Screen padded>
        <View style={styles.center}>
          <Text variant="display">🎓</Text>
          <Text variant="h1" align="center">{t.sessionDone}</Text>
          <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
            {cardIds.length} {t.reviewed}
          </Text>
          <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
            {t.keepItUp}
          </Text>
        </View>
        <View style={styles.footer}>
          <Button title={t.backHome} onPress={onDone} variant="primary" />
        </View>
      </Screen>
    );
  }

  const grade = (g: Grade) => {
    gradeCard(card.id, g);
    setFlipped(false);
    if (index + 1 >= cardIds.length) setDone(true);
    else setIndex(index + 1);
  };

  return (
    <Screen padded>
      <View style={styles.progress}>
        <View style={styles.progressTop}>
          <Text variant="caption" style={{ color: colors.textTertiary }}>
            {index + 1} {t.of} {cardIds.length}
          </Text>
          <Pressable onPress={close} hitSlop={12}>
            <Text variant="h3" style={{ color: colors.textTertiary }}>✕</Text>
          </Pressable>
        </View>
        <View style={[styles.bar, { backgroundColor: colors.surfaceAlt }]}>
          <View
            style={[styles.barFill, { width: `${((index + 1) / cardIds.length) * 100}%`, backgroundColor: colors.accent }]}
          />
        </View>
      </View>

      <Pressable
        onPress={() => setFlipped(!flipped)}
        style={[styles.cardWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {card.tag && (
          <View style={[styles.tag, { backgroundColor: colors.highlightMuted }]}>
            <Text variant="caption" style={{ color: colors.textPrimary }}>
              {card.tag === 'high-yield' ? '★ high-yield' : card.tag === 'priority' ? '⚡ priority' : '🧪 labs'}
            </Text>
          </View>
        )}
        <Text variant="h2" align="center">
          {flipped ? card.back : card.front}
        </Text>
        {!flipped && (
          <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>
            {t.tapToFlip}
          </Text>
        )}
      </Pressable>

      {flipped ? (
        <View style={styles.grades}>
          {GRADES.map(({ g, label, color }) => (
            <Pressable
              key={g}
              onPress={() => grade(g)}
              style={[styles.gradeBtn, { backgroundColor: colors.surface, borderColor: color }]}
            >
              <Text variant="body" align="center" style={{ color }}>
                {label(t)}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.footer}>
          <Button title={t.tapToFlip} onPress={() => setFlipped(true)} variant="secondary" />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg },
  footer: { paddingBottom: spacing.lg },
  progress: { gap: spacing.xs, marginBottom: spacing.sm },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: { height: 6, borderRadius: radii.full, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: radii.full },
  cardWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  grades: { flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.lg },
  gradeBtn: { flex: 1, borderWidth: 2, borderRadius: radii.md, paddingVertical: spacing.md, minHeight: 56, justifyContent: 'center' },
});
