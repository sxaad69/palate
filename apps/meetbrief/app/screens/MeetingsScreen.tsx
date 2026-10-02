import React, { useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useMeetBrief, type Meeting } from '../store/app';
import { t } from '../lib/i18n';
import { fmtDate, fmtDuration, fmtMoney } from '../lib/format';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';

function MeetingRow({
  meeting,
  onOpen,
}: {
  meeting: Meeting;
  onOpen: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { lang } = useMeetBrief();
  const done = meeting.actions.filter((a) => a.done).length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={meeting.title}
      onPress={onOpen}
      android_ripple={{ color: colors.overlay }}
      style={{ borderRadius: radii.lg }}
    >
      <Card>
        <View style={{ gap: spacing.xs }}>
          <MeetText variant="h3" numberOfLines={1}>
            {meeting.title}
          </MeetText>
          <MeetText variant="bodySmall" color={colors.textSecondary}>
            {fmtDate(meeting.createdAt, lang)} · {fmtDuration(meeting.durationSec)}
            {meeting.cost > 0 ? ` · ${fmtMoney(meeting.cost, lang)}` : ''}
          </MeetText>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
            <View
              style={{
                backgroundColor: colors.accentMuted,
                borderRadius: radii.full,
                paddingHorizontal: spacing.sm,
                paddingVertical: 2,
              }}
            >
              <MeetText variant="caption" color={colors.accent}>
                {done}/{meeting.actions.length} {t().actionsCount}
              </MeetText>
            </View>
            {meeting.audioUri && (
              <View
                style={{
                  backgroundColor: colors.surfaceAlt,
                  borderRadius: radii.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                }}
              >
                <MeetText variant="caption" color={colors.textSecondary}>
                  🎙 {t().record}
                </MeetText>
              </View>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export function MeetingsScreen({
  onOpenMeeting,
  onOpenPaywall,
}: {
  onOpenMeeting: (id: string) => void;
  onOpenPaywall: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { meetings, isPro, meetingsThisMonth } = useMeetBrief();
  const [query, setQuery] = useState('');
  const strings = t();

  const filtered = meetings.filter((m) =>
    m.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Screen>
      <View style={{ gap: spacing.md, paddingTop: spacing.sm }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <MeetText variant="h1">{strings.meetings}</MeetText>
          {!isPro && (
            <Pressable onPress={onOpenPaywall} android_ripple={{ color: colors.overlay }}>
              <MeetText variant="caption" color={colors.accent}>
                {meetingsThisMonth}/5 {strings.free}
              </MeetText>
            </Pressable>
          )}
        </View>

        <TextInput
          accessibilityLabel={strings.searchPlaceholder}
          placeholder={strings.searchPlaceholder}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: radii.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            fontSize: 16,
            color: colors.textPrimary,
            minHeight: 48,
          }}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon="🎙️"
            title={meetings.length === 0 ? strings.emptyTitle : strings.searchPlaceholder}
            body={meetings.length === 0 ? strings.emptyBody : ''}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(m) => m.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            renderItem={({ item }) => (
              <MeetingRow meeting={item} onOpen={() => onOpenMeeting(item.id)} />
            )}
          />
        )}
      </View>
    </Screen>
  );
}
