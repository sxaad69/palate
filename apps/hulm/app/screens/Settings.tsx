import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useDreams } from '../store/dreams';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export default function SettingsScreen() {
  const { colors, lang, setLang, mode, setMode } = useTheme();
  const { t } = useStrings();
  const { eraseAll } = useDreams();

  const Option = <T extends string>({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={[styles.opt, { backgroundColor: active ? colors.highlightMuted : colors.surface, borderColor: active ? colors.highlight : colors.border }]}
    >
      <Text variant="body">{label}</Text>
    </Pressable>
  );

  const confirmErase = () => {
    Alert.alert(t.eraseAll, t.eraseConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.eraseAll, style: 'destructive', onPress: eraseAll },
    ]);
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="h1">{t.settings}</Text>

        <Text variant="h3">{t.language}</Text>
        <View style={styles.row}>
          <Option label={t.english} active={lang === 'en'} onPress={() => setLang('en')} />
          <Option label={t.arabic} active={lang === 'ar'} onPress={() => setLang('ar')} />
        </View>

        <Text variant="h3">{t.appearance}</Text>
        <View style={styles.row}>
          <Option label={t.light} active={mode === 'light'} onPress={() => setMode('light')} />
          <Option label={t.dark} active={mode === 'dark'} onPress={() => setMode('dark')} />
          <Option label={t.system} active={mode === 'system'} onPress={() => setMode('system')} />
        </View>

        <Text variant="h3">{t.disclaimerTitle}</Text>
        <Card tone="action">
          <Text variant="body" style={{ color: colors.textSecondary }}>{t.disclaimerBody}</Text>
        </Card>

        <Button title={t.eraseAll} onPress={confirmErase} variant="ghost" />
        <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>{t.version}</Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  opt: { flex: 1, borderWidth: 1, borderRadius: radii.md, paddingVertical: spacing.md, alignItems: 'center' },
});
