import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import {
  eventsForDay,
  formatDuration,
  formatTimeOfDay,
  lastEvent,
  summarizeDay,
  type BabyEvent,
} from '../lib/baby';

// Today: status hero (sleeping? last feed/diaper?) + today's timeline.
// The 3am-friendly quick-log lives on the Log tab.
export function TodayScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, babyName, events, activeSleepId, use24h, deleteEvent } = useApp();

  const today = new Date();
  const summary = summarizeDay(events, today);
  const dayEvents = eventsForDay(events, today);
  const lastSleep = lastEvent(events, 'sleep');
  const lastFeed = lastEvent(events, 'feed');
  const lastDiaper = lastEvent(events, 'diaper');

  const confirmDelete = (id: string) => {
    Alert.alert(t.delete, undefined, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => deleteEvent(id) },
    ]);
  };

  const describe = (e: BabyEvent): string => {
    if (e.kind === 'sleep') {
      const dur = e.end ? formatDuration(e.end - e.start) : t.sleeping;
      return `${dur}`;
    }
    if (e.kind === 'feed') {
      const typeLabel =
        e.feedType === 'breast' ? t.breast : e.feedType === 'bottle' ? t.bottle : t.solid;
      const sideLabel =
        e.side === 'left' ? t.left : e.side === 'right' ? t.right : e.side === 'both' ? t.both : '';
      const amt = e.amountMl != null ? ` · ${e.amountMl} ${t.ml}` : '';
      return `${typeLabel}${sideLabel ? ` (${sideLabel})` : ''}${amt}`;
    }
    return e.diaperType === 'wet' ? t.wet : e.diaperType === 'dirty' ? t.dirty : t.mixed;
  };

  const kindIcon: Record<BabyEvent['kind'], string> = {
    sleep: '🌙',
    feed: '🍼',
    diaper: '🩲',
  };

  const lastLine = (label: string, e: BabyEvent | undefined) =>
    e ? `${label}: ${formatTimeOfDay(e.start, use24h)}` : `${label}: —`;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md }}>
          {babyName || t.today}
        </Text>
        <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.sm }}>
          {today.toLocaleDateString(language === 'ar' ? 'ar' : 'en', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>

        {/* Status hero */}
        <Card style={{ marginBottom: spacing.md, backgroundColor: colors.accentMuted }}>
          {activeSleepId ? (
            <Text variant="h2" color="accent">🌙 {t.sleeping}</Text>
          ) : (
            <View>
              <Text variant="bodySmall" color="textSecondary">{lastLine(t.lastSleep, lastSleep)}</Text>
              <Text variant="bodySmall" color="textSecondary">{lastLine(t.lastFeed, lastFeed)}</Text>
              <Text variant="bodySmall" color="textSecondary">{lastLine(t.lastDiaper, lastDiaper)}</Text>
            </View>
          )}
        </Card>

        {/* Day summary */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          {[
            { label: t.totalSleep, value: formatDuration(summary.sleepMs) },
            { label: t.feedsToday, value: String(summary.feeds) },
            { label: t.diapersToday, value: String(summary.diapers) },
            { label: t.napsToday, value: String(summary.naps) },
          ].map((c) => (
            <Card key={c.label} style={{ flex: 1, alignItems: 'center', paddingVertical: spacing.sm }}>
              <Text variant="body" color="accent">{c.value}</Text>
              <Text variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: 2 }}>
                {c.label}
              </Text>
            </Card>
          ))}
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.timeline}</Text>
        {dayEvents.length === 0 && (
          <Card>
            <Text variant="bodySmall" color="textSecondary">{t.noEvents}</Text>
          </Card>
        )}
        {dayEvents.map((e) => (
          <Pressable key={e.id} onLongPress={() => confirmDelete(e.id)} accessibilityRole="button">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.full,
                  backgroundColor: colors.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginEnd: spacing.md,
                }}
              >
                <Text variant="body">{kindIcon[e.kind]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body">{describe(e)}</Text>
                <Text variant="caption" color="textTertiary">
                  {formatTimeOfDay(e.start, use24h)}
                  {e.note ? ` · ${e.note}` : ''}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
