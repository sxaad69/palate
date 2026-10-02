import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScoreRing } from '../components/ScoreRing';
import { AngleCard } from '../components/AngleCard';
import { ExerciseRow } from '../components/ExerciseRow';
import { usePosture } from '../store/app';
import { prescribeFor } from '../data/exercises';
import { getLang, t } from '../lib/i18n';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ResultsScreen() {
  const { colors, spacing } = useTheme();
  const nav = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { checks, canCheck } = usePosture();
  const s = t();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const check = checks.find((c) => c.id === route.params.checkId);
  if (!check) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
          <Button title={s.doneBtn} onPress={() => nav.popToTop()} />
        </View>
      </Screen>
    );
  }

  const weakAngles = check.observations
    .filter((o) => o.severity !== 'good')
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'poor' ? -1 : 1))
    .map((o) => o.angle);
  const recommended = prescribeFor(weakAngles);
  const date = new Date(check.at).toLocaleDateString(getLang() === 'ar' ? 'ar' : 'en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <PostureText variant="h1" style={{ textAlign: 'center' }}>
        {s.resultsTitle}
      </PostureText>
      <PostureText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        {date}
      </PostureText>
      <View style={{ height: spacing.md }} />

      <View style={{ alignItems: 'center' }}>
        <ScoreRing score={check.score} size={140} />
      </View>
      <View style={{ height: spacing.md }} />
      <Image
        source={{ uri: check.photoUri }}
        style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: colors.surfaceAlt }}
        resizeMode="contain"
      />
      <View style={{ height: spacing.lg }} />

      <PostureText variant="h2" style={{ marginBottom: spacing.sm }}>
        {s.observations}
      </PostureText>
      {check.observations.map((o) => (
        <AngleCard key={o.angle} observation={o} />
      ))}

      {recommended.length > 0 && (
        <>
          <PostureText variant="h2" style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
            {s.recommended}
          </PostureText>
          {recommended.map((ex) => (
            <ExerciseRow
              key={ex.id}
              exercise={ex}
              expanded={expandedId === ex.id}
              onToggleExpand={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
            />
          ))}
        </>
      )}

      <Card style={{ marginTop: spacing.lg }}>
        <PostureText variant="h3">{s.formulaTitle}</PostureText>
        <View style={{ height: spacing.sm }} />
        <PostureText variant="bodySmall" color={colors.textSecondary}>
          {s.formulaBody}
        </PostureText>
      </Card>

      <View style={{ height: spacing.lg }} />
      <Button
        title={s.newCheckAgain}
        size="lg"
        onPress={() => (canCheck ? nav.replace('Capture') : nav.replace('Paywall'))}
      />
      <View style={{ height: spacing.sm }} />
      <Button title={s.doneBtn} variant="ghost" onPress={() => nav.popToTop()} />
    </Screen>
  );
}

