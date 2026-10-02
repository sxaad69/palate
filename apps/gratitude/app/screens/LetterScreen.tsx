import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Share } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTG, weekStart, weekLabel } from '../store/app';
import { t } from '../lib/i18n';
import { PaywallScreen } from './PaywallScreen';

// A keepsake, not a chart: the week's gratitudes compiled into a readable
// letter, shareable as text. Current week is free; the archive is Pro.
export function LetterScreen() {
  const { colors, spacing } = useTheme();
  const { letterForWeek, weekStarts, entriesThisWeek, isPro, entries } = useTG();
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  if (showPaywall) return <PaywallScreen onClose={() => setShowPaywall(false)} />;

  const current = weekStart(Date.now());
  const letter = letterForWeek(current);
  const past = weekStarts().filter((w) => w !== current);

  const share = (text: string) => {
    void Share.share({ message: text });
  };

  const exportAll = () => {
    const parts = weekStarts().map((w) => letterForWeek(w));
    share(parts.join('\n\n' + '─'.repeat(24) + '\n\n'));
  };

  return (
    <Screen>
      <AppText variant="h1" style={{ marginTop: spacing.md }}>
        {t().letterTitle}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
        {t().letterSub}
      </AppText>

      <Card style={{ padding: spacing.lg, marginTop: spacing.lg }}>
        {entriesThisWeek === 0 ? (
          <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            {t().letterEmpty}
          </AppText>
        ) : (
          <AppText variant="body" style={{ lineHeight: 28 }}>
            {letter}
          </AppText>
        )}
      </Card>

      {entriesThisWeek > 0 && (
        <View style={{ marginTop: spacing.md }}>
          <Button title={t().shareLetter} onPress={() => share(letter)} variant="secondary" />
        </View>
      )}

      <AppText variant="overline" color={colors.textTertiary} style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
        {t().archiveTitle}
      </AppText>

      {past.length === 0 && entries.length === 0 ? null : !isPro ? (
        <Card style={{ padding: spacing.lg }}>
          <AppText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            🔒 {t().lettersLockedNote}
          </AppText>
          <View style={{ height: spacing.md }} />
          <Button title={t().paywallTitle} onPress={() => setShowPaywall(true)} />
        </Card>
      ) : (
        <>
          {past.map((w) => {
            const open = openWeek === w;
            return (
              <Pressable key={w} onPress={() => setOpenWeek(open ? null : w)} style={{ marginBottom: spacing.sm }}>
                <Card style={{ padding: spacing.md }}>
                  <View style={styles.row}>
                    <AppText variant="body" style={{ fontWeight: '600' }}>
                      {t().weekOf} {weekLabel(w)}
                    </AppText>
                    <AppText variant="body" color={colors.textSecondary}>
                      {open ? '▾' : '▸'}
                    </AppText>
                  </View>
                  {open && (
                    <>
                      <AppText variant="body" style={{ marginTop: spacing.sm, lineHeight: 28 }}>
                        {letterForWeek(w)}
                      </AppText>
                      <View style={{ height: spacing.sm }} />
                      <Button
                        title={t().shareLetter}
                        onPress={() => share(letterForWeek(w))}
                        size="sm"
                        variant="secondary"
                      />
                    </>
                  )}
                </Card>
              </Pressable>
            );
          })}
          {isPro && entries.length > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <Button title={t().exportAll} onPress={exportAll} variant="ghost" />
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
