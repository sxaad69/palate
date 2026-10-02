import React from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Toggle } from '../components/Toggle';
import { usePosture } from '../store/app';
import { ensureNotifPermission } from '../lib/notifications';
import { getLang, t, type Lang } from '../lib/i18n';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function Segment<T extends string | number>({
  options,
  value,
  onPick,
}: {
  options: { value: T; label: string }[];
  value: T;
  onPick: (v: T) => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onPick(o.value)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: radii.full,
              alignItems: 'center',
              backgroundColor: active ? colors.accent : colors.surfaceAlt,
            }}
          >
            <PostureText variant="bodySmall" color={active ? colors.textInverse : colors.textPrimary}>
              {o.label}
            </PostureText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ProfileScreen() {
  const { colors, spacing, themeMode, setThemeMode } = useTheme();
  const nav = useNavigation<Nav>();
  const {
    setLanguage,
    reminders,
    setReminders,
    isPro,
    setThemeMode: setStoredThemeMode,
  } = usePosture();
  const s = t();

  const changeTheme = (m: ThemeMode) => {
    setThemeMode(m);
    setStoredThemeMode(m);
  };

  const toggleReminders = async (v: boolean) => {
    if (v) {
      const ok = await ensureNotifPermission();
      if (!ok) return;
    }
    setReminders({ ...reminders, enabled: v });
  };

  return (
    <Screen>
      <View style={{ height: spacing.md }} />
      <PostureText variant="h1">{s.profile}</PostureText>
      <View style={{ height: spacing.md }} />

      {!isPro && (
        <Pressable onPress={() => nav.navigate('Paywall')} accessibilityRole="button">
          <Card style={{ marginBottom: spacing.md, borderColor: colors.accent, borderWidth: 2 }}>
            <PostureText variant="h3" color={colors.accent}>
              {s.paywallEntry}
            </PostureText>
            <PostureText variant="bodySmall" color={colors.textSecondary}>
              {s.paywallEntryBody}
            </PostureText>
          </Card>
        </Pressable>
      )}

      <Card style={{ marginBottom: spacing.md }}>
        <PostureText variant="h3" style={{ marginBottom: spacing.sm }}>
          {s.appearance}
        </PostureText>
        <Segment<ThemeMode>
          options={[
            { value: 'light', label: s.appearanceLight },
            { value: 'dark', label: s.appearanceDark },
            { value: 'system', label: s.appearanceSystem },
          ]}
          value={themeMode}
          onPick={changeTheme}
        />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <PostureText variant="h3" style={{ marginBottom: spacing.sm }}>
          {s.language}
        </PostureText>
        <Segment<Lang>
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'العربية' },
          ]}
          value={getLang()}
          onPick={(l) => setLanguage(l)}
        />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginEnd: spacing.md }}>
            <PostureText variant="h3">{s.reminders}</PostureText>
            <PostureText variant="bodySmall" color={colors.textSecondary}>
              {s.remindersBody}
            </PostureText>
          </View>
          <Toggle value={reminders.enabled} onChange={toggleReminders} accessibilityLabel={s.reminders} />
        </View>
        {reminders.enabled && (
          <View style={{ marginTop: spacing.md }}>
            <PostureText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
              {s.reminderInterval}
            </PostureText>
            <Segment<30 | 60 | 120>
              options={[
                { value: 30, label: s.interval30 },
                { value: 60, label: s.interval60 },
                { value: 120, label: s.interval120 },
              ]}
              value={reminders.intervalMin}
              onPick={(v) => setReminders({ enabled: true, intervalMin: v })}
            />
          </View>
        )}
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <PostureText variant="h3" style={{ marginBottom: spacing.sm }}>
          {s.howItWorks}
        </PostureText>
        {[s.ob5B1, s.ob5B2, s.ob5B3, s.ob5B4].map((b, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
            <PostureText variant="bodySmall" color={colors.accent}>{`${i + 1}. `}</PostureText>
            <PostureText variant="bodySmall" color={colors.textSecondary} style={{ flex: 1 }}>
              {b}
            </PostureText>
          </View>
        ))}
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <PostureText variant="h3" style={{ marginBottom: spacing.sm }}>
          {s.medicalTitle}
        </PostureText>
        <PostureText variant="bodySmall" color={colors.textSecondary}>
          {s.medicalBody}
        </PostureText>
      </Card>

      <PostureText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
        {s.appVersion}
      </PostureText>
    </Screen>
  );
}
