import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { presetById } from '../data/presets';
import {
  formatCountdown,
  stageFor,
  STAGES,
} from '../lib/fasting';

const RING_SIZE = 240;
const RING_STROKE = 16;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

// The centerpiece: live fasting countdown ring + stage timeline.
// Ticking lives here (1s interval, screen-local) — not in the store.
export function TimerScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, activeFast, startFast, endFast, adjustStart, presetId, streak } = useApp();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!activeFast) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [!!activeFast]);

  const preset = presetById(presetId);

  if (!activeFast) {
    return (
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Text variant="overline" color="textTertiary">
              {language === 'ar' ? preset.nameAr : preset.nameEn} · {preset.fastHours}{t.hours} {t.fastingWindow}
            </Text>
            <Text variant="display" style={{ marginVertical: spacing.md }}>
              {preset.fastHours}:00:00
            </Text>
            <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginBottom: spacing.xl }}>
              {streak > 0 ? `${streak} ${t.streak}` : t.appTagline}
            </Text>
            <View style={{ width: '100%' }}>
              <Button title={t.startFasting} onPress={() => startFast()} />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  const targetMs = activeFast.targetHours * 3_600_000;
  const elapsedMs = now - activeFast.startedAt;
  const remainingMs = targetMs - elapsedMs;
  const elapsedHrs = elapsedMs / 3_600_000;
  const progress = Math.min(1, elapsedMs / targetMs);
  const stage = stageFor(Math.max(0, elapsedHrs));
  const done = remainingMs <= 0;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <Svg width={RING_SIZE} height={RING_SIZE} accessibilityRole="image" accessibilityLabel={t.fastingFor}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={colors.border}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={done ? colors.success : colors.accent}
              strokeWidth={RING_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${RING_CIRC}`}
              strokeDashoffset={RING_CIRC * (1 - progress)}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={{ position: 'absolute', alignItems: 'center', top: 96 }}>
            <Text variant="overline" color="textTertiary">
              {done ? t.completed : t.fastingFor}
            </Text>
            <Text variant="display">{formatCountdown(Math.abs(remainingMs))}</Text>
            <Text variant="bodySmall" color="textSecondary" style={{ marginTop: spacing.xs }}>
              {t.currentStage}: {language === 'ar' ? stage.nameAr : stage.nameEn}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Button title="-30m" variant="secondary" onPress={() => adjustStart(-30 * 60_000)} accessibilityLabel={t.adjustStart} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="+30m" variant="secondary" onPress={() => adjustStart(30 * 60_000)} accessibilityLabel={t.adjustStart} />
          </View>
        </View>
        <View style={{ marginTop: spacing.sm }}>
          <Button title={t.endFast} onPress={endFast} />
        </View>

        <Text variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          {t.stagesTitle}
        </Text>
        {STAGES.map((s) => {
          const reached = elapsedHrs >= s.fromHour;
          return (
            <Card key={s.fromHour} style={{ marginBottom: spacing.sm, opacity: reached ? 1 : 0.55 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: radii.full,
                    backgroundColor: reached ? colors.accent : colors.border,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text variant="body">
                    {s.fromHour}{t.hours} — {language === 'ar' ? s.nameAr : s.nameEn}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {language === 'ar' ? s.descAr : s.descEn}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
