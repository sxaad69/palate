import React, { useEffect, useState } from 'react';
import { Pressable, Share, StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { RestoryText } from '../components/RestoryText';
import { Button } from '../components/Button';
import { TimeStepper } from '../components/TimeStepper';
import { useRestory } from '../store/app';
import { t } from '../lib/i18n';
import { entriesToCsv } from '../lib/insights';
import { disableBedtimeReminder, enableBedtimeReminder } from '../lib/notifications';
import { PaywallScreen } from './PaywallScreen';

const DEFAULT_REMINDER = '21:30';

export function ProfileScreen() {
  const { colors, spacing, radii, themeMode, setThemeMode, isDark } = useTheme();
  const { lang, setLanguage, reminderTime, setReminderTime, entries, isPro } = useRestory();
  const [showPaywall, setShowPaywall] = useState(false);
  const [reminderDenied, setReminderDenied] = useState(false);
  const s = t();

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  const reminderOn = reminderTime !== null;

  // Re-apply the daily nudge on launch (silent when permission already granted).
  useEffect(() => {
    if (reminderTime) void enableBedtimeReminder(reminderTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleReminder = async (on: boolean) => {
    if (on) {
      const time = reminderTime ?? DEFAULT_REMINDER;
      const ok = await enableBedtimeReminder(time);
      if (ok) {
        setReminderDenied(false);
        setReminderTime(time);
      } else {
        setReminderDenied(true);
      }
    } else {
      await disableBedtimeReminder();
      setReminderTime(null);
    }
  };

  const changeReminderTime = (v: string) => {
    setReminderTime(v);
    void enableBedtimeReminder(v);
  };

  const exportCsv = async () => {
    const csv = entriesToCsv(entries);
    try {
      await Share.share({ message: csv, title: 'Restory' });
    } catch {
      // user dismissed — nothing to do
    }
  };

  const section = (label: string) => (
    <RestoryText
      variant="overline"
      color={colors.textTertiary}
      style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}
    >
      {label}
    </RestoryText>
  );

  return (
    <Screen>
      <RestoryText variant="h1" style={{ marginTop: spacing.md }}>
        {s.profile}
      </RestoryText>

      {section(s.appearance)}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {(['system', 'light', 'dark'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setThemeMode(m)}
            accessibilityRole="button"
            accessibilityState={{ selected: themeMode === m }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <RestoryText variant="body">
              {m === 'system' ? s.system : m === 'light' ? s.light : s.dark}
            </RestoryText>
            <RestoryText variant="body" color={colors.accent}>
              {themeMode === m ? '●' : '○'}
            </RestoryText>
          </Pressable>
        ))}
      </View>

      {section(s.language)}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg }]}>
        {(['en', 'ar'] as const).map((l) => (
          <Pressable
            key={l}
            onPress={() => setLanguage(l)}
            accessibilityRole="button"
            accessibilityState={{ selected: lang === l }}
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            <RestoryText variant="body">{l === 'en' ? 'English' : 'العربية'}</RestoryText>
            <RestoryText variant="body" color={colors.accent}>
              {lang === l ? '●' : '○'}
            </RestoryText>
          </Pressable>
        ))}
      </View>

      {section(s.bedtimeReminder)}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md }]}>
        <View style={[styles.row, { borderBottomWidth: 0, padding: 0 }]}>
          <View style={{ flex: 1 }}>
            <RestoryText variant="body">{s.bedtimeReminder}</RestoryText>
            <RestoryText variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
              {s.reminderDesc}
            </RestoryText>
          </View>
          <Switch
            value={reminderOn}
            onValueChange={(v) => void toggleReminder(v)}
            trackColor={{ true: colors.accent, false: colors.borderStrong }}
            accessibilityLabel={s.bedtimeReminder}
          />
        </View>
        {reminderOn ? (
          <View style={{ marginTop: spacing.md }}>
            <TimeStepper
              label={s.reminderTime}
              value={reminderTime ?? DEFAULT_REMINDER}
              onChange={changeReminderTime}
            />
          </View>
        ) : null}
        {reminderDenied ? (
          <RestoryText variant="caption" color={colors.danger} style={{ marginTop: spacing.sm }}>
            {lang === 'ar'
              ? 'تعذّر الحصول على إذن الإشعارات. فعّله من إعدادات النظام.'
              : 'Notification permission was not granted. Enable it in system settings.'}
          </RestoryText>
        ) : null}
      </View>

      {section(s.exportCsv)}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md }]}>
        <RestoryText variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
          {s.exportHint}
        </RestoryText>
        <Button title={s.exportCsv} variant="secondary" onPress={() => void exportCsv()} />
      </View>

      <View style={{ height: spacing.xl }} />
      {!isPro ? (
        <Button title={s.paywallTitle} onPress={() => setShowPaywall(true)} size="lg" />
      ) : (
        <RestoryText variant="body" color={colors.success} style={{ textAlign: 'center' }}>
          ☾ {s.proMember}
        </RestoryText>
      )}
      <View style={{ height: spacing.md }} />
      <RestoryText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        Restory 1.0.0 · {isDark ? 'twilight' : 'sand'} · {lang}
      </RestoryText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
});
