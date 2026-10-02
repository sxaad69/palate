import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';

// Single-scroll onboarding: baby name + units. ponytail: no date picker v1
// (birth date is nice-to-have; age-based guidance is post-launch).
export function OnboardingScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { t, babyName, setBabyName, useMetric, setUseMetric, use24h, setUse24h, setOnboarded } = useApp();
  const [name, setName] = useState(babyName);

  const inputStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    color: colors.textPrimary,
    ...typography.body,
  };

  const Seg = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.full,
        backgroundColor: selected ? colors.accent : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.accent : colors.border,
        minHeight: 48,
        justifyContent: 'center',
      }}
    >
      <Text variant="body" color={selected ? 'textInverse' : 'textPrimary'}>{label}</Text>
    </Pressable>
  );

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg }}>
          {/* Brand mark: crescent moon */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radii.full,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
            accessibilityRole="image"
            accessibilityLabel="Naplet"
          >
            <View style={{ width: 34, height: 34, borderRadius: radii.full, backgroundColor: colors.textInverse }} />
            <View
              style={{
                position: 'absolute',
                width: 28,
                height: 28,
                borderRadius: radii.full,
                backgroundColor: colors.accent,
                marginStart: 12,
                marginBottom: 10,
              }}
            />
          </View>
          <Text variant="h1">{t.onboardingTitle}</Text>
          <Text variant="bodySmall" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {t.onboardingSubtitle}
          </Text>
        </View>

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.babyName}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.babyNamePlaceholder}
          placeholderTextColor={colors.textTertiary}
          style={[inputStyle, { marginBottom: spacing.lg }]}
          accessibilityLabel={t.babyName}
        />

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.units}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Seg label={t.ml} selected={useMetric} onPress={() => setUseMetric(true)} />
          <Seg label={t.oz} selected={!useMetric} onPress={() => setUseMetric(false)} />
        </View>

        <View style={{ marginBottom: spacing.lg }}>
          <Pressable
            onPress={() => setUse24h(!use24h)}
            accessibilityRole="switch"
            accessibilityState={{ checked: use24h }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48 }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: use24h ? colors.accent : colors.surface,
                borderWidth: 1,
                borderColor: use24h ? colors.accent : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {use24h && <Text variant="caption" color="textInverse">✓</Text>}
            </View>
            <Text variant="body">{t.use24h}</Text>
          </Pressable>
        </View>

        <Button
          title={t.continue}
          onPress={() => {
            setBabyName(name.trim());
            setOnboarded(true);
          }}
        />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
