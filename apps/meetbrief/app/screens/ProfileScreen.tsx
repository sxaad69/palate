import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { useMeetBrief } from '../store/app';
import { t, type Lang } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MeetText } from '../components/MeetText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function Segmented<T extends string>({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onPick: (v: T) => void;
}) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      <MeetText variant="overline" color={colors.textSecondary}>
        {label}
      </MeetText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onPick(o.value)}
              android_ripple={{ color: colors.overlay }}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: radii.full,
                backgroundColor: active ? colors.accent : colors.surfaceAlt,
                alignItems: 'center',
                minHeight: 44,
                justifyContent: 'center',
              }}
            >
              <MeetText
                variant="bodySmall"
                color={active ? colors.textInverse : colors.textSecondary}
              >
                {o.label}
              </MeetText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ProfileScreen({ onOpenPaywall }: { onOpenPaywall: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const {
    lang, setLanguage, themeMode, setThemeMode, defaultRate, setDefaultRate, isPro,
  } = useMeetBrief();
  const [rateDraft, setRateDraft] = useState<string | null>(null);
  const strings = t();

  const commitRate = () => {
    if (rateDraft !== null) {
      const v = parseFloat(rateDraft.replace(',', '.'));
      setDefaultRate(Number.isFinite(v) && v > 0 ? v : 0);
      setRateDraft(null);
    }
  };

  return (
    <Screen>
      <View style={{ gap: spacing.lg, paddingTop: spacing.sm }}>
        <MeetText variant="h1">{strings.profile}</MeetText>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <MeetText variant="h3">{strings.plan}</MeetText>
              <MeetText variant="bodySmall" color={colors.textSecondary}>
                {isPro ? strings.proPlan : strings.freePlan}
              </MeetText>
            </View>
            {!isPro && <Button title={strings.upgrade} onPress={onOpenPaywall} size="sm" />}
          </View>
        </Card>

        <Segmented<ThemeMode>
          label={strings.appearance}
          value={themeMode}
          onPick={setThemeMode}
          options={[
            { value: 'light', label: strings.themeLight },
            { value: 'dark', label: strings.themeDark },
            { value: 'system', label: strings.themeSystem },
          ]}
        />

        <Segmented<Lang>
          label={strings.language}
          value={lang}
          onPick={setLanguage}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'العربية' },
          ]}
        />

        <View style={{ gap: spacing.xs }}>
          <MeetText variant="overline" color={colors.textSecondary}>
            {strings.defaultRate}
          </MeetText>
          <TextInput
            accessibilityLabel={strings.defaultRate}
            placeholder={strings.ratePlaceholder}
            placeholderTextColor={colors.textTertiary}
            value={rateDraft ?? (defaultRate > 0 ? String(defaultRate) : '')}
            onChangeText={setRateDraft}
            onBlur={commitRate}
            onSubmitEditing={commitRate}
            keyboardType="decimal-pad"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: radii.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              fontSize: 16,
              color: colors.textPrimary,
              minHeight: 48,
            }}
          />
          <MeetText variant="caption" color={colors.textTertiary}>
            {strings.defaultRateHelp}
          </MeetText>
        </View>

        <Card>
          <View style={{ gap: spacing.xs }}>
            <MeetText variant="h3">🔒 {strings.privacyTitle}</MeetText>
            <MeetText variant="bodySmall" color={colors.textSecondary}>
              {strings.privacyBody}
            </MeetText>
          </View>
        </Card>

        <MeetText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
          {strings.appName} · {strings.version} 1.0.0
        </MeetText>
      </View>
    </Screen>
  );
}
