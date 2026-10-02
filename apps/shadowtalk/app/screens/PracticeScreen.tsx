import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  RecordingPresets,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { playModel, stopModel } from '../lib/model';
import { ensureAudioMode, getMicStatus, persistAttempt, requestMic } from '../lib/audio';
import { useShadow } from '../store/app';
import { phrasesForPack, type Phrase, type PackId } from '../data/phrases';
import { Screen } from '../components/Screen';
import { EchoText } from '../components/EchoText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type Phase = 'listen' | 'recording' | 'compare';

function PhraseCard({ phrase }: { phrase: Phrase }) {
  const { colors, spacing } = useTheme();
  const rtl = phrase.lang === 'ar-SA';
  return (
    <Card>
      <EchoText
        variant="phrase"
        style={{ writingDirection: rtl ? 'rtl' : 'ltr', textAlign: rtl ? 'right' : 'left' }}
      >
        {phrase.text}
      </EchoText>
      <EchoText
        variant="body"
        color={colors.textSecondary}
        style={{
          marginTop: spacing.sm,
          writingDirection: rtl ? 'ltr' : 'rtl',
          textAlign: rtl ? 'left' : 'right',
        }}
      >
        {phrase.translation}
      </EchoText>
      <EchoText
        variant="phonetic"
        color={colors.textTertiary}
        style={{ marginTop: spacing.sm, textAlign: 'left' }}
      >
        {phrase.phonetic}
      </EchoText>
    </Card>
  );
}

/** Practice body is keyed by phrase.id so recorder/phase state resets per phrase. */
function PracticeBody({
  phrase,
  index,
  total,
  onNext,
  onPaywall,
}: {
  phrase: Phrase;
  index: number;
  total: number;
  onNext: () => void;
  onPaywall: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { consumeAttempt, scorePhrase } = useShadow();
  const s = t();
  const [phase, setPhase] = useState<Phase>('listen');
  const [mineUri, setMineUri] = useState<string | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder, 250);
  const minePlayer = useAudioPlayer(mineUri ?? undefined);
  const mineStatus = useAudioPlayerStatus(minePlayer);

  useEffect(() => {
    void ensureAudioMode();
    return () => {
      void stopModel();
    };
  }, []);

  const elapsedSec = Math.floor((recState?.durationMillis ?? 0) / 1000);

  async function startRecording() {
    if (busy) return;
    setBusy(true);
    try {
      const status = await getMicStatus();
      if (status !== 'granted' && !(await requestMic())) return; // rationale was in onboarding
      if (!consumeAttempt()) {
        onPaywall();
        return;
      }
      await ensureAudioMode();
      setPhase('recording');
      recorder.record();
    } finally {
      setBusy(false);
    }
  }

  async function stopRecording() {
    if (busy) return;
    setBusy(true);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) setMineUri(await persistAttempt(uri, phrase.id));
      setPhase('compare');
    } finally {
      setBusy(false);
    }
  }

  function pickStars(n: number) {
    setStars(n);
    scorePhrase(phrase.id, n);
  }

  const mineProgress =
    mineStatus.duration && mineStatus.duration > 0
      ? Math.min(1, mineStatus.currentTime / mineStatus.duration)
      : 0;

  return (
    <View style={{ flex: 1, padding: spacing.md, gap: spacing.md }}>
      <EchoText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        {index + 1} / {total}
      </EchoText>

      <PhraseCard phrase={phrase} />

      {phase === 'listen' && (
        <View style={{ gap: spacing.md }}>
          <Button title={`🔊 ${s.playModel}`} onPress={() => playModel(phrase.text, phrase.lang)} size="lg" />
          <Button title={`🎙️ ${s.record}`} variant="secondary" onPress={startRecording} size="lg" />
        </View>
      )}

      {phase === 'recording' && (
        <View style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: radii.full,
              backgroundColor: colors.danger,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EchoText variant="h1" color={colors.textInverse}>
              ●
            </EchoText>
          </View>
          <EchoText variant="h2">
            {String(Math.floor(elapsedSec / 60))}:{String(elapsedSec % 60).padStart(2, '0')}
          </EchoText>
          <Button title={`■ ${s.stop}`} onPress={stopRecording} size="lg" style={{ alignSelf: 'stretch' }} />
        </View>
      )}

      {phase === 'compare' && (
        <View style={{ gap: spacing.md }}>
          <Card>
            <View style={{ gap: spacing.sm }}>
              <Button title={`🔊 ${s.playModel}`} onPress={() => playModel(phrase.text, phrase.lang)} />
              {mineUri ? (
                <View style={{ gap: spacing.xs }}>
                  <Button
                    title={`🎧 ${s.playMine}`}
                    variant="secondary"
                    onPress={() => void minePlayer.play()}
                  />
                  <View
                    style={{
                      height: 6,
                      borderRadius: radii.full,
                      backgroundColor: colors.border,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: 6,
                        width: `${mineProgress * 100}%`,
                        backgroundColor: colors.accent,
                      }}
                    />
                  </View>
                </View>
              ) : (
                <EchoText variant="bodySmall" color={colors.textTertiary}>
                  {s.noAttempt}
                </EchoText>
              )}
            </View>
          </Card>

          <View>
            <EchoText variant="h3" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
              {s.selfScore}
            </EchoText>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => pickStars(n)}
                  accessibilityRole="button"
                  accessibilityLabel={`${n} / 5`}
                  accessibilityState={{ selected: stars === n }}
                  hitSlop={8}
                  style={{ padding: spacing.xs }}
                >
                  <EchoText variant="h1" color={stars !== null && n <= stars ? colors.warning : colors.border}>
                    ★
                  </EchoText>
                </Pressable>
              ))}
            </View>
          </View>

          <Button
            title={s.nextPhrase}
            onPress={onNext}
            disabled={stars === null}
            size="lg"
          />
        </View>
      )}
    </View>
  );
}

export function PracticeScreen({
  pack,
  index,
  onIndexChange,
  onDone,
  onPaywall,
}: {
  pack: PackId;
  index: number;
  onIndexChange: (i: number) => void;
  onDone: () => void;
  onPaywall: () => void;
}) {
  const { colors, spacing } = useTheme();
  const phrases = phrasesForPack(pack);
  const phrase = phrases[index];

  useEffect(() => {
    return () => {
      void stopModel();
    };
  }, []);

  return (
    <Screen scroll={false}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <View style={{ width: 48 }} />
        <EchoText variant="h3">{pack.toUpperCase()}</EchoText>
        <Pressable
          testID="practice-close"
          accessibilityRole="button"
          accessibilityLabel="close"
          onPress={onDone}
          hitSlop={12}
          style={{ width: 48, alignItems: 'flex-end' }}
        >
          <EchoText variant="h2" color={colors.textTertiary}>
            ✕
          </EchoText>
        </Pressable>
      </View>

      {phrase ? (
        <PracticeBody
          key={phrase.id}
          phrase={phrase}
          index={index}
          total={phrases.length}
          onNext={() => (index + 1 < phrases.length ? onIndexChange(index + 1) : onDone())}
          onPaywall={onPaywall}
        />
      ) : null}
    </Screen>
  );
}
