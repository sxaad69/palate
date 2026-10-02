import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme, type ColorSchemePreference } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import type { Language } from '../lib/strings';

export function ProfileScreen() {
  const { colors, spacing, radii } = useTheme();
  const { setColorScheme, preference } = useTheme();
  const { t, language, setLanguage, isPro, stats } = useApp();
  const navigation = useNavigation<any>();

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
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>{children}</View>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.profile}
        </Text>

        <Card style={{ alignItems: 'center', marginBottom: spacing.md }}>
          <Text variant="display" color="accent">{stats.totalWins}</Text>
          <Text variant="bodySmall" color="textSecondary">{t.totalWins}</Text>
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
          {t.foggNote}
        </Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
