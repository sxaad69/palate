import React, { useEffect, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useTheme } from '../theme/ThemeProvider';
import { useMeetBrief, type ActionItem } from '../store/app';
import { t } from '../lib/i18n';
import { fmtDate, fmtDuration, fmtMoney } from '../lib/format';
import { buildSummary } from '../lib/summary';
import { copyShareText, shareMeeting } from '../lib/share';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function SectionTitle({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <MeetText variant="overline" color={colors.textSecondary} style={{ marginBottom: 4 }}>
      {children}
    </MeetText>
  );
}

function PlaybackCard({ audioUri, durationSec }: { audioUri: string | null; durationSec: number }) {
  const { colors, spacing, radii } = useTheme();
  const strings = t();
  const player = useAudioPlayer(audioUri);
  const status = useAudioPlayerStatus(player);
  const pos = status.currentTime || 0;
  const dur = status.duration || durationSec;
  const progress = dur > 0 ? Math.min(1, pos / dur) : 0;

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // already released
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!audioUri) {
    return (
      <Card>
        <MeetText variant="bodySmall" color={colors.textSecondary}>
          {strings.noAudio}
        </MeetText>
      </Card>
    );
  }

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.playback}
          onPress={() => (status.playing ? player.pause() : player.play())}
          android_ripple={{ color: colors.overlay }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MeetText variant="h2" color={colors.textInverse}>
            {status.playing ? '⏸' : '▶'}
          </MeetText>
        </Pressable>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.surfaceAlt,
              overflow: 'hidden',
            }}
          >
            <View
              style={{ width: `${Math.round(progress * 100)}%`, height: '100%', backgroundColor: colors.accent }}
            />
          </View>
          <MeetText variant="caption" color={colors.textSecondary}>
            {fmtDuration(pos)} / {fmtDuration(dur)}
          </MeetText>
        </View>
      </View>
    </Card>
  );
}

function ActionRow({
  meetingId,
  action,
}: {
  meetingId: string;
  action: ActionItem;
}) {
  const { colors, spacing, radii } = useTheme();
  const { toggleAction, editAction, removeAction, lang } = useMeetBrief();
  void lang;
  const strings = t();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(action.text);

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft.trim() !== action.text) editAction(meetingId, action.id, draft);
    else setDraft(action.text);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: action.done }}
        accessibilityLabel={action.text}
        onPress={() => toggleAction(meetingId, action.id)}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: action.done ? colors.success : colors.borderStrong,
          backgroundColor: action.done ? colors.success : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {action.done && <MeetText variant="caption" color="#fff">✓</MeetText>}
      </Pressable>
      {editing ? (
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onBlur={commit}
          onSubmitEditing={commit}
          autoFocus
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.textPrimary,
            borderBottomWidth: 1,
            borderBottomColor: colors.accent,
            paddingVertical: 2,
          }}
        />
      ) : (
        <Pressable style={{ flex: 1 }} onLongPress={() => setEditing(true)}>
          <MeetText
            variant="body"
            color={action.done ? colors.textTertiary : colors.textPrimary}
            style={action.done ? { textDecorationLine: 'line-through' } : undefined}
          >
            {action.text}
          </MeetText>
        </Pressable>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={strings.edit}
        onPress={() => (editing ? commit() : setEditing(true))}
        hitSlop={8}
        style={{ padding: spacing.xs }}
      >
        <MeetText variant="bodySmall" color={colors.accent}>✎</MeetText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={strings.delete}
        onPress={() =>
          Alert.alert(strings.deleteAction, action.text, [
            { text: strings.cancel, style: 'cancel' },
            { text: strings.delete, style: 'destructive', onPress: () => removeAction(meetingId, action.id) },
          ])
        }
        hitSlop={8}
        style={{ padding: spacing.xs }}
      >
        <MeetText variant="bodySmall" color={colors.danger}>✕</MeetText>
      </Pressable>
    </View>
  );
}

