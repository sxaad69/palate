import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useFocus, PRESETS } from '../store/focus';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

// Session setup: duration, label, DND nudge, today's numbers.
export default function HomeScreen({
  onStart,
  onPaywall,
}: {
  onStart: (durationSec: number, label: string) => void;
  onPaywall: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { sessions, pro, defaultDuration, setDefaultDuration, streak } = useFocus();
  const [minutes, setMinutes] = useState(defaultDuration);
  const [customMode, setCustomMode] = useState(false);
  const [label, setLabel] = useState('');

  const tk = todayKey();
  const todaySessions = sessions.filter(
    (s) => new Date(s.startedAt).toISOString().slice(0, 10) === tk && s.completed,
  );
  const todaySec = todaySessions.reduce((a, s) => a + s.focusedSec, 0);

  const pickPreset = (m: number) => {
    setCustomMode(false);
    setMinutes(m);
    setDefaultDuration(m);
  };

  const enterCustom = () => {
    if (!pro) {
      Alert.alert(t.custom, t.customLocked, [
        { text: t.later, style: 'cancel' },
        { text: t.upgrade, onPress: onPaywall },
      ]);
      return;
    }
    setCustomMode(true);
  };

  const bump = (d: number) => setMinutes((m) => Math.min(180, Math.max(5, m + d)));

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

        <Text variant="h3" style={{ color: colors.textSecondary }}>{t.whatWorkingOn}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          placeholder={t.labelPlaceholder}
          placeholderTextColor={colors.textTertiary}
          value={label}
          onChangeText={setLabel}
          maxLength={60}
        />

        <View style={styles.presets}>
          {PRESETS.map((m) => (
            <Pressable
              key={m}
              onPress={() => pickPreset(m)}
              style={[
                styles.preset,
                {
                  backgroundColor: !customMode && minutes === m ? colors.accent : colors.surface,
                  borderColor: !customMode && minutes === m ? colors.accent : colors.border,
                },
              ]}
            >
              <Text variant="h2" align="center" style={{ color: !customMode && minutes === m ? colors.textInverse : colors.textPrimary }}>
                {m}
              </Text>
              <Text variant="caption" align="center" style={{ color: !customMode && minutes === m ? colors.textInverse : colors.textTertiary }}>
                {t.min}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={enterCustom}
            style={[
              styles.preset,
              {
                backgroundColor: customMode ? colors.accent : colors.surface,
                borderColor: customMode ? colors.accent : colors.border,
              },
            ]}
          >
            <Text variant="h3" align="center" style={{ color: customMode ? colors.textInverse : colors.textPrimary }}>
              {customMode ? `${minutes}'` : t.custom}
            </Text>
            {!pro && !customMode && (
              <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>Plus</Text>
            )}
          </Pressable>
        </View>

        {customMode && (
          <View style={styles.stepper}>
            <Pressable onPress={() => bump(-5)} style={[styles.stepBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Text variant="h2">−</Text>
            </Pressable>
            <Text variant="display">{minutes}'</Text>
            <Pressable onPress={() => bump(5)} style={[styles.stepBtn, { backgroundColor: colors.surfaceAlt }]}>
              <Text variant="h2">+</Text>
            </Pressable>
          </View>
        )}

        <Card style={styles.dnd}>
          <Text variant="h3">{t.dndTitle}</Text>
          <Text variant="body" style={{ color: colors.textSecondary }}>{t.dndBody}</Text>
        </Card>

        <Button title={t.startSession} onPress={() => onStart(minutes * 60, label.trim())} variant="primary" />

        <View style={styles.todayRow}>
          <Card style={styles.todayCard}>
            <Text variant="h2" align="center">{todaySessions.length}</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.sessions}</Text>
          </Card>
          <Card style={styles.todayCard}>
            <Text variant="h2" align="center">{Math.round(todaySec / 60)}'</Text>
            <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>{t.deepTime}</Text>
          </Card>
        </View>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, ...typography.body },
  presets: { flexDirection: 'row', gap: spacing.sm },
  preset: { flex: 1, borderWidth: 2, borderRadius: radii.lg, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', minHeight: 84 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  stepBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  dnd: { gap: spacing.xs },
  todayRow: { flexDirection: 'row', gap: spacing.sm },
  todayCard: { flex: 1, alignItems: 'center', gap: spacing.xs },
});
