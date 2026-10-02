import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import type { Language } from '../lib/strings';

export function ProfileScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { setColorScheme, preference } = useTheme();
  const {
    t, language, setLanguage, isPro, babyName, setBabyName,
    useMetric, setUseMetric, use24h, setUse24h,
    familyCode, setFamilyCode,
  } = useApp();
  const navigation = useNavigation<any>();
  const [name, setName] = useState(babyName);
  const [code, setCode] = useState(familyCode);

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
      }}
    >
      <Text variant="body">{label}</Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>{children}</View>
    </View>
  );

  const Segment = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: radii.full,
        backgroundColor: selected ? colors.accent : colors.surfaceAlt,
      }}
    >
      <Text variant="bodySmall" color={selected ? 'textInverse' : 'textPrimary'}>
        {label}
      </Text>
    </Pressable>
  );

  const appearanceOptions: { label: string; value: ColorSchemePreference }[] = [
    { label: language === 'ar' ? 'تلقائي' : 'System', value: 'system' },
    { label: language === 'ar' ? 'فاتح' : 'Light', value: 'light' },
    { label: language === 'ar' ? 'داكن' : 'Dark', value: 'dark' },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.profile}
        </Text>

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.babyName}</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t.babyNamePlaceholder}
            placeholderTextColor={colors.textTertiary}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radii.md,
              paddingHorizontal: spacing.md,
              minHeight: 48,
              color: colors.textPrimary,
              ...typography.body,
            }}
            accessibilityLabel={t.babyName}
          />
          <Button title={t.save} onPress={() => setBabyName(name.trim())} />
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <Text variant="body" style={{ marginBottom: spacing.xs }}>{t.familySync}</Text>
          <Text variant="caption" color="textSecondary" style={{ marginBottom: spacing.sm }}>
            {t.familySyncHint}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <TextInput
              value={code}
              onChangeText={(v) => setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="FAMILY1"
              autoCapitalize="characters"
              placeholderTextColor={colors.textTertiary}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radii.md,
                paddingHorizontal: spacing.md,
                minHeight: 48,
                color: colors.textPrimary,
                ...typography.body,
              }}
              accessibilityLabel={t.familySync}
            />
            <Button title={t.setCode} onPress={() => setFamilyCode(code)} />
          </View>
        </Card>

        <View style={{ marginTop: spacing.sm }}>
          <Row label={t.language}>
            <Segment label="EN" selected={language === 'en'} onPress={() => setLanguage('en' as Language)} />
            <Segment label="ع" selected={language === 'ar'} onPress={() => setLanguage('ar' as Language)} />
          </Row>
          <Row label={t.appearance}>
            {appearanceOptions.map((o) => (
              <Segment
                key={o.value}
                label={o.label}
                selected={preference === o.value}
                onPress={() => setColorScheme(o.value)}
              />
            ))}
          </Row>
          <Row label={t.units}>
            <Segment label={t.ml} selected={useMetric} onPress={() => setUseMetric(true)} />
            <Segment label={t.oz} selected={!useMetric} onPress={() => setUseMetric(false)} />
          </Row>
          <Row label={t.use24h}>
            <Segment label={use24h ? '✓' : '—'} selected={use24h} onPress={() => setUse24h(!use24h)} />
          </Row>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {isPro ? (
            <Card style={{ alignItems: 'center' }}>
              <Text variant="body" color="accent">{t.proActive}</Text>
            </Card>
          ) : (
            <Button title={t.goPro} onPress={() => navigation.navigate('Paywall')} />
          )}
        </View>

        <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.lg, textAlign: 'center' }}>
          {t.nightNote}
        </Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
