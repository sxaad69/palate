import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { t } from '../lib/i18n';
import { useShadow } from '../store/app';
import { PACKS, freePackFor, type Pack, type PackId } from '../data/phrases';
import { Screen } from '../components/Screen';
import { EchoText } from '../components/EchoText';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const PACK_NAMES: Record<PackId, (s: ReturnType<typeof t>) => string> = {
  travel: (s) => s.packTravel,
  work: (s) => s.packWork,
  daily: (s) => s.packDaily,
  arabic: (s) => s.packArabic,
};

export function PacksScreen({
  onOpenPack,
  onPaywall,
}: {
  onOpenPack: (pack: PackId) => void;
  onPaywall: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { direction, isPro, packProgress } = useShadow();
  const s = t();
  const freePack = freePackFor(direction);

  return (
    <Screen>
      <View style={{ gap: spacing.sm, marginBottom: spacing.md, marginTop: spacing.sm }}>
        <EchoText variant="h1">{s.appName}</EchoText>
        <EchoText variant="bodySmall" color={colors.textSecondary}>
          {s.tagline}
        </EchoText>
      </View>

      <View style={{ gap: spacing.md }}>
        {PACKS.map((pack: Pack) => {
          const locked = !isPro && pack.id !== freePack;
          const { done, total } = packProgress(pack.id);
          return (
            <Card
              key={pack.id}
              onPress={() => (locked ? onPaywall() : onOpenPack(pack.id))}
              accessibilityLabel={`${PACK_NAMES[pack.id](s)}${locked ? ` ${s.locked}` : ''}`}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: radii.md,
                    backgroundColor: colors.accentMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EchoText variant="h1">{pack.icon}</EchoText>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <EchoText variant="h3">{PACK_NAMES[pack.id](s)}</EchoText>
                    {locked && (
                      <View
                        style={{
                          backgroundColor: colors.deep,
                          borderRadius: radii.full,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 2,
                        }}
                      >
                        <EchoText variant="caption" color={colors.textInverse}>
                          {s.locked}
                        </EchoText>
                      </View>
                    )}
                  </View>
                  <EchoText variant="caption" color={colors.textTertiary} style={{ marginTop: 2 }}>
                    {done} {s.ofPhrases} {total} {s.phrases} {s.completed}
                  </EchoText>
                  <View
                    style={{
                      height: 6,
                      borderRadius: radii.full,
                      backgroundColor: colors.border,
                      marginTop: spacing.xs,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: 6,
                        borderRadius: radii.full,
                        width: `${total ? (done / total) * 100 : 0}%`,
                        backgroundColor: colors.accent,
                      }}
                    />
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {!isPro && (
        <View style={{ marginTop: spacing.lg }}>
          <Button title={s.goPro} variant="secondary" onPress={onPaywall} />
        </View>
      )}
    </Screen>
  );
}
