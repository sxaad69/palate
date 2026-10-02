import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { PRESETS } from '../data/presets';

// Wedge-first preset browser. Tapping a preset selects it for the next fast.
export function PresetsScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language, presetId, setPresetId, activeFast } = useApp();

  const wedgeBadge = (w: NonNullable<(typeof PRESETS)[number]['wedge']>): string => {
    if (language === 'ar') {
      return w === 'ramadan' ? 'رمضان' : w === 'night-shift' ? 'وردية ليلية' : 'لطيف';
    }
    return w === 'ramadan' ? 'Ramadan' : w === 'night-shift' ? 'Night shift' : 'Gentle';
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          {t.presets}
        </Text>
        {activeFast && (
          <Text variant="caption" color="textTertiary" style={{ marginBottom: spacing.sm }}>
            {language === 'ar'
              ? 'تُطبَّق الخطة المختارة على الصيام القادم.'
              : 'The selected preset applies to your next fast.'}
          </Text>
        )}
        {PRESETS.map((p) => {
          const selected = presetId === p.id;
          return (
            <Pressable key={p.id} onPress={() => setPresetId(p.id)} accessibilityRole="button" accessibilityState={{ selected }}>
              <Card
                style={{
                  marginBottom: spacing.sm,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? colors.accent : colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text variant="h3">{language === 'ar' ? p.nameAr : p.nameEn}</Text>
                  {p.wedge && (
                    <View style={{ backgroundColor: colors.accentMuted, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                      <Text variant="caption" color="accent">{wedgeBadge(p.wedge)}</Text>
                    </View>
                  )}
                </View>
                <Text variant="bodySmall" color="textSecondary" style={{ marginTop: spacing.xs }}>
                  {p.fastHours}{t.hours} {t.fastingWindow} · {p.eatHours}{t.hours} {t.eatingWindow}
                </Text>
                <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.xs }}>
                  {language === 'ar' ? p.descAr : p.descEn}
                </Text>
                {p.wedge === 'ramadan' && (
                  <Text variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
                    {t.ramadanNote}
                  </Text>
                )}
              </Card>
            </Pressable>
          );
        })}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
