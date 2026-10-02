import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useStudy } from '../store/study';
import { DECKS } from '../data/decks';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

// Deck browser + custom deck editor. Locked decks route to the paywall.
export default function DecksScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { pro, customDecks, addDeck, addCard, deleteDeck } = useStudy();
  const [openDeck, setOpenDeck] = useState<string | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [addingCard, setAddingCard] = useState(false);

  const openCustom = customDecks.find((d) => d.id === openDeck);

  const createDeck = () => {
    if (!pro) {
      Alert.alert(t.lockedTitle, t.f3, [
        { text: t.later, style: 'cancel' },
        { text: t.upgrade, onPress: onPaywall },
      ]);
      return;
    }
    if (!newDeckName.trim()) {
      Alert.alert(t.newDeck, t.needName);
      return;
    }
    const deck = addDeck(newDeckName.trim());
    setNewDeckName('');
    setOpenDeck(deck.id);
  };

  const saveCard = () => {
    if (!openDeck) return;
    if (!front.trim() || !back.trim()) {
      Alert.alert(t.addCard, t.needBoth);
      return;
    }
    addCard(openDeck, front.trim(), back.trim());
    setFront('');
    setBack('');
    setAddingCard(false);
  };

  if (openCustom) {
    return (
      <Screen padded={false}>
        <ScrollView contentContainerStyle={styles.body}>
          <Pressable onPress={() => setOpenDeck(null)}>
            <Text variant="body" style={{ color: colors.accent }}>← {t.decks}</Text>
          </Pressable>
          <Text variant="h1">{openCustom.titleEn}</Text>
          {openCustom.cards.length === 0 && !addingCard && (
            <Text variant="body" style={{ color: colors.textTertiary }}>{t.customEmpty}</Text>
          )}
          {openCustom.cards.map((c) => (
            <Card key={c.id}>
              <Text variant="h3">{c.front}</Text>
              <Text variant="body" style={{ color: colors.textSecondary }}>{c.back}</Text>
            </Card>
          ))}
          {addingCard ? (
            <Card style={styles.form}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder={t.frontSide}
                placeholderTextColor={colors.textTertiary}
                value={front}
                onChangeText={setFront}
              />
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder={t.backSide}
                placeholderTextColor={colors.textTertiary}
                value={back}
                onChangeText={setBack}
                multiline
              />
              <Button title={t.save} onPress={saveCard} variant="primary" />
            </Card>
          ) : (
            <Button title={t.addCard} onPress={() => setAddingCard(true)} variant="secondary" />
          )}
          <Button
            title={t.deleteDeck}
            onPress={() =>
              Alert.alert(t.deleteDeck, t.deleteDeckConfirm, [
                { text: t.cancel, style: 'cancel' },
                { text: t.deleteDeck, style: 'destructive', onPress: () => { deleteDeck(openCustom.id); setOpenDeck(null); } },
              ])
            }
            variant="ghost"
          />
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="h1">{t.decks}</Text>
        {DECKS.map((deck) => {
          const locked = !deck.free && !pro;
          return (
            <Pressable
              key={deck.id}
              onPress={() => locked && onPaywall()}
            >
              <Card style={styles.deckRow}>
                <View style={styles.deckInfo}>
                  <Text variant="h3">{t.dir === 'rtl' ? deck.titleAr : deck.titleEn}</Text>
                  <Text variant="caption" style={{ color: colors.textTertiary }}>
                    {deck.cards.length} {t.cards}
                  </Text>
                </View>
                {locked && (
                  <View style={[styles.lockChip, { backgroundColor: colors.highlight }]}>
                    <Text variant="caption" style={{ color: colors.textPrimary }}>{t.plus}</Text>
                  </View>
                )}
              </Card>
            </Pressable>
          );
        })}
        {customDecks.map((deck) => (
          <Pressable key={deck.id} onPress={() => setOpenDeck(deck.id)}>
            <Card style={styles.deckRow}>
              <View style={styles.deckInfo}>
                <Text variant="h3">{deck.titleEn}</Text>
                <Text variant="caption" style={{ color: colors.textTertiary }}>
                  {deck.cards.length} {t.cards}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
        <Card style={styles.form}>
          <Text variant="h3">{t.newDeck}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder={t.deckName}
            placeholderTextColor={colors.textTertiary}
            value={newDeckName}
            onChangeText={setNewDeckName}
          />
          <Button title={t.newDeck} onPress={createDeck} variant="secondary" />
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  deckRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deckInfo: { gap: 2, flex: 1 },
  lockChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  form: { gap: spacing.sm, marginTop: spacing.sm },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, ...typography.body },
});
