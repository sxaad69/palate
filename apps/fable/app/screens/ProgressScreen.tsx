import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { FableText } from '../components/FableText';
import { useFable } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { getSession } from '../data/sessions';

// Progress: streak, minutes, sessions this week, recent history.
// Local-first; the Supabase migration reserves the cloud schema.
export function ProgressScreen() {
  const { colors, spacing, radii } = useTheme();
  const { streak, totalMinutes, sessionsThisWeek, logs } = useFable();
  const lang = getLang();

  const recent = [...logs].reverse().slice(0, 10);

  const stats: Array<{ value: string; label: string }> = [
    { value: String(streak), label: `${streak === 1 ? (lang === 'ar' ? 'يوم' : 'day') : t().dayStreak}` },
    { value: String(totalMinutes), label: t().minutes },
    { value: String(sessionsThisWeek), label: lang === 'ar' ? 'جلسات هذا الأسبوع' : 'sessions this week' },
  ];

  return (
    <Screen>
      <FableText variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        {t().progress}
      </FableText>

      <View style={styles.row}>
        {stats.map((s) => (
          <View
            key={s.label}
            style={[
              styles.stat,
              { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md },
            ]}
          >
            <FableText variant="display" color={colors.accent}>
              {s.value}
            </FableText>
            <FableText variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              {s.label}
            </FableText>
          </View>
        ))}
      </View>

      <FableText variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
        {lang === 'ar' ? 'الجلسات الأخيرة' : 'Recent sessions'}
      </FableText>

      {recent.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg }]}>
          <FableText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            {lang === 'ar'
              ? 'لا جلسات بعد. ابدأ أول فصل من المكتبة.'
              : 'No sessions yet. Start your first chapter from the library.'}
          </FableText>
        </View>
      ) : (
        recent.map((l, i) => {
          const s = getSession(l.sessionId);
          const d = new Date(l.at);
          return (
            <View
              key={`${l.at}-${i}`}
              style={[
                styles.rowItem,
                { borderBottomColor: colors.border, paddingVertical: spacing.md },
              ]}
            >
              <FableText variant="body">
                {s ? (lang === 'ar' ? s.titleAr : s.titleEn) : l.sessionId}
              </FableText>
              <FableText variant="bodySmall" color={colors.textSecondary}>
                {l.minutes} {t().minutes} · {d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US')}
              </FableText>
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, borderWidth: 1, alignItems: 'center', gap: 4 },
  empty: { alignItems: 'center' },
  rowItem: { borderBottomWidth: 1, gap: 2 },
});
