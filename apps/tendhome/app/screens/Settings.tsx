import React from 'react';
import { View, StyleSheet, Pressable, Alert, Switch } from 'react-native';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useHome } from '../store/home';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function Row({ label, value, options, onPick }: {
  label: string; value: string;
  options: { key: string; label: string }[];
  onPick: (key: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text variant="body">{label}</Text>
      <View style={styles.opts}>
        {options.map((o) => (
          <Pressable
            key={o.key}
            onPress={() => onPick(o.key)}
            style={[styles.opt, { backgroundColor: o.key === value ? colors.highlight : colors.surfaceAlt }]}
          >
            <Text variant="caption" style={{ color: o.key === value ? colors.textPrimary : colors.textSecondary }}>
              {o.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen({ onPaywall }: { onPaywall: () => void }) {
  const { colors, lang, setLang, mode, setMode } = useTheme();
  const { t } = useStrings();
  const { eraseAll, pro, remindersOn, setRemindersOn } = useHome();

  const confirmErase = () => {
    Alert.alert(t.eraseAll, t.eraseConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.eraseAll, style: 'destructive', onPress: eraseAll },
    ]);
  };

  return (
    <Screen padded={false}>
      <View style={styles.body}>
        <Text variant="h1" style={styles.title}>{t.settings}</Text>
        <Card style={styles.card}>
          <Row label={t.language} value={lang}
            options={[{ key: 'en', label: t.english }, { key: 'ar', label: t.arabic }]}
            onPick={(k) => setLang(k as 'en' | 'ar')} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label={t.appearance} value={mode}
            options={[{ key: 'system', label: t.system }, { key: 'light', label: t.light }, { key: 'dark', label: t.dark }]}
            onPick={(k) => setMode(k as ThemeMode)} />
        </Card>

        <Card style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text variant="body">{t.reminders}</Text>
              <Text variant="caption" style={{ color: colors.textSecondary }}>{t.remindersBody}</Text>
            </View>
            <Switch value={remindersOn} onValueChange={setRemindersOn} />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption" style={{ color: colors.textSecondary }}>{t.climateNote}</Text>
        </Card>

        {!pro && <Button title={t.upgrade} onPress={onPaywall} variant="primary" />}
        <Button title={t.eraseAll} onPress={confirmErase} variant="ghost" />
        <Text variant="caption" align="center" style={{ color: colors.textTertiary }}>{t.version}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md, flex: 1 },
  title: { marginBottom: spacing.sm },
  card: { gap: spacing.md },
  row: { gap: spacing.sm },
  opts: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  opt: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full },
  divider: { height: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  switchLabel: { flex: 1, gap: 2 },
});
