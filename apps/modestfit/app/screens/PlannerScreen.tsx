import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import type { RootStackParamList } from '../navigation';

export function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function PlannerScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, plan, outfitById, markWorn, isPro } = useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = t();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  if (!isPro) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MFText variant="display">📅</MFText>
          <MFText variant="h2" style={{ marginTop: spacing.md, textAlign: 'center' }}>
            {s.planLockedTitle}
          </MFText>
          <MFText
            variant="bodySmall"
            color={colors.textSecondary}
            style={{ marginTop: spacing.sm, textAlign: 'center' }}
          >
            {s.planLockedDesc}
          </MFText>
          <Button title={s.upgrade} onPress={() => nav.navigate('Paywall')} style={{ marginTop: spacing.lg }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.xs }}>
        {s.plannerTitle}
      </MFText>
      <MFText variant="caption" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
        {s.weatherNote}
      </MFText>
      {days.map((d) => {
        const key = toLocalDateStr(d);
        const entry = plan[key];
        const outfit = entry ? outfitById(entry.outfitId) : undefined;
        return (
          <View
            key={key}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              marginBottom: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ width: 64 }}>
              <MFText variant="h3">
                {d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en', { weekday: 'short' })}
              </MFText>
              <MFText variant="caption" color={colors.textSecondary}>
                {d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en', { day: 'numeric', month: 'short' })}
              </MFText>
            </View>
            <View style={{ flex: 1 }}>
              {outfit ? (
                <>
                  <MFText variant="bodySmall">{outfit.name}</MFText>
                  <MFText variant="caption" color={colors.textSecondary}>
                    {s[`occ_${entry!.occasion}`]}
                  </MFText>
                </>
              ) : (
                <MFText variant="bodySmall" color={colors.textTertiary}>
                  {s.noOutfit}
                </MFText>
              )}
            </View>
            {entry && !entry.worn && outfit ? (
              <Button title={s.markWorn} size="sm" variant="secondary" onPress={() => markWorn(key)} />
            ) : entry?.worn ? (
              <MFText variant="caption" color={colors.success}>
                ✓ {s.worn}
              </MFText>
            ) : (
              <Button
                title={s.pickOutfit}
                size="sm"
                variant="ghost"
                onPress={() => nav.navigate('AssignDay', { date: key })}
              />
            )}
          </View>
        );
      })}
    </Screen>
  );
}
