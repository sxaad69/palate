import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import { SYMPTOMS, diagnose, type Urgency } from '../lib/doctor';

// Plant Doctor: pick symptoms → rule-based diagnosis with treatment.
// The "disease ID" wedge, with zero inference cost.
export function DoctorScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, language } = useApp();
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [ran, setRan] = useState(false);

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setRan(false);
  };

  const results = ran ? diagnose([...picked]) : [];

  const urgencyLabel = (u: Urgency) =>
    u === 'high' ? t.urgencyHigh : u === 'medium' ? t.urgencyMedium : t.urgencyLow;
  const urgencyColor = (u: Urgency): 'danger' | 'warning' | 'success' =>
    u === 'high' ? 'danger' : u === 'medium' ? 'warning' : 'success';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.xs }}>
          🩺 {t.doctorTitle}
        </Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {t.doctorSubtitle}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {SYMPTOMS.map((s) => {
            const selected = picked.has(s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => toggle(s.id)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.full,
                  backgroundColor: selected ? colors.accent : colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? colors.accent : colors.border,
                  minHeight: 48,
                  justifyContent: 'center',
                }}
              >
                <Text variant="bodySmall" color={selected ? 'textInverse' : 'textPrimary'}>
                  {language === 'ar' ? s.ar : s.en}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button
          title={t.diagnose}
          disabled={picked.size === 0}
          onPress={() => setRan(true)}
        />

        {ran && (
          <View style={{ marginTop: spacing.lg }}>
            <Text variant="h3" style={{ marginBottom: spacing.sm }}>{t.diagnosis}</Text>
            {results.length === 0 && (
              <Card>
                <Text variant="bodySmall" color="textSecondary">{t.noDiagnosis}</Text>
              </Card>
            )}
            {results.map((d) => (
              <Card key={d.id} style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                  <Text variant="h3">{language === 'ar' ? d.titleAr : d.titleEn}</Text>
                  <Text variant="caption" color={urgencyColor(d.urgency)}>
                    {urgencyLabel(d.urgency)}
                  </Text>
                </View>
                <Text variant="bodySmall" color="textSecondary">
                  {t.cause}: {language === 'ar' ? d.causeAr : d.causeEn}
                </Text>
                <Text variant="body" style={{ marginTop: spacing.xs }}>
                  {t.treatment}: {language === 'ar' ? d.treatmentAr : d.treatmentEn}
                </Text>
              </Card>
            ))}
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
