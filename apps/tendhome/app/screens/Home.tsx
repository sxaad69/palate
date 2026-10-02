import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, radii } from '../theme/tokens';
import { useStrings } from '../lib/strings';
import { useHome } from '../store/home';
import { attentionQueue, dueLabel, statusOf, type TaskStatus } from '../lib/home';
import { FREE_TASK_LIMIT } from '../data/tasks';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const STATUS_COLOR: Record<TaskStatus, string> = {
  new: '#C75B39',
  overdue: '#C0392B',
  'due-soon': '#B45309',
  ok: '#3E7C4F',
};

// "Needs attention" — the only screen that matters day to day.
export default function HomeScreen({
  onOpen,
  onBrowse,
}: {
  onOpen: (id: string) => void;
  onBrowse: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useStrings();
  const { tasks, pro, enabledCount } = useHome();

  const queue = attentionQueue(tasks).filter((x) => statusOf(x) !== 'ok');

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text variant="h1">{t.needsAttention}</Text>
          <Text variant="caption" style={{ color: colors.textTertiary }}>
            {enabledCount}{!pro && `/${FREE_TASK_LIMIT}`}
          </Text>
        </View>

        {queue.length === 0 ? (
          <Card tone="action" style={styles.allGood}>
            <Text variant="display" align="center">🌿</Text>
            <Text variant="h2" align="center">{t.allGood}</Text>
            <Text variant="body" align="center" style={{ color: colors.textSecondary }}>
              {t.allGoodBody}
            </Text>
          </Card>
        ) : (
          queue.map((task) => {
            const st = statusOf(task);
            const title = t.dir === 'rtl' ? task.titleAr : task.titleEn;
            return (
              <Pressable key={task.id} onPress={() => onOpen(task.id)}>
                <Card style={styles.row}>
                  <View style={[styles.bar, { backgroundColor: STATUS_COLOR[st] }]} />
                  <View style={styles.info}>
                    <Text variant="h3">{title}</Text>
                    <Text variant="caption" style={{ color: STATUS_COLOR[st] }}>
                      {dueLabel(task, t)}
                    </Text>
                  </View>
                  <Text variant="h3" style={{ color: colors.textTertiary }}>›</Text>
                </Card>
              </Pressable>
            );
          })
        )}

        <Button title={t.library} onPress={onBrowse} variant="secondary" />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.sm },
  allGood: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  info: { flex: 1, gap: 2 },
});
