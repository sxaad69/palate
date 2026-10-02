import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScoreRing } from '../components/ScoreRing';
import { AngleCard } from '../components/AngleCard';
import { usePosture, type CheckRecord } from '../store/app';
import { getLang, t } from '../lib/i18n';

function fmtDate(at: number): string {
  return new Date(at).toLocaleDateString(getLang() === 'ar' ? 'ar' : 'en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function scoreColor(score: number, colors: ReturnType<typeof useTheme>['colors']): string {
  return score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.danger;
}

export function HistoryScreen() {
  const { colors, spacing, radii } = useTheme();
  const { checks, deleteCheck } = usePosture();
  const s = t();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = checks.find((c) => c.id === selectedId) ?? null;
  // checks are newest-first; the "previous" check is the next one in the list.
  const previous: CheckRecord | null = selected
    ? (checks[checks.indexOf(selected) + 1] ?? null)
    : null;

  const confirmDelete = (c: CheckRecord) => {
    Alert.alert(s.deleteCheck, s.deleteCheckBody, [
      { text: s.cancel, style: 'cancel' },
      {
        text: s.delete,
        style: 'destructive',
        onPress: () => {
          deleteCheck(c.id);
          setSelectedId(null);
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <PostureText variant="h1">{s.history}</PostureText>
      <View style={{ height: spacing.md }} />

      {checks.length === 0 ? (
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <PostureText variant="h3">{s.histEmpty}</PostureText>
          <PostureText variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {s.histEmptyBody}
          </PostureText>
        </Card>
      ) : (
        checks.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            onPress={() => setSelectedId(c.id)}
            android_ripple={{ color: colors.overlay }}
            style={{ marginBottom: spacing.sm }}
          >
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: c.photoUri }}
                  style={{ width: 56, height: 56, borderRadius: radii.md, backgroundColor: colors.surfaceAlt }}
                />
                <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                  <PostureText variant="body">{fmtDate(c.at)}</PostureText>
                  <PostureText variant="caption" color={colors.textSecondary}>
                    {c.observations.filter((o) => o.severity !== 'good').length === 0
                      ? s.sevGood
                      : `${c.observations.filter((o) => o.severity === 'poor').length} ${s.sevPoor}`}
                  </PostureText>
                </View>
                <PostureText variant="h2" color={scoreColor(c.score, colors)}>
                  {c.score}
                </PostureText>
              </View>
            </Card>
          </Pressable>
        ))
      )}

      <Modal
        visible={selected !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedId(null)}
      >
        {selected && (
          <Screen>
            <View style={{ height: spacing.md }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button title={`‹ ${s.back}`} variant="ghost" size="sm" onPress={() => setSelectedId(null)} />
              <PostureText variant="h3">{fmtDate(selected.at)}</PostureText>
              <Button title={s.delete} variant="ghost" size="sm" onPress={() => confirmDelete(selected)} />
            </View>
            <View style={{ height: spacing.md }} />
            <View style={{ alignItems: 'center' }}>
              <ScoreRing score={selected.score} size={120} />
            </View>
            <View style={{ height: spacing.md }} />
            <Image
              source={{ uri: selected.photoUri }}
              style={{ width: '100%', height: 260, borderRadius: 12, backgroundColor: colors.surfaceAlt }}
              resizeMode="contain"
            />

            {previous ? (
              <Card style={{ marginTop: spacing.md }}>
                <PostureText variant="overline" color={colors.textTertiary}>
                  {s.comparePrev}
                </PostureText>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
                  <Image
                    source={{ uri: previous.photoUri }}
                    style={{ width: 72, height: 72, borderRadius: radii.md, backgroundColor: colors.surfaceAlt }}
                  />
                  <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                    <PostureText variant="bodySmall" color={colors.textSecondary}>
                      {fmtDate(previous.at)}
                    </PostureText>
                    <PostureText variant="h3" color={scoreColor(previous.score, colors)}>
                      {previous.score}
                    </PostureText>
                  </View>
                  <PostureText
                    variant="h2"
                    color={
                      selected.score >= previous.score ? colors.success : colors.danger
                    }
                  >
                    {selected.score >= previous.score ? '+' : ''}
                    {selected.score - previous.score}
                  </PostureText>
                </View>
              </Card>
            ) : (
              <PostureText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center', marginTop: spacing.md }}>
                {s.noPrev}
              </PostureText>
            )}

            <View style={{ height: spacing.md }} />
            {selected.observations.map((o) => (
              <AngleCard key={o.angle} observation={o} />
            ))}
          </Screen>
        )}
      </Modal>
    </Screen>
  );
}
