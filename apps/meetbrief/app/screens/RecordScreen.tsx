import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Switch, TextInput, View } from 'react-native';
import { useAudioRecorder, useAudioRecorderState, RecordingPresets } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';
import { FREE_MAX_DURATION_SEC, FREE_MEETINGS_PER_MONTH, useMeetBrief, type Meeting } from '../store/app';
import { t } from '../lib/i18n';
import { ensureAudioMode, getMicStatus, persistRecording, requestMic, type MicStatus } from '../lib/audio';
import { fmtDate, fmtDuration, fmtMoney, meetingCost, newId } from '../lib/format';
import { buildSummary } from '../lib/summary';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type Phase = 'idle' | 'recording' | 'paused' | 'saving';

export function RecordScreen({
  onSaved,
  onOpenPaywall,
}: {
  onSaved: (id: string) => void;
  onOpenPaywall: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { lang, defaultRate, isPro, meetingsThisMonth, addMeeting } = useMeetBrief();
  const strings = t();

  const [title, setTitle] = useState('');
  const [costEnabled, setCostEnabled] = useState(defaultRate > 0);
  const [rateText, setRateText] = useState(defaultRate > 0 ? String(defaultRate) : '');
  const [phase, setPhase] = useState<Phase>('idle');
  const [micStatus, setMicStatus] = useState<MicStatus>('undetermined');
  const [error, setError] = useState<string | null>(null);
  const startAtRef = useRef(0);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder, 250);
  const elapsedSec = Math.floor(recState.durationMillis / 1000);
  const rate = parseFloat(rateText.replace(',', '.')) || 0;

  useEffect(() => {
    void getMicStatus().then(setMicStatus);
  }, []);

  // Free-plan auto-stop at the duration cap.
  useEffect(() => {
    if (phase === 'recording' && !isPro && elapsedSec >= FREE_MAX_DURATION_SEC) {
      void stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSec, phase, isPro]);

  const atLimit = !isPro && meetingsThisMonth >= FREE_MEETINGS_PER_MONTH;

  const start = async () => {
    setError(null);
    let status = micStatus;
    if (status !== 'granted') {
      status = (await requestMic()) ? 'granted' : 'denied';
      setMicStatus(status);
    }
    if (status !== 'granted') {
      setError(strings.micDenied);
      return;
    }
    try {
      await ensureAudioMode();
      await recorder.prepareToRecordAsync();
      startAtRef.current = Date.now();
      recorder.record();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setPhase('recording');
    } catch {
      setError(strings.micUnavailable);
      setPhase('idle');
    }
  };

  const pause = () => {
    recorder.pause();
    setPhase('paused');
  };

  const resume = () => {
    recorder.record();
    setPhase('recording');
  };

  const stop = async () => {
    if (phase === 'saving') return;
    setPhase('saving');
    try {
      await recorder.stop();
    } catch {
      // stop on an already-stopped recorder — keep whatever we have
    }
    const id = newId();
    const finalTitle = title.trim() || `${strings.meetings} · ${fmtDate(Date.now(), lang)}`;
    const hourlyRate = costEnabled ? rate : 0;
    let audioUri: string | null = null;
    try {
      if (recorder.uri) audioUri = await persistRecording(recorder.uri, id);
    } catch {
      audioUri = null; // metadata still saves; playback shows "no audio"
    }
    const meeting: Meeting = {
      id,
      title: finalTitle,
      createdAt: startAtRef.current || Date.now(),
      durationSec: elapsedSec,
      audioUri,
      transcript: '',
      summary: '',
      notes: '',
      actions: [],
      hourlyRate,
      cost: meetingCost(hourlyRate, elapsedSec),
    };
    meeting.summary = buildSummary(meeting, lang);
    addMeeting(meeting);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('idle');
    setTitle('');
    onSaved(id);
  };

  const meterLevel = recState.metering != null ? Math.max(0, Math.min(1, (recState.metering + 55) / 55)) : 0;

  const inputStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 48,
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.md, gap: spacing.md }}>
        <MeetText variant="h1">{strings.record}</MeetText>

        {atLimit && phase === 'idle' ? (
          <Card>
            <View style={{ gap: spacing.sm }}>
              <MeetText variant="h3">{strings.limitTitle}</MeetText>
              <MeetText variant="bodySmall" color={colors.textSecondary}>
                {strings.limitBody}
              </MeetText>
              <Button title={strings.goPro} onPress={onOpenPaywall} />
            </View>
          </Card>
        ) : (
          <>
            <View style={{ gap: spacing.xs }}>
              <MeetText variant="overline" color={colors.textSecondary}>
                {strings.meetingTitle}
              </MeetText>
              <TextInput
                accessibilityLabel={strings.meetingTitle}
                placeholder={strings.titlePlaceholder}
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
                editable={phase === 'idle'}
                style={inputStyle}
              />
            </View>

            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <MeetText variant="body">{strings.costTimer}</MeetText>
                  <MeetText variant="caption" color={colors.textSecondary}>
                    {strings.costTimerHelp}
                  </MeetText>
                </View>
                <Switch
                  value={costEnabled}
                  onValueChange={setCostEnabled}
                  trackColor={{ true: colors.accent }}
                  disabled={phase !== 'idle'}
                />
              </View>
              {costEnabled && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
                  <MeetText variant="bodySmall" color={colors.textSecondary}>
                    {strings.hourlyRate}
                  </MeetText>
                  <TextInput
                    accessibilityLabel={strings.hourlyRate}
                    placeholder={strings.ratePlaceholder}
                    placeholderTextColor={colors.textTertiary}
                    value={rateText}
                    onChangeText={setRateText}
                    keyboardType="decimal-pad"
                    editable={phase === 'idle'}
                    style={[inputStyle, { flex: 1 }]}
                  />
                </View>
              )}
            </Card>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
              {phase === 'idle' ? (
                <MeetText variant="bodySmall" color={colors.textSecondary}>
                  {strings.tapToStart}
                </MeetText>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: colors.record,
                        opacity: phase === 'recording' ? 1 : 0.35,
                      }}
                    />
                    <MeetText variant="overline" color={colors.record}>
                      {phase === 'recording' ? strings.recording : phase === 'paused' ? strings.paused : strings.saving}
                    </MeetText>
                  </View>
                  <MeetText variant="timer">{fmtDuration(elapsedSec)}</MeetText>
                  <View
                    style={{
                      width: 160,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.surfaceAlt,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.round(meterLevel * 100)}%`,
                        height: '100%',
                        backgroundColor: colors.accent,
                      }}
                    />
                  </View>
                  {costEnabled && rate > 0 && (
                    <MeetText variant="h3" color={colors.money}>
                      {strings.estCost}: {fmtMoney(meetingCost(rate, elapsedSec), lang)}
                    </MeetText>
                  )}
                  {!isPro && (
                    <MeetText variant="caption" color={colors.textTertiary}>
                      {strings.maxDurationNote}
                    </MeetText>
                  )}
                </>
              )}
              {error && (
                <MeetText variant="bodySmall" color={colors.danger} style={{ textAlign: 'center' }}>
                  {error}
                </MeetText>
              )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, paddingBottom: spacing.md }}>
              {phase === 'idle' && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={strings.record}
                  onPress={() => void start()}
                  android_ripple={{ color: colors.overlay }}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: colors.record,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff' }}
                  />
                </Pressable>
              )}
              {(phase === 'recording' || phase === 'paused') && (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={phase === 'recording' ? strings.pause : strings.resume}
                    onPress={() => (phase === 'recording' ? pause() : resume())}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: colors.surfaceAlt,
                      borderWidth: 1,
                      borderColor: colors.borderStrong,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MeetText variant="h2">{phase === 'recording' ? '⏸' : '▶'}</MeetText>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={strings.stop}
                    onPress={() => void stop()}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: colors.record,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={{ width: 26, height: 26, borderRadius: 4, backgroundColor: '#fff' }} />
                  </Pressable>
                </>
              )}
              {phase === 'saving' && (
                <MeetText variant="body" color={colors.textSecondary}>
                  {strings.saving}
                </MeetText>
              )}
            </View>
          </>
        )}
      </View>
    </Screen>
  );
}
