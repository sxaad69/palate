import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Switch, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useHome } from '../store/home';
import { CATEGORIES, FREE_TASK_LIMIT, type Category } from '../data/tasks';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

// Library browser: enable/disable bundled tasks, add custom ones.
export default function TasksScreen({
  onPaywall,
  onOpen,
}: {
  onPaywall: () => void;
  onOpen: (id: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { tasks, pro, enabledCount, canEnable, toggleTask, addCustom } = useHome();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [interval, setInterval] = useState('90');

  const flip = (id: string, currentlyEnabled: boolean) => {
    if (!currentlyEnabled && !canEnable) {
      Alert.alert(t.limitReached, t.limitBody.replace('{n}', String(FREE_TASK_LIMIT)), [
        { text: t.later, style: 'cancel' },
        { text: t.upgrade, onPress: onPaywall },
      ]);
      return;
    }
    toggleTask(id);
  };

  const create = () => {
    if (!title.trim()) return;
    const iv = Math.max(1, parseInt(interval, 10) || 90);
    if (!canEnable) {
      Alert.alert(t.limitReached, t.limitBody.replace('{n}', String(FREE_TASK_LIMIT)), [
        { text: t.later, style: 'cancel' },
        { text: t.upgrade, onPress: onPaywall },
      ]);
      return;
    }
    addCustom(title.trim(), category, iv, 30);
    setTitle('');
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text variant="h1">{t.library}</Text>
          <Text variant="caption" style={{ color: colors.textTertiary }}>
            {enabledCount}{!pro && `/${FREE_TASK_LIMIT}`} {t.enabled}
          </Text>
        </View>
        {!pro && (
          <Text variant="caption" style={{ color: colors.textTertiary }}>
            {t.freeLimitNote.replace('{n}', String(FREE_TASK_LIMIT))}
          </Text>
        )}

        {CATEGORIES.map((cat) => {
          const items = tasks.filter((x) => x.category === cat.id && !x.custom);
          if (items.length === 0) return null;
          return (
            <View key={cat.id} style={styles.group}>
              <Text variant="h3" style={{ color: colors.textSecondary }}>
                {t.dir === 'rtl' ? cat.ar : cat.en}
              </Text>
              {items.map((task) => (
                <Card key={task.id} style={styles.row}>
                  <Pressable style={styles.info} onPress={() => onOpen(task.id)}>
                    <Text variant="body">{t.dir === 'rtl' ? task.titleAr : task.titleEn}</Text>
                    <Text variant="caption" style={{ color: colors.textTertiary }}>
                      {t.every} {task.intervalDays} {t.days}
                    </Text>
                  </Pressable>
                  <Switch value={task.enabled} onValueChange={() => flip(task.id, task.enabled)} />
                </Card>
              ))}
            </View>
          );
        })}

        <Text variant="h3" style={{ color: colors.textSecondary }}>{t.addCustom}</Text>
        {tasks.filter((x) => x.custom).map((task) => (
          <Card key={task.id} style={styles.row}>
            <Pressable style={styles.info} onPress={() => onOpen(task.id)}>
              <Text variant="body">{task.titleEn}</Text>
              <Text variant="caption" style={{ color: colors.textTertiary }}>
                {t.every} {task.intervalDays} {t.days}
              </Text>
            </Pressable>
            <Switch value={task.enabled} onValueChange={() => flip(task.id, task.enabled)} />
          </Card>
        ))}
        <Card style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder={t.taskTitle}
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[styles.chip, { backgroundColor: category === c.id ? colors.accent : colors.surfaceAlt }]}
              >
                <Text variant="caption" style={{ color: category === c.id ? colors.textInverse : colors.textSecondary }}>
                  {t.dir === 'rtl' ? c.ar : c.en}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.intRow}>
            <Text variant="body" style={{ color: colors.textSecondary }}>{t.interval}</Text>
            <TextInput
              style={[styles.intInput, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
              value={interval}
              onChangeText={setInterval}
              keyboardType="numeric"
            />
          </View>
          <Button title={t.addCustom} onPress={create} variant="secondary" />
        </Card>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  group: { gap: spacing.sm, marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info: { flex: 1, gap: 2 },
  form: { gap: spacing.sm, marginTop: spacing.sm },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, ...typography.body },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full },
  intRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  intInput: { borderWidth: 1, borderRadius: radii.md, padding: spacing.sm, width: 90, textAlign: 'center', ...typography.body },
});
