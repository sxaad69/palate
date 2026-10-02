import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { RestoryText } from '../components/RestoryText';
import { Card } from '../components/Card';
import { TimeStepper } from '../components/TimeStepper';
import { useRestory } from '../store/app';
import { isRTL, t } from '../lib/i18n';

// The <30-second check-in: one screen, sleep-first.
// Card 1 pairs last night's sleep (quality + times); card 2 is today's mood.
// Everything auto-saves on tap — there is no save button to forget.

const FACES = ['😞', '😕', '🙂', '😄', '🤩'];

function greetingKey(hour: number): 'goodMorning' | 'goodAfternoon' | 'goodEvening' | 'goodNight' {
  if (hour < 12) return 'goodMorning';
  if (hour < 17) return 'goodAfternoon';
  if (hour < 21) return 'goodEvening';
  return 'goodNight';
}

export function TodayScreen() {
  const { colors, spacing } = useTheme();
  const { today, updateToday, lang } = useRestory();
  const s = t();

  const moodLabels = [s.mood1, s.mood2, s.mood3, s.mood4, s.mood5];
  const sleepLabels = [s.sleep1, s.sleep2, s.sleep3, s.sleep4, s.sleep5];
  const now = new Date();
  const dateLine = now.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const hasLog = today.mood !== null || today.sleepQuality !== null;

  const tap = (fn: () => void) => () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <Screen>
      <View style={[styles.header, { marginTop: spacing.md, marginBottom: spacing.md }]}>
        <View>
          <RestoryText variant="h1">{s[greetingKey(now.getHours())]}</RestoryText>
          <RestoryText variant="bodySmall" color={colors.textSecondary}>
            {dateLine}
          </RestoryText>
        </View>
        {hasLog ? (
          <RestoryText variant="caption" color={colors.success}>
            ✓ {s.saved}
          </RestoryText>
        ) : null}
      </View>

      {/* Sleep-first: last night's card comes first. */}
      <Card heading={s.lastNight} style={{ marginBottom: spacing.md }}>
        <RestoryText variant="h2" style={{ marginBottom: spacing.sm }}>
          {s.howDidYouSleep}
        </RestoryText>
        <RestoryText variant="caption" color={colors.textTertiary} style={{ marginBottom: spacing.md }}>
          {s.sleepFirstHint}
        </RestoryText>
        <View style={[styles.stars, { flexDirection: isRTL() ? 'row-reverse' : 'row', marginBottom: spacing.sm }]}>
          {[1, 2, 3, 4, 5].map((v) => (
            <Pressable
              key={v}
              accessibilityRole="button"
              accessibilityLabel={`${s.sleepQuality} ${v}`}
              accessibilityState={{ selected: today.sleepQuality === v }}
              onPress={tap(() => updateToday({ sleepQuality: v }))}
              hitSlop={6}
              style={styles.starHit}
            >
              <RestoryText
                variant="display"
                color={v <= (today.sleepQuality ?? 0) ? colors.accent : colors.borderStrong}
              >
                ★
              </RestoryText>
            </Pressable>
          ))}
        </View>
        {today.sleepQuality !== null ? (
          <RestoryText variant="bodySmall" color={colors.accent} style={{ marginBottom: spacing.md }}>
            {today.sleepQuality} ★ · {sleepLabels[today.sleepQuality - 1]}
          </RestoryText>
        ) : (
          <View style={{ height: spacing.md }} />
        )}
        <TimeStepper
          label={s.bedtime}
          value={today.bedTime ?? '22:30'}
          onChange={(v) => updateToday({ bedTime: v })}
        />
        <View style={{ height: spacing.md }} />
        <TimeStepper
          label={s.wakeTime}
          value={today.wakeTime ?? '06:30'}
          onChange={(v) => updateToday({ wakeTime: v })}
        />
      </Card>

      <Card heading={s.todaysMood}>
        <RestoryText variant="h2" style={{ marginBottom: spacing.md }}>
          {s.howAreYouFeeling}
        </RestoryText>
        <View style={[styles.faces, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}>
          {FACES.map((face, i) => {
            const v = i + 1;
            const selected = today.mood === v;
            return (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityLabel={`${s.todaysMood}: ${moodLabels[i]}`}
                accessibilityState={{ selected }}
                onPress={tap(() => updateToday({ mood: v }))}
                hitSlop={4}
                style={[
                  styles.face,
                  {
                    backgroundColor: selected ? colors.accentMuted : 'transparent',
                    borderColor: selected ? colors.accent : 'transparent',
                  },
                ]}
              >
                <RestoryText variant="h1">{face}</RestoryText>
                <RestoryText variant="caption" color={selected ? colors.textPrimary : colors.textTertiary} style={styles.faceLabel}>
                  {moodLabels[i]}
                </RestoryText>
              </Pressable>
            );
          })}
        </View>
        <RestoryText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {s.note}
        </RestoryText>
        <TextInput
          value={today.note ?? ''}
          onChangeText={(text) => updateToday({ note: text.trim() === '' ? null : text })}
          placeholder={s.notePlaceholder}
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={2}
          maxLength={140}
          textAlign={isRTL() ? 'right' : 'left'}
          style={[
            styles.note,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
              borderRadius: 12,
              color: colors.textPrimary,
              padding: spacing.sm,
            },
          ]}
        />
      </Card>
      <View style={{ height: spacing.md }} />
      <RestoryText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        {lang === 'ar'
          ? 'نومك ومزاجك يبقيان على هذا الجهاز فقط.'
          : 'Your sleep and mood stay on this device only.'}
      </RestoryText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  stars: { justifyContent: 'space-between', paddingHorizontal: 4 },
  starHit: { padding: 4, minWidth: 48, alignItems: 'center' },
  faces: { justifyContent: 'space-between' },
  face: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1.5,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  faceLabel: { marginTop: 4, textAlign: 'center' },
  note: { minHeight: 64, textAlignVertical: 'top', fontSize: 16, lineHeight: 24 },
});
