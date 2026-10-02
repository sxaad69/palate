import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useKeeps } from '../store/app';
import { getLang, setLang, t, type Lang } from '../lib/i18n';
import { restorePurchases } from '../lib/billing';
import { requestReminderPermission } from '../lib/notifications';

function Row({ children }: { children: React.ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.row, { marginBottom: spacing.sm }]}>
      {children}
    </View>
  );
}

export function ProfileScreen({ onGoPro }: { onGoPro: () => void }) {
  const { colors, spacing, themeMode } = useTheme();
  const { setTheme, setLanguage, reminders, setReminders, isPro, setPro } = useKeeps();
  const lang = getLang();

  const toggleReminders = async (v: boolean) => {
    if (v) {
      const granted = await requestReminderPermission();
      setReminders(granted);
    } else {
      setReminders(false);
    }
  };

  const restore = async () => {
    await restorePurchases(() => setPro(true));
  };

  const themes: { id: ThemeMode; label: string }[] = [
    { id: 'system', label: t().themeSystem },
    { id: 'light', label: t().themeLight },
    { id: 'dark', label: t().themeDark },
  ];

  return (
    <Screen>
      <KText variant="h1" style={{ marginTop: spacing.md }}>
        {t().profile}
      </KText>

      <Card style={{ marginTop: spacing.md }}>
        <KText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
          {t().appearance}
        </KText>
        <View style={styles.segRow}>
          {themes.map((th) => (
            <Button
              key={th.id}
              title={th.label}
              size="sm"
              variant={themeMode === th.id ? 'primary' : 'ghost'}
              onPress={() => setTheme(th.id)}
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.sm }}>
        <KText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
          {t().language}
        </KText>
        <View style={styles.segRow}>
          {(['en', 'ar'] as Lang[]).map((l) => (
            <Button
              key={l}
              title={l === 'en' ? 'English' : 'العربية'}
              size="sm"
              variant={lang === l ? 'primary' : 'ghost'}
              onPress={() => {
                setLang(l);
                setLanguage(l);
              }}
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.sm }}>
        <Row>
          <View style={{ flex: 1 }}>
            <KText variant="body">{t().notifications}</KText>
            <KText variant="caption" color={colors.textSecondary}>
              {reminders ? t().remindersOn : t().remindersOff}
            </KText>
          </View>
          <Switch
            value={reminders}
            onValueChange={toggleReminders}
            accessibilityLabel={t().notifications}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </Row>
      </Card>

      <Card style={{ marginTop: spacing.sm }}>
        {isPro ? (
          <KText variant="body" color={colors.success}>
            ✓ {t().proActive}
          </KText>
        ) : (
          <Button title={t().unlockPro} onPress={onGoPro} />
        )}
        <Button
          title={t().restorePurchases}
          variant="ghost"
          size="sm"
          onPress={() => void restore()}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      <Card style={{ marginTop: spacing.sm }}>
        <KText variant="h3">{t().aboutTitle}</KText>
        <KText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
          {t().aboutBody}
        </KText>
        <KText variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
          {t().version}
        </KText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  segRow: { flexDirection: 'row', gap: 8 },
});
