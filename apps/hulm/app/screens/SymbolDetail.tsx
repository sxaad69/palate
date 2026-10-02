import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { SYMBOLS } from '../data/symbols';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

// One symbol, fully unpacked: themes, reflection questions, and the
// traditional association — labeled as tradition, never as ruling.
export default function SymbolDetailScreen({
  symbolId,
  onBack,
}: {
  symbolId: string;
  onBack: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const s = SYMBOLS.find((x) => x.id === symbolId);
  const rtl = t.dir === 'rtl';

  if (!s) {
    return (
      <Screen padded>
        <Button title={t.cancel} onPress={onBack} variant="ghost" />
      </Screen>
    );
  }

  const prompts = rtl ? s.promptsAr : s.prompts;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable onPress={onBack}>
          <Text variant="body" style={{ color: colors.accent }}>‹ {t.symbols}</Text>
        </Pressable>
        <Text variant="display">{rtl ? s.ar : s.en}</Text>

        <Card>
          <Text variant="h3">{t.themes}</Text>
          <Text variant="body" style={{ color: colors.textSecondary }}>
            {rtl ? s.themesAr : s.themes}
          </Text>
        </Card>

        <Text variant="h3">{t.reflectOn}</Text>
        {prompts.map((p) => (
          <Card key={p} tone="action">
            <Text variant="body">❝ {p} ❞</Text>
          </Card>
        ))}

        <Card>
          <Text variant="h3">{t.traditionalNote}</Text>
          <Text variant="body" style={{ color: colors.textSecondary }}>
            {rtl ? s.traditionalAr : s.traditional}
          </Text>
          <Text variant="caption" style={{ color: colors.textTertiary, marginTop: spacing.sm }}>
            {t.traditionLabel}
          </Text>
        </Card>

        <Card tone="action">
          <Text variant="caption" align="center" style={{ color: colors.textSecondary }}>
            {t.disclaimerShort}
          </Text>
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
});
