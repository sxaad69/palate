import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PostureText } from './PostureText';
import { Card } from './Card';
import { usePosture } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { angleLabel } from '../lib/format';
import type { Exercise } from '../data/exercises';

// Exercise row: expandable in the library, compact with done-toggle elsewhere.
export function ExerciseRow({ exercise, expanded, onToggleExpand }: {
  exercise: Exercise;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { exercisesDoneToday, toggleExerciseDoneToday } = usePosture();
  const s = t();
  const lang = getLang();
  const done = exercisesDoneToday(exercise.id);

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggleExpand}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <View style={{ flex: 1 }}>
          <PostureText variant="h3">{exercise.name[lang]}</PostureText>
          <PostureText variant="caption" color={colors.textSecondary}>
            {`${exercise.minutes} ${s.exMin} · ${s.exTargets}: ${exercise.targets.map(angleLabel).join(lang === 'ar' ? '، ' : ', ')}`}
          </PostureText>
        </View>
        <PostureText variant="body" color={done ? colors.success : colors.textTertiary}>
          {done ? '✓' : '›'}
        </PostureText>
      </Pressable>
      {expanded && (
        <View style={{ marginTop: spacing.sm }}>
          <PostureText variant="body" color={colors.textSecondary}>
            {exercise.instructions[lang]}
          </PostureText>
          <View style={{ height: spacing.sm }} />
          <Pressable
            accessibilityRole="button"
            onPress={() => toggleExerciseDoneToday(exercise.id)}
            android_ripple={{ color: colors.overlay }}
            style={{
              backgroundColor: done ? colors.success : colors.accent,
              borderRadius: 999,
              paddingVertical: spacing.sm,
              alignItems: 'center',
            }}
          >
            <PostureText variant="bodySmall" color={done ? '#FFFFFF' : colors.textInverse}>
              {done ? `✓ ${s.exDone}` : s.exMarkDone}
            </PostureText>
          </Pressable>
        </View>
      )}
    </Card>
  );
}
