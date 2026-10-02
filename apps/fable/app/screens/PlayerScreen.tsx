import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { FableText } from '../components/FableText';
import { Button } from '../components/Button';
import { BreathRing, type BreathPhase } from '../components/BreathRing';
import { useFable } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { getGuidanceDensity, setGuidanceDensity, narrateIntro, narrateBeat, stopNarration, type GuidanceDensity } from '../lib/speech';
import { cycleSeconds, type Session } from '../data/sessions';

const PHASE_LABEL: Record<BreathPhase, { en: string; ar: string }> = {
  inhale: { en: 'breathe in', ar: 'شهيق' },
  hold: { en: 'hold', ar: 'احبس' },
  exhale: { en: 'let go', ar: 'زفير' },
  rest: { en: 'rest', ar: 'استرح' },
};

const DENSITIES: GuidanceDensity[] = ['full', 'minimal', 'silent'];
const DENSITY_LABEL: Record<GuidanceDensity, { en: string; ar: string }> = {
  full: { en: 'Story', ar: 'قصة' },
  minimal: { en: 'Cues', ar: 'إشارات' },
  silent: { en: 'Silent', ar: 'صامت' },
};

// A beat advances every 3 breath cycles — the story unfolds slowly,
// never racing the breath.
const BEAT_EVERY_CYCLES = 3;

export function PlayerScreen({ session, onDone }: { session: Session; onDone: () => void }) {
  const { colors, spacing } = useTheme();
  const { logSession } = useFable();
  const lang = getLang();
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [beatIdx, setBeatIdx] = useState(0);
  const [density, setDensity] = useState<GuidanceDensity>(getGuidanceDensity());
  const [secondsLeft, setSecondsLeft] = useState(session.minutes * 60);
  const beats = lang === 'ar' ? session.beatsAr : session.beatsEn;
  const lastBeatRef = useRef(-1);

  const totalSecs = session.minutes * 60;

  const changeDensity = (d: GuidanceDensity) => {
    setGuidanceDensity(d);
    setDensity(d);
    if (d !== 'full') void stopNarration();
  };

  const start = () => {
    setStarted(true);
    setRunning(true);
    narrateIntro(lang === 'ar' ? session.introAr : session.introEn);
  };

  const toggle = () => {
    setRunning((r) => {
      if (r) void stopNarration();
      return !r;
    });
  };

  const finish = useCallback(() => {
    void stopNarration();
    setRunning(false);
    setFinished(true);
    logSession(session.id, session.minutes);
  }, [logSession, session.id, session.minutes]);

  // Session countdown.
  useEffect(() => {
    if (!running || finished) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, finished, finish]);

  // Advance the story beat every N cycles (spoken only on full density).
  const handlePhase = useCallback(
    (phase: BreathPhase, cycle: number) => {
      if (phase !== 'inhale') return;
      const idx = Math.min(Math.floor(cycle / BEAT_EVERY_CYCLES), beats.length - 1);
      if (idx !== lastBeatRef.current) {
        lastBeatRef.current = idx;
        setBeatIdx(idx);
        narrateBeat(beats[idx]!);
      }
    },
    [beats],
  );

  useEffect(() => () => void stopNarration(), []);

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, '0');

  if (finished) {
    return (
      <Screen scroll={false}>
        <View style={[styles.center, { padding: spacing.lg }]}>
          <FableText variant="h1" style={styles.centerText}>
            {lang === 'ar' ? 'اكتملت الجلسة' : 'Session complete'}
          </FableText>
          <FableText variant="narration" color={colors.textSecondary} style={styles.centerText}>
            {lang === 'ar' ? session.outroAr : session.outroEn}
          </FableText>
          <View style={{ height: spacing.xl }} />
          <Button title={t().continue} onPress={onDone} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={[styles.root, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <Pressable hitSlop={16} onPress={() => { void stopNarration(); onDone(); }} accessibilityRole="button" accessibilityLabel="close">
            <FableText variant="h2" color={colors.textSecondary}>✕</FableText>
          </Pressable>
          <FableText variant="bodySmall" color={colors.textSecondary}>
            {mm}:{ss}
          </FableText>
        </View>

        <FableText variant="h2" style={styles.centerText}>
          {lang === 'ar' ? session.titleAr : session.titleEn}
        </FableText>

        <View style={styles.ringWrap}>
          <BreathRing
            pattern={session.pattern}
            running={running}
            onPhase={handlePhase}
            phaseLabel={(p) => PHASE_LABEL[p][lang]}
            size={260}
          />
        </View>

        <View style={styles.beatWrap}>
          <FableText variant="narration" color={colors.textPrimary} style={styles.centerText}>
            {!started
              ? lang === 'ar'
                ? session.introAr
                : session.introEn
              : beats[beatIdx]}
          </FableText>
          <FableText variant="caption" color={colors.textTertiary} style={styles.centerText}>
            {lang === 'ar' ? `الفصل ${session.chapter}` : `Chapter ${session.chapter}`} ·{' '}
            {Math.floor(totalSecs / cycleSeconds(session.pattern))}{' '}
            {lang === 'ar' ? 'دورة تنفس' : 'breath cycles'}
          </FableText>
        </View>

        <View style={styles.densityRow}>
          {DENSITIES.map((d) => (
            <Pressable
              key={d}
              onPress={() => changeDensity(d)}
              accessibilityRole="button"
              accessibilityState={{ selected: density === d }}
              style={[
                styles.densityChip,
                {
                  backgroundColor: density === d ? colors.accentMuted : colors.surfaceAlt,
                  borderRadius: 999,
                },
              ]}
            >
              <FableText
                variant="caption"
                color={density === d ? colors.textInverse : colors.textSecondary}
              >
                {DENSITY_LABEL[d][lang]}
              </FableText>
            </Pressable>
          ))}
        </View>

        {!started ? (
          <Button title={t().start} onPress={start} size="lg" />
        ) : (
          <Button
            title={running ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (lang === 'ar' ? 'استئناف' : 'Resume')}
            onPress={toggle}
            variant="secondary"
            size="lg"
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerText: { textAlign: 'center' },
  ringWrap: { alignItems: 'center', marginVertical: 8 },
  beatWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 8 },
  densityRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  densityChip: { paddingHorizontal: 16, paddingVertical: 8 },
});
