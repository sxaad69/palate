import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AppState, type AppStateStatus, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useFocus, type Distraction, type Session } from '../store/focus';
import {
  requestNotificationPermissions,
  scheduleSessionEnd,
  cancelSessionEnd,
} from '../lib/notifications';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';

const STRICT_EXIT_LIMIT = 3;

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const h = Math.floor(m / 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m % 60)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// The guard room: big countdown, distraction logging, strict mode.
// Leaving the app (AppState → background) is detected and logged.
export default function SessionScreen({
  durationSec,
  label,
  strict,
  onFinish,
}: {
  durationSec: number;
  label: string;
  strict: boolean;
  onFinish: (s: Omit<Session, 'id' | 'reflection'>) => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { notifyOnEnd } = useFocus();
  const [remaining, setRemaining] = useState(durationSec);
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [toast, setToast] = useState('');
  const startedAt = useRef(Date.now());
  const awaySec = useRef(0);
  const exitStart = useRef<number | null>(null);
  const notifId = useRef<string | null>(null);
  const finished = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  const finish = (completed: boolean, strictBroken: boolean) => {
    if (finished.current) return;
    finished.current = true;
    cancelSessionEnd(notifId.current);
    const endedAt = Date.now();
    const elapsedSec = Math.round((endedAt - startedAt.current) / 1000);
    onFinish({
      label,
      plannedSec: durationSec,
      startedAt: startedAt.current,
      endedAt,
      focusedSec: Math.max(0, elapsedSec - Math.round(awaySec.current)),
      distractions,
      completed,
      strictBroken,
    });
  };

  // Schedule the pull-back notification.
  useEffect(() => {
    (async () => {
      if (!notifyOnEnd) return;
      const ok = await requestNotificationPermissions();
      if (!ok) return;
      notifId.current = await scheduleSessionEnd(
        new Date(startedAt.current + durationSec * 1000),
        t.sessionComplete,
        t.backToWork,
      );
    })();
    return () => { cancelSessionEnd(notifId.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The countdown.
  useEffect(() => {
    const iv = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(iv);
          finish(true, false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The guard: AppState exits are distractions.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (finished.current) return;
      if (state === 'background' || state === 'inactive') {
        exitStart.current = Date.now();
        setDistractions((prev) => {
          const next = [...prev, { at: Date.now(), kind: 'exit' as const }];
          const exits = next.filter((d) => d.kind === 'exit').length;
          if (strict && exits >= STRICT_EXIT_LIMIT) {
            setTimeout(() => finish(false, true), 300);
          }
          return next;
        });
      } else if (state === 'active' && exitStart.current) {
        awaySec.current += (Date.now() - exitStart.current) / 1000;
        exitStart.current = null;
        showToast(t.backToWork);
      }
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strict]);

  const logManual = () => {
    setDistractions((prev) => [...prev, { at: Date.now(), kind: 'manual' }]);
    showToast(t.distractedLogged);
  };

  const confirmEnd = () => {
    Alert.alert(t.endSession, t.endConfirm, [
      { text: t.keepGoing, style: 'cancel' },
      { text: t.endNow, style: 'destructive', onPress: () => finish(false, false) },
    ]);
  };

  const exits = distractions.filter((d) => d.kind === 'exit').length;
  const strictLeft = STRICT_EXIT_LIMIT - exits;
  const pct = 1 - remaining / durationSec;

  return (
    <Screen padded>
      <View style={styles.center}>
        {label ? (
          <Text variant="h3" align="center" style={{ color: colors.textSecondary }}>{label}</Text>
        ) : null}
        <View style={[styles.ring, { borderColor: colors.accent }]}>
          <Text variant="display" style={{ fontVariant: ['tabular-nums'] }}>
            {fmt(remaining)}
          </Text>
        </View>
        <View style={[styles.bar, { backgroundColor: colors.surfaceAlt }]}>
          <View style={[styles.barFill, { width: `${Math.round(pct * 100)}%`, backgroundColor: colors.accent }]} />
        </View>
        {strict && !finished.current && (
          <Text variant="caption" align="center" style={{ color: colors.danger }}>
            {t.strictWarn.replace('{n}', String(Math.max(0, strictLeft)))}
          </Text>
        )}
        <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>
          {t.pausedNote}
        </Text>
        {toast ? (
          <View style={[styles.toast, { backgroundColor: colors.textPrimary }]}>
            <Text variant="body" align="center" style={{ color: colors.background }}>{toast}</Text>
          </View>
        ) : null}
        <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
          {t.distractions}: {distractions.length}
        </Text>
      </View>
      <View style={styles.footer}>
        <Button title={t.distractedBtn} onPress={logManual} variant="secondary" />
        <Button title={t.endSession} onPress={confirmEnd} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  ring: {
    width: 240, height: 240, borderRadius: 120, borderWidth: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  bar: { height: 8, borderRadius: radii.full, overflow: 'hidden', width: '100%' },
  barFill: { height: 8, borderRadius: radii.full },
  toast: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.full },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});
