import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { FableText } from './FableText';
import type { BreathPattern } from '../data/sessions';
import { cuePhase } from '../lib/speech';

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface Props {
  pattern: BreathPattern;
  running: boolean;
  onPhase?: (phase: BreathPhase, cycle: number) => void;
  phaseLabel: (phase: BreathPhase) => string;
  size?: number;
}

// Breath pacing ring driven by a JS clock (250ms tick — plenty for
// breathwork, and trivially pausable). The ring eases between scales;
// phase changes fire haptics + voice cues.
export function BreathRing({ pattern, running, onPhase, phaseLabel, size = 240 }: Props) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.35)).current;
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const stateRef = useRef({ elapsed: 0, cycle: 0, lastPhase: 'inhale' as BreathPhase });

  const phases = useRef<Array<{ name: BreathPhase; secs: number }>>([
    { name: 'inhale', secs: pattern.inhale },
    { name: 'hold', secs: pattern.hold },
    { name: 'exhale', secs: pattern.exhale },
    { name: 'rest', secs: pattern.rest },
  ]).current;

  useEffect(() => {
    if (!running) return;
    const tickMs = 250;
    const id = setInterval(() => {
      const st = stateRef.current;
      st.elapsed += tickMs / 1000;

      // Walk the phase list to find the current phase.
      let acc = 0;
      let current = phases[0]!;
      let cycleLen = 0;
      for (const p of phases) cycleLen += p.secs;
      const inCycle = st.elapsed % cycleLen;
      st.cycle = Math.floor(st.elapsed / cycleLen);
      for (const p of phases) {
        if (p.secs <= 0) continue;
        if (inCycle < acc + p.secs) {
          current = p;
          break;
        }
        acc += p.secs;
      }

      if (current.name !== st.lastPhase) {
        st.lastPhase = current.name;
        setPhase(current.name);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        cuePhase(current.name);
        onPhase?.(current.name, st.cycle);
      }
    }, tickMs);
    return () => clearInterval(id);
  }, [running, phases, onPhase]);

  // Ease the ring on phase change.
  useEffect(() => {
    const target = phase === 'inhale' ? 1.4 : phase === 'exhale' ? 1.0 : undefined;
    const glowTarget = phase === 'inhale' ? 0.7 : 0.35;
    const dur =
      phase === 'inhale'
        ? pattern.inhale * 1000
        : phase === 'exhale'
          ? pattern.exhale * 1000
          : 400;
    if (target !== undefined) {
      Animated.timing(scale, {
        toValue: target,
        duration: dur,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(glow, {
      toValue: glowTarget,
      duration: dur,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [phase, pattern, scale, glow]);

  const r = size / 2;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.glow,
          {
            width: size,
            height: size,
            borderRadius: r,
            backgroundColor: colors.accent,
            opacity: glow,
            transform: [{ scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: r * 0.72,
            borderColor: colors.accent,
            backgroundColor: colors.surfaceAlt,
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.label}>
        <FableText variant="h3" color={colors.textPrimary}>
          {phaseLabel(phase)}
        </FableText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute' },
  ring: { position: 'absolute', borderWidth: 2 },
  label: { position: 'absolute', alignItems: 'center' },
});
