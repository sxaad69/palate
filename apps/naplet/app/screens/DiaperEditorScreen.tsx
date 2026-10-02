import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import type { DiaperType } from '../lib/baby';

// Quick diaper editor: one tap, done.
export function DiaperEditorScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, addDiaper } = useApp();
  const navigation = useNavigation<any>();
  const [type, setType] = useState<DiaperType>('wet');

  const options: { label: string; value: DiaperType }[] = [
    { label: t.wet, value: 'wet' },
    { label: t.dirty, value: 'dirty' },
    { label: t.mixed, value: 'mixed' },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
          🩲 {t.logDiaper}
        </Text>
        {options.map((o) => {
          const selected = type === o.value;
          return (
            <Pressable
              key={o.value}
              onPress={() => setType(o.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{
                backgroundColor: selected ? colors.accent : colors.surface,
                borderWidth: 2,
                borderColor: selected ? colors.accent : colors.border,
                borderRadius: radii.xl,
                minHeight: 88,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Text variant="h2" color={selected ? 'textInverse' : 'textPrimary'}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
        <View style={{ marginTop: spacing.sm }}>
          <Button
            title={t.save}
            onPress={() => {
              addDiaper({ diaperType: type });
              navigation.goBack();
            }}
          />
        </View>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
