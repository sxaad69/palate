import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useMeetBrief } from '../store/app';
import { t } from '../lib/i18n';
import { fmtMoney } from '../lib/format';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors, spacing } = useTheme();
  return (
    <Card style={{ flex: 1 }}>
      <View style={{ gap: spacing.xs, alignItems: 'center', paddingVertical: spacing.sm }}>
        <MeetText variant="h1" color={accent ? colors.accent : colors.textPrimary}>
          {value}
        </MeetText>
        <MeetText variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
          {label}
        </MeetText>
      </View>
    </Card>
  );
}

export function StatsScreen() {
  const { spacing } = useTheme();
  const {
    meetings, totalSeconds, totalActionsDone, totalActions, meetingsThisMonth, totalCost, lang,
  } = useMeetBrief();
  const strings = t();

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  return (
    <Screen>
      <View style={{ gap: spacing.md, paddingTop: spacing.sm }}>
        <MeetText variant="h1">{strings.stats}</MeetText>
        {meetings.length === 0 ? (
          <EmptyState icon="📊" title={strings.stats} body={strings.statsEmpty} />
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <StatCard label={strings.meetingsRecorded} value={String(meetings.length)} accent />
              <StatCard label={strings.hoursRecorded} value={`${hours}h ${mins}m`} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <StatCard
                label={strings.actionsCompleted}
                value={`${totalActionsDone}/${totalActions}`}
                accent
              />
              <StatCard label={strings.thisMonth} value={String(meetingsThisMonth)} />
            </View>
            {totalCost > 0 && (
              <StatCard label={strings.trackedCost} value={fmtMoney(totalCost, lang)} />
            )}
          </>
        )}
      </View>
    </Screen>
  );
}
