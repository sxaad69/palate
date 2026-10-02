import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useKeeps } from '../store/app';
import { daysLabel, t } from '../lib/i18n';
import { daysLeft, wasteRisk, type PantryItem } from '../store/types';
import { requestReminderPermission } from '../lib/notifications';

function RiskRow({ item, rank }: { item: PantryItem; rank: number }) {
  const { colors, spacing } = useTheme();
  const { markUsed } = useKeeps();
  const d = daysLeft(item.expiry);
  const score = wasteRisk(item);
  const why =
    d <= 0
      ? t().expired
      : d === 1
        ? t().expiresTomorrow
        : `${daysLabel(d)} · ×${item.qty}`;

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={styles.row}>
        <View style={[styles.rank, { backgroundColor: colors.accentMuted }]}>
          <KText variant="h3" color={colors.accent}>
            {rank}
          </KText>
        </View>
        <View style={{ flex: 1 }}>
          <KText variant="h3">{item.name}</KText>
          <KText variant="caption" color={colors.textSecondary}>
            {why}
          </KText>
        </View>
        <Button title={t().markUsed} size="sm" variant="secondary" onPress={() => markUsed(item.id)} />
      </View>
      <KText variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.xs }}>
        {score >= 20 ? '🔴' : score >= 8 ? '🟠' : '🟢'} {t().risk} {score.toFixed(1)}
      </KText>
    </Card>
  );
}

export function AlertsScreen() {
  const { colors, spacing } = useTheme();
  const { alertQueue, reminders, setReminders } = useKeeps();

  const toggle = async (v: boolean) => {
    if (v) {
      const granted = await requestReminderPermission();
      setReminders(granted);
    } else {
      setReminders(false);
    }
  };

  return (
    <Screen>
      <KText variant="h1" style={{ marginTop: spacing.md }}>
        {t().alertsTitle}
      </KText>
      <KText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
        {t().alertsBody}
      </KText>

      <Card style={{ marginTop: spacing.md }}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <KText variant="body">{t().reminders}</KText>
            <KText variant="caption" color={colors.textSecondary}>
              {reminders ? t().remindersOn : t().remindersOff}
            </KText>
          </View>
          <Switch
            value={reminders}
            onValueChange={toggle}
            accessibilityLabel={t().reminders}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </View>
      </Card>

      <View style={{ marginTop: spacing.md }}>
        {alertQueue.length === 0 ? (
          <View style={styles.empty}>
            <KText variant="display">✅</KText>
            <KText variant="body" color={colors.textSecondary} style={styles.emptyText}>
              {t().noAlerts}
            </KText>
          </View>
        ) : (
          alertQueue.map((it, i) => <RiskRow key={it.id} item={it} rank={i + 1} />)
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rank: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { alignItems: 'center', marginTop: 32 },
  emptyText: { textAlign: 'center', marginTop: 8, maxWidth: 280 },
});
