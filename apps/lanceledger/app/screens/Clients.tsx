import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useLedger, formatMoney, FREE_CLIENT_LIMIT } from '../store/ledger';

// Clients ranked by profit — the screen that answers "who actually makes
// me money?" Free plan caps at 3 clients; Plus is unlimited.
export function ClientsScreen({
  onOpenClient,
  onPaywall,
}: {
  onOpenClient: (clientId: string) => void;
  onPaywall: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { clients, addClient, deleteClient, clientStats, currency, pro } = useLedger();
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);

  const limitHit = !pro && clients.length >= FREE_CLIENT_LIMIT;

  const ranked = [...clients]
    .map((c) => ({ client: c, stats: clientStats(c.id) }))
    .sort((a, b) => b.stats.profit - a.stats.profit);

  const save = () => {
    if (!draft.trim()) return;
    const id = addClient(draft);
    if (id === null) {
      onPaywall();
      return;
    }
    setDraft('');
    setAdding(false);
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>{t.clTitle}</Text>

        {limitHit && (
          <Card tone="highlight" style={{ marginBottom: spacing.md }}>
            <Text variant="bodySmall">{t.clFreeLimit}</Text>
            <Button title={t.pGoPlus} variant="highlight" onPress={onPaywall} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        {ranked.length === 0 ? (
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.xl }}>
            {t.clEmpty}
          </Text>
        ) : (
          ranked.map(({ client, stats }) => (
            <Pressable key={client.id} onPress={() => onOpenClient(client.id)} accessibilityRole="button">
              <Card style={{ marginBottom: spacing.sm }}>
                <View style={styles.header}>
                  <Text variant="h3">{client.name}</Text>
                  <Text variant="h3" color={stats.profit >= 0 ? 'profit' : 'danger'}>
                    {formatMoney(currency, stats.profit)}
                  </Text>
                </View>
                <Text variant="caption" color="textSecondary">
                  {t.clIncome} {formatMoney(currency, stats.income)} · {t.clExpenses} {formatMoney(currency, stats.expenses)} · {t.clProfit}
                </Text>
              </Card>
            </Pressable>
          ))
        )}

        {adding ? (
          <Card style={{ marginTop: spacing.sm }}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t.clName}
              placeholderTextColor={colors.textTertiary}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
              accessibilityLabel={t.clName}
              autoFocus
            />
            <View style={[styles.row, { marginTop: spacing.sm }]}>
              <Button title={t.commonSave} onPress={save} disabled={!draft.trim()} />
              <Button title={t.commonCancel} variant="ghost" onPress={() => { setAdding(false); setDraft(''); }} />
            </View>
          </Card>
        ) : (
          !limitHit && (
            <Button title={`+ ${t.clAdd}`} variant="secondary" onPress={() => setAdding(true)} style={{ marginTop: spacing.sm }} />
          )
        )}
      </ScrollView>
    </Screen>
  );
}

// Client detail is reached from the Clients list; deletion lives here to
// keep the list screen tap = open.
export function ClientDetailScreen({
  clientId,
  onBack,
}: {
  clientId: string;
  onBack: () => void;
}) {
  const { spacing } = useTheme();
  const { t } = useStrings();
  const { clients, deleteClient, clientStats, currency, transactions } = useLedger();
  const client = clients.find((c) => c.id === clientId);
  const [confirm, setConfirm] = useState(false);

  if (!client) {
    return (
      <Screen>
        <Button title={t.commonClose} onPress={onBack} />
      </Screen>
    );
  }

  const stats = clientStats(clientId);
  const tx = transactions.filter((x) => x.clientId === clientId).slice(0, 20);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Button title={`‹ ${client.name}`} variant="ghost" onPress={onBack} style={[styles.back, { marginTop: spacing.sm }]} />
        <View style={[styles.row, { marginTop: spacing.md }]}>
          <Card style={styles.third}>
            <Text variant="overline" color="textSecondary">{t.clIncome}</Text>
            <Text variant="h3" color="profit">{formatMoney(currency, stats.income)}</Text>
          </Card>
          <Card style={styles.third}>
            <Text variant="overline" color="textSecondary">{t.clExpenses}</Text>
            <Text variant="h3">{formatMoney(currency, stats.expenses)}</Text>
          </Card>
          <Card tone="highlight" style={styles.third}>
            <Text variant="overline" color="highlight">{t.clProfit}</Text>
            <Text variant="h3" color={stats.profit >= 0 ? 'profit' : 'danger'}>
              {formatMoney(currency, stats.profit)}
            </Text>
          </Card>
        </View>

        <Text variant="h3" style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>{t.clTransactions}</Text>
        {tx.length === 0 ? (
          <Text variant="body" color="textSecondary">{t.dashEmpty}</Text>
        ) : (
          tx.map((x) => (
            <Card key={x.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.header}>
                <Text variant="body">{x.vendor || x.date}</Text>
                <Text variant="body" color={x.kind === 'income' ? 'profit' : 'textPrimary'} style={{ fontWeight: '600' }}>
                  {x.kind === 'income' ? '+' : '−'}{formatMoney(currency, x.amount)}
                </Text>
              </View>
              <Text variant="caption" color="textSecondary">{x.date}</Text>
            </Card>
          ))
        )}

        {!confirm ? (
          <Button title={t.clDelete} variant="ghost" onPress={() => setConfirm(true)} style={{ marginTop: spacing.lg }} />
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            <Button
              title={t.commonDelete}
              onPress={() => { deleteClient(clientId); onBack(); }}
            />
            <Button title={t.commonCancel} variant="ghost" onPress={() => setConfirm(false)} style={{ marginTop: spacing.sm }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 8 },
  back: { alignSelf: 'flex-start' },
  third: { flex: 1 },
});
