import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { FableText } from '../components/FableText';
import { useFable } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { ARCS, sessionsForArc, type Session } from '../data/sessions';

const MOOD_LABEL: Record<string, { en: string; ar: string }> = {
  calm: { en: 'Calm', ar: 'هدوء' },
  energy: { en: 'Energy', ar: 'طاقة' },
  sleep: { en: 'Sleep', ar: 'نوم' },
  balance: { en: 'Balance', ar: 'توازن' },
};

export function LibraryScreen({ onOpenSession }: { onOpenSession: (s: Session) => void }) {
  const { colors, spacing, radii } = useTheme();
  const { isPro, favorites, toggleFavorite } = useFable();
  const lang = getLang();

  return (
    <Screen>
      <FableText variant="h1" style={{ marginTop: spacing.md, marginBottom: 4 }}>
        {t().library}
      </FableText>
      <FableText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.lg }}>
        {t().tagline}
      </FableText>

      {ARCS.map((arc) => (
        <View key={arc.id} style={{ marginBottom: spacing.xl }}>
          <View style={styles.arcHeader}>
            <FableText variant="h2">{lang === 'ar' ? arc.titleAr : arc.titleEn}</FableText>
            <View style={[styles.moodChip, { backgroundColor: colors.surfaceAlt }]}>
              <FableText variant="caption" color={colors.accent}>
                {MOOD_LABEL[arc.mood]![lang]}
              </FableText>
            </View>
          </View>
          <FableText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
            {lang === 'ar' ? arc.descAr : arc.descEn}
          </FableText>

          {sessionsForArc(arc.id).map((s) => {
            const locked = !s.free && !isPro;
            const fav = favorites.includes(s.id);
            return (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={`${lang === 'ar' ? s.titleAr : s.titleEn}`}
                onPress={() => onOpenSession(s)}
                android_ripple={{ color: colors.overlay }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radii.lg,
                    padding: spacing.md,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={styles.cardTop}>
                  <FableText variant="caption" color={colors.textTertiary}>
                    {lang === 'ar' ? `الفصل ${s.chapter}` : `Chapter ${s.chapter}`} · {s.minutes}{' '}
                    {t().minutes}
                  </FableText>
                  <Pressable
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="favorite"
                    onPress={() => toggleFavorite(s.id)}
                  >
                    <FableText variant="h3" color={fav ? colors.breathGlow : colors.textTertiary}>
                      {fav ? '★' : '☆'}
                    </FableText>
                  </Pressable>
                </View>
                <FableText variant="h3" style={{ marginVertical: 4 }}>
                  {lang === 'ar' ? s.titleAr : s.titleEn}
                </FableText>
                <FableText variant="bodySmall" color={colors.textSecondary} numberOfLines={2}>
                  {lang === 'ar' ? s.descAr : s.descEn}
                </FableText>
                {locked && (
                  <View style={[styles.lockChip, { backgroundColor: colors.accentMuted }]}>
                    <FableText variant="caption" color={colors.textInverse}>
                      {t().locked}
                    </FableText>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  arcHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  moodChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  card: { borderWidth: 1, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lockChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
