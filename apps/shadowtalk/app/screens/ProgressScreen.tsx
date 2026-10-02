import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { useShadow } from '../store/app';
import { PACKS, type PackId } from '../data/phrases';
import { Screen } from '../components/Screen';
import { EchoText } from '../components/EchoText';
import { Card } from '../components/Card';

const PACK_NAMES: Record<PackId, (s: ReturnType<typeof t>) => string> = {
  travel: (s) => s.packTravel,
  work: (s) => s.packWork,
  daily: (s) => s.packDaily,
  arabic: (s) => s.packArabic,
};

function Stat({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <EchoText variant="h1">{value}</EchoText>
      <EchoText variant="caption" color={colors.textSecondary}>
        {label}
      </EchoText>
    </View>
  );
}

export function ProgressScreen() {
  const { colors, spacing, radii } = useTheme();
  const { streak, phrasesCompleted, starsEarned, packProgress } = useShadow();
  const s = t();

  return (
    <Screen>
      <Card style={{ marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.lg }}>
        <EchoText variant="display">🔥</EchoText>
        <EchoText variant="h1" style={{ marginTop: spacing.sm }}>
          {streak}
        </EchoText>
        <EchoText variant="body" color={colors.textSecondary}>
          {s.dayStreak}
        </EchoText>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <View style={{ flexDirection: 'row' }}>
          <Stat value={String(phrasesCompleted)} label={`${s.phrases} ${s.completed}`} />
          <Stat value={String(starsEarned)} label={s.stars} />
        </View>
      </Card>

      <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
        {PACKS.map((pack) => {
          const { done, total } = packProgress(pack.id);
          return (
            <View key={pack.id}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing.xs,
                }}
              >
                <EchoText variant="body">
                  {pack.icon} {PACK_NAMES[pack.id](s)}
                </EchoText>
                <EchoText variant="bodySmall" color={colors.textSecondary}>
                  {done}/{total}
                </EchoText>
              </View>
              <View
                style={{
                  height: 8,
                  borderRadius: radii.full,
                  backgroundColor: colors.border,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: `${total ? (done / total) * 100 : 0}%`,
                    backgroundColor: colors.accent,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
