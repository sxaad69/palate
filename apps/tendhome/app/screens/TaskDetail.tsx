import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { typography } from '../theme/typography';
import { useStrings } from '../lib/strings';
import { useHome } from '../store/home';
import { nextDue, statusOf } from '../lib/home';
import { CATEGORIES } from '../data/tasks';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

function fmtDate(ts: number, rtl: boolean): string {
  return new Date(ts).toLocaleDateString(rtl ? 'ar' : 'en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function TaskDetailScreen({
  taskId,
  onBack,
}: {
  taskId: string;
  onBack: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { tasks, completions, markDone, deleteTask, updateCustom } = useHome();
  const task = tasks.find((x) => x.id === taskId);
  const [cost, setCost] = useState('');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task?.titleEn ?? '');
  const [interval, setInterval] = useState(String(task?.intervalDays ?? 90));

  if (!task) {
    return (
      <Screen padded>
        <Button title={t.cancel} onPress={onBack} variant="ghost" />
      </Screen>
    );
  }

  const title_ = t.dir === 'rtl' ? task.titleAr : task.titleEn;
  const history = completions.filter((c) => c.taskId === task.id);
  const st = statusOf(task);

  const done = () => {
    const c = parseFloat(cost.replace(',', '.')) || 0;
    markDone(task.id, Math.max(0, c));
    setCost('');
  };

  const saveEdit = () => {
    const iv = parseInt(interval, 10);
    if (title.trim() && iv > 0) {
      updateCustom(task.id, { titleEn: title.trim(), titleAr: title.trim(), intervalDays: iv });
    }
    setEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert(t.deleteTask, t.deleteConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.deleteTask, style: 'destructive', onPress: () => { deleteTask(task.id); onBack(); } },
    ]);
  };

  const cat = CATEGORIES.find((c) => c.id === task.category);

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable onPress={onBack}>
          <Text variant="body" style={{ color: colors.accent }}>‹ {t.tasks}</Text>
        </Pressable>

        {editing ? (
          <Card style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
              value={title} onChangeText={setTitle} placeholder={t.taskTitle} placeholderTextColor={colors.textTertiary}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
              value={interval} onChangeText={setInterval} placeholder={t.interval}
              placeholderTextColor={colors.textTertiary} keyboardType="numeric"
            />
            <Button title={t.save} onPress={saveEdit} variant="primary" />
          </Card>
        ) : (
          <Text variant="h1">{title_}</Text>
        )}

        {task.why ? (
          <Card>
            <Text variant="h3">{t.whyMatters}</Text>
            <Text variant="body" style={{ color: colors.textSecondary }}>{task.why}</Text>
          </Card>
        ) : null}

        <Card style={styles.facts}>
          <Fact label={t.every} value={`${task.intervalDays} ${t.days}`} />
          <Fact label={t.minutes} value={`~${task.minutes}'`} />
          <Fact label={t.category} value={t.dir === 'rtl' ? cat?.ar ?? '' : cat?.en ?? ''} />
          <Fact label={t.lastDone} value={task.lastDone ? fmtDate(task.lastDone, t.dir === 'rtl') : t.never} />
          <Fact label={t.nextDue} value={fmtDate(nextDue(task), t.dir === 'rtl')} highlight={st !== 'ok'} colors={colors} />
        </Card>

        <Card style={styles.form}>
          <Text variant="h3">{t.markDone}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textPrimary, borderColor: colors.border }]}
            value={cost} onChangeText={setCost} placeholder={t.costPlaceholder}
            placeholderTextColor={colors.textTertiary} keyboardType="decimal-pad"
          />
          <Text variant="caption" style={{ color: colors.textTertiary }}>{t.cost}</Text>
          <Button title={t.markDone} onPress={done} variant="primary" />
        </Card>

        <Text variant="h3">{t.history}</Text>
        {history.length === 0 ? (
          <Text variant="body" style={{ color: colors.textTertiary }}>{t.noHistory}</Text>
        ) : (
          history.slice(0, 20).map((h) => (
            <Card key={h.id} style={styles.histRow}>
              <Text variant="body">{fmtDate(h.at, t.dir === 'rtl')}</Text>
              {h.cost > 0 && <Text variant="body" style={{ color: colors.textSecondary }}>${h.cost}</Text>}
            </Card>
          ))
        )}

        {task.custom && (
          <View style={styles.danger}>
            <Button title={t.editTask} onPress={() => { setTitle(task.titleEn); setInterval(String(task.intervalDays)); setEditing(true); }} variant="secondary" />
            <Button title={t.deleteTask} onPress={confirmDelete} variant="ghost" />
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function Fact({ label, value, highlight, colors }: { label: string; value: string; highlight?: boolean; colors?: any }) {
  return (
    <View style={styles.fact}>
      <Text variant="caption" style={{ color: colors?.textTertiary }}>{label}</Text>
      <Text variant="body" style={highlight ? { color: colors?.danger } : undefined}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },
  facts: { gap: spacing.sm },
  fact: { gap: 2 },
  form: { gap: spacing.sm },
  input: { borderWidth: 1, borderRadius: radii.md, padding: spacing.md, ...typography.body },
  histRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  danger: { gap: spacing.sm, marginTop: spacing.sm },
});