export function MeetingDetailScreen({
  meetingId,
  onClose,
}: {
  meetingId: string;
  onClose: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const {
    meetings, lang, updateMeeting, removeMeeting, addAction,
  } = useMeetBrief();
  const strings = t();
  const meeting = meetings.find((m) => m.id === meetingId);

  const [notesDraft, setNotesDraft] = useState<string | null>(null);
  const [transcriptDraft, setTranscriptDraft] = useState<string | null>(null);
  const [newAction, setNewAction] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!meeting) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);

  if (!meeting) return null;

  const regenerate = () => {
    updateMeeting(meeting.id, {
      summary: buildSummary(
        {
          title: meeting.title,
          createdAt: meeting.createdAt,
          durationSec: meeting.durationSec,
          hourlyRate: meeting.hourlyRate,
          cost: meeting.cost,
          notes: notesDraft ?? meeting.notes,
          transcript: transcriptDraft ?? meeting.transcript,
          actions: meeting.actions,
        },
        lang,
      ),
    });
  };

  const doShare = () => {
    void shareMeeting(
      { ...meeting, notes: notesDraft ?? meeting.notes, transcript: transcriptDraft ?? meeting.transcript },
      lang,
    );
  };

  const doCopy = async () => {
    await copyShareText(
      { ...meeting, notes: notesDraft ?? meeting.notes, transcript: transcriptDraft ?? meeting.transcript },
      lang,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doDelete = () => {
    Alert.alert(strings.deleteMeeting, strings.deleteMeetingBody, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.delete,
        style: 'destructive',
        onPress: () => {
          removeMeeting(meeting.id);
          onClose();
        },
      },
    ]);
  };

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
    textAlignVertical: 'top' as const,
  };

  return (
    <Screen>
      <View style={{ gap: spacing.md, paddingTop: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={strings.close}>
            <MeetText variant="h2" color={colors.accent}>‹</MeetText>
          </Pressable>
          <MeetText variant="caption" color={colors.textSecondary}>
            {fmtDate(meeting.createdAt, lang)} · {fmtDuration(meeting.durationSec)}
          </MeetText>
        </View>

        <MeetText variant="h1">{meeting.title}</MeetText>
        {meeting.cost > 0 && (
          <MeetText variant="h3" color={colors.money}>
            {strings.estCost}: {fmtMoney(meeting.cost, lang)}
          </MeetText>
        )}

        <View>
          <SectionTitle>{strings.playback}</SectionTitle>
          <PlaybackCard audioUri={meeting.audioUri} durationSec={meeting.durationSec} />
        </View>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionTitle>{strings.summary}</SectionTitle>
            <Pressable onPress={regenerate} hitSlop={8}>
              <MeetText variant="bodySmall" color={colors.accent}>
                {strings.regenerate}
              </MeetText>
            </Pressable>
          </View>
          <Card>
            <MeetText variant="body">{meeting.summary || '—'}</MeetText>
          </Card>
        </View>

        <View>
          <SectionTitle>
            {strings.actionItems} ({meeting.actions.filter((a) => a.done).length}/{meeting.actions.length})
          </SectionTitle>
          <Card>
            {meeting.actions.map((a) => (
              <ActionRow key={a.id} meetingId={meeting.id} action={a} />
            ))}
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
              <TextInput
                accessibilityLabel={strings.addAction}
                placeholder={strings.actionPlaceholder}
                placeholderTextColor={colors.textTertiary}
                value={newAction}
                onChangeText={setNewAction}
                onSubmitEditing={() => {
                  addAction(meeting.id, newAction);
                  setNewAction('');
                }}
                style={[inputStyle, { flex: 1 }]}
              />
              <Button
                title="+"
                onPress={() => {
                  addAction(meeting.id, newAction);
                  setNewAction('');
                }}
                size="md"
                accessibilityLabel={strings.addAction}
              />
            </View>
          </Card>
        </View>

        <View>
          <SectionTitle>{strings.notes}</SectionTitle>
          <TextInput
            accessibilityLabel={strings.notes}
            placeholder={strings.notesPlaceholder}
            placeholderTextColor={colors.textTertiary}
            value={notesDraft ?? meeting.notes}
            onChangeText={setNotesDraft}
            onBlur={() => {
              if (notesDraft !== null && notesDraft !== meeting.notes) {
                updateMeeting(meeting.id, { notes: notesDraft });
              }
            }}
            multiline
            style={[inputStyle, { minHeight: 96 }]}
          />
        </View>

        <View>
          <SectionTitle>{strings.transcript}</SectionTitle>
          <TextInput
            accessibilityLabel={strings.transcript}
            placeholder={strings.transcriptPlaceholder}
            placeholderTextColor={colors.textTertiary}
            value={transcriptDraft ?? meeting.transcript}
            onChangeText={setTranscriptDraft}
            onBlur={() => {
              if (transcriptDraft !== null && transcriptDraft !== meeting.transcript) {
                updateMeeting(meeting.id, { transcript: transcriptDraft });
              }
            }}
            multiline
            style={[inputStyle, { minHeight: 96 }]}
          />
          <MeetText variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.xs }}>
            {strings.transcriptComing}
          </MeetText>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button title={`⤴ ${strings.sharePack}`} onPress={doShare} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title={copied ? `✓ ${strings.copied}` : `⧉ ${strings.copy}`}
              onPress={() => void doCopy()}
              variant="secondary"
            />
          </View>
        </View>

        <Button title={strings.deleteMeeting} onPress={doDelete} variant="destructive" />
      </View>
    </Screen>
  );
}
