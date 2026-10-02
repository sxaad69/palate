import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTG, dayKey } from '../store/app';
import { t, type Lang } from '../lib/i18n';
import type { PromptTheme } from '../data/prompts';

function themeLabel(theme: PromptTheme, lang: Lang): string {
  const s = t();
  return {
    people: s.theme_people,
    senses: s.theme_senses,
    'small-wins': s.theme_smallwins,
    nature: s.theme_nature,
    challenges: s.theme_challenges,
    wonder: s.theme_wonder,
  }[theme];
}

// The home screen IS the ritual: 3 prompt cards, completable in 60 seconds.
// Past entries live in History — this screen is for today only.
export function TodayScreen() {
  const { colors, spacing, radii } = useTheme();
  const { todayPrompts, saveToday, entryFor, streak, lang } = useTG();
  const [drafts, setDrafts] = useState<string[]>(['', '', '']);
  const done = entryFor(dayKey(Date.now()));

  const setDraft = (i: number, v: string) =>
    setDrafts((prev) => prev.map((d, idx) => (idx === i ? v : d)));

  const ready = drafts.every((d) => d.trim().length > 0);

  const complete = () => {
    if (!ready) return;
    saveToday(drafts.map((d) => d.trim()));
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Screen>
      <View style={[styles.header, { marginTop: spacing.md, marginBottom: spacing.md }]}>
        <AppText variant="h1">{t().todayTitle}</AppText>
        <View style={[styles.streak, { backgroundColor: colors.accentMuted, borderRadius: radii.full }]}>
          <AppText variant="bodySmall" color={colors.accent} style={{ fontWeight: '600' }}>
            🔥 {streak} {t().streakDays}
          </AppText>
        </View>
      </View>

      {done ? (
        <Card style={{ padding: spacing.lg }}>
          <AppText variant="h2" style={{ textAlign: 'center' }}>
            ✓ {t().ritualDone}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {t().ritualDoneSub}
          </AppText>
          <View style={{ height: spacing.md }} />
          {done.items.map((item, i) => (
            <View
              key={i}
              style={[
                styles.doneItem,
                { backgroundColor: colors.surfaceAlt, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.sm },
              ]}
            >
              <AppText variant="caption" color={colors.textTertiary}>
                {(i + 1).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
              </AppText>
              <AppText variant="body" style={{ marginTop: 4 }}>
                {item}
              </AppText>
            </View>
          ))}
        </Card>
      ) : (
        <>
          {todayPrompts.map((prompt, i) => (
            <Card key={prompt.id} style={{ padding: spacing.md, marginBottom: spacing.md }}>
              <View style={[styles.themeChip, { backgroundColor: colors.accentMuted, borderRadius: radii.full }]}>
                <AppText variant="caption" color={colors.accent} style={{ fontWeight: '600' }}>
                  {themeLabel(prompt.theme, lang)}
                </AppText>
              </View>
              <AppText variant="h3" style={{ marginTop: spacing.sm, marginBottom: spacing.sm }}>
                {lang === 'ar' ? prompt.ar : prompt.en}
              </AppText>
              <TextInput
                value={drafts[i] ?? ''}
                onChangeText={(v) => setDraft(i, v)}
                placeholder={t().writePlaceholder}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                accessibilityLabel={lang === 'ar' ? prompt.ar : prompt.en}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                    borderRadius: radii.md,
                    color: colors.textPrimary,
                    padding: spacing.md,
                    minHeight: 88,
                  },
                ]}
              />
            </Card>
          ))}
          <View style={{ height: spacing.sm }} />
          <Button title={t().completeRitual} onPress={complete} size="lg" disabled={!ready} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streak: { paddingHorizontal: 12, paddingVertical: 6 },
  themeChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4 },
  input: { borderWidth: 1, fontSize: 16, lineHeight: 24 },
  doneItem: {},
});
