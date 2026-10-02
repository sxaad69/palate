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

export function InsightsScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, pieces, outfits, isPro } = useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = t();

  if (!isPro) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MFText variant="display">📊</MFText>
          <MFText variant="h2" style={{ marginTop: spacing.md, textAlign: 'center' }}>
            {s.insightsLockedTitle}
          </MFText>
          <MFText
            variant="bodySmall"
            color={colors.textSecondary}
            style={{ marginTop: spacing.sm, textAlign: 'center' }}
          >
            {s.insightsLockedDesc}
          </MFText>
          <Button title={s.upgrade} onPress={() => nav.navigate('Paywall')} style={{ marginTop: spacing.lg }} />
        </View>
      </Screen>
    );
  }

  const mostWorn = [...pieces].sort((a, b) => b.wearCount - a.wearCount).filter((p) => p.wearCount > 0).slice(0, 5);
  const neverWorn = pieces.filter((p) => p.wearCount === 0);

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.md }}>
        {s.insightsTitle}
      </MFText>

      <View
        style={{
          backgroundColor: colors.accentMuted,
          borderRadius: radii.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          alignItems: 'center',
        }}
      >
        <MFText variant="overline" color={colors.accent}>
          {s.capsuleTitle}
        </MFText>
        <MFText variant="display" color={colors.accent} style={{ marginTop: spacing.xs }}>
          {pieces.length} · {outfits.length}
        </MFText>
        <MFText variant="bodySmall" color={colors.textSecondary}>
          {pieces.length} {s.piecesLabel} → {outfits.length} {s.outfitsLabel}
        </MFText>
      </View>

      <MFText variant="h2" style={{ marginBottom: spacing.sm }}>
        {s.mostWorn}
      </MFText>
      {mostWorn.length === 0 ? (
        <MFText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.lg }}>
          {s.noWears}
        </MFText>
      ) : (
        mostWorn.map((p, i) => (
          <View
            key={p.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              marginBottom: spacing.sm,
            }}
          >
            <MFText variant="h2" color={colors.accent} style={{ width: 32 }}>
              {i + 1}
            </MFText>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: p.colorHex,
                marginEnd: spacing.sm,
              }}
            />
            <View style={{ flex: 1 }}>
              <MFText variant="bodySmall">{p.name[lang]}</MFText>
              <MFText variant="caption" color={colors.textSecondary}>
                {p.wearCount} {s.wears}
              </MFText>
            </View>
          </View>
        ))
      )}

      <MFText variant="h2" style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
        {s.neverWorn} ({neverWorn.length})
      </MFText>
      {neverWorn.map((p) => (
        <View
          key={p.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: p.colorHex,
              marginEnd: spacing.sm,
            }}
          />
          <MFText variant="bodySmall" style={{ flex: 1 }}>
            {p.name[lang]}
          </MFText>
          <MFText variant="caption" color={colors.textSecondary}>
            {s[`cat_${p.category}`]}
          </MFText>
        </View>
      ))}
    </Screen>
  );
}
