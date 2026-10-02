import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { ExerciseRow } from '../components/ExerciseRow';
import { usePosture } from '../store/app';
import { EXERCISES } from '../data/exercises';
import { t } from '../lib/i18n';

export function ExercisesScreen() {
  const { colors, spacing } = useTheme();
  const { totalExercisesDone } = usePosture();
  const s = t();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <PostureText variant="h1">{s.exLibrary}</PostureText>
      <PostureText variant="bodySmall" color={colors.textSecondary}>
        {`${totalExercisesDone} ${s.exercisesDone}`}
      </PostureText>
      <View style={{ height: spacing.md }} />
      {EXERCISES.map((ex) => (
        <ExerciseRow
          key={ex.id}
          exercise={ex}
          expanded={expandedId === ex.id}
          onToggleExpand={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
        />
      ))}
    </Screen>
  );
}
