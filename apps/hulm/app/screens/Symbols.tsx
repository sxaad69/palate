import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useDreams } from '../store/dreams';
import { SYMBOLS } from '../data/symbols';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';

export default function SymbolsScreen({
  onOpen,
  onPaywall,
}: {
  onOpen: (symbolId: string) => void;
  onPaywall: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { pro } = useDreams();
  const [query, setQuery] = useState('');
  const rtl = t.dir === 'rtl';

  const q = query.trim().toLowerCase();
  const list = SYMBOLS.filter((s) => {
    if (!q) return true;
    return (
      s.en.toLowerCase().includes(q) ||
      s.ar.includes(query.trim()) ||
      s.kw.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text variant="h1">{t.symbols}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          placeholder={t.searchSymbols}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
        {list.map((s) => {
          const locked = !s.free && !pro;
          return (
            <Pressable key={s.id} onPress={() => (locked ? onPaywall() : onOpen(s.id))}>
              <Card style={styles.row}>
                <View style={styles.info}>
                  <Text variant="h3">{rtl ? s.ar : s.en}</Text>
                  <Text variant="caption" style={{ color: colors.textSecondary }} numberOfLines={1}>
                    {rtl ? s.themesAr : s.themes}
                  </Text>
                </View>
                {locked && (
                  <View style={[styles.lockChip, { backgroundColor: colors.highlight }]}>
                    <Text variant="caption">{t.plus}</Text>
                  </View>
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

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, ...typography.body },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info: { flex: 1, gap: 2 },
  lockChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999 },
});
