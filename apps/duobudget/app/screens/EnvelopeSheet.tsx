import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TPText } from '../components/TPText';
import { Button } from '../components/Button';
import { useTwoPurse, type Envelope, type EnvelopeKind } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { envelopeColors } from '../theme/tokens';
import { formatMoney, monthKey, expensesInMonth } from '../lib/money';

export function EnvelopeSheet({
  envelope,
  onDone,
  onNeedPro,
}: {
  envelope?: Envelope;
  onDone: () => void;
  onNeedPro: () => void;
}) {
  const { colors, spacing, radii } = useTheme();
  const { saveEnvelope, archiveEnvelope, deleteExpense, expenses, currency, meName, partnerName } =
    useTwoPurse();
  const isNew = !envelope;
  const [name, setName] = useState(envelope?.name ?? '');
  const [amount, setAmount] = useState(envelope ? String(envelope.amount) : '');
  const [kind, setKind] = useState<EnvelopeKind>(envelope?.kind ?? 'joint');
  const [color, setColor] = useState(envelope?.color ?? (envelopeColors[0] as string));
  const [rollover, setRollover] = useState(envelope?.rollover ?? true);
  const locale = getLang() === 'ar' ? 'ar-SA' : 'en-US';
  const month = monthKey(Date.now());

  const recent = envelope
    ? expensesInMonth(expenses, month)
        .filter((e) => e.envelopeId === envelope.id)
        .sort((a, b) => b.date - a.date)
    : [];

  const kindLabel = (k: EnvelopeKind) =>
    k === 'joint' ? t().ownerJoint : k === 'mine' ? `${t().ownerMine} (${meName})` : `${t().ownerTheirs} (${partnerName})`;

  const save = () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!name.trim() || !parsed || parsed <= 0) return;
    const result = saveEnvelope({
      id: envelope?.id,
      name: name.trim(),
      amount: Math.round(parsed * 100) / 100,
      kind: envelope?.isSavings ? 'joint' : kind,
      color,
      rollover: envelope?.isSavings ? false : rollover,
      isSavings: envelope?.isSavings ?? false,
    });
    if (result === null) {
      onNeedPro(); // free limit hit
      return;
    }
    onDone();
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <TPText variant="h1">{isNew ? t().addEnvelope : t().editEnvelope}</TPText>
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: 4 }}>
        {t().envelopeName}
      </TPText>
      <TextInput
        value={name}
        onChangeText={setName}
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md }]}
      />
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: 4 }}>
        {t().monthlyAmount} ({currency})
      </TPText>
      <TextInput
        value={amount}
        onChangeText={(v) => setAmount(v.replace(/[^0-9.,]/g, ''))}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md }]}
      />
      <View style={{ height: spacing.md }} />

      {!envelope?.isSavings && (
        <>
          <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
            {t().owner}
          </TPText>
          <View style={{ flexDirection: 'row' }}>
            {(['joint', 'mine', 'theirs'] as EnvelopeKind[]).map((k) => (
              <Pressable
                key={k}
                accessibilityRole="button"
                onPress={() => setKind(k)}
                style={[
                  styles.kindChip,
                  {
                    borderColor: kind === k ? colors.accent : colors.border,
                    backgroundColor: kind === k ? colors.accentMuted : colors.surface,
                    borderRadius: radii.full,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderWidth: kind === k ? 2 : 1,
                  },
                ]}
              >
                <TPText variant="bodySmall" color={kind === k ? colors.accent : colors.textPrimary}>
                  {kindLabel(k)}
                </TPText>
              </Pressable>
            ))}
          </View>
          <View style={{ height: spacing.md }} />
        </>
      )}

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {t().color}
      </TPText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {envelopeColors.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            accessibilityLabel={`Color ${c}`}
            onPress={() => setColor(c)}
            style={[
              styles.swatch,
              {
                backgroundColor: c,
                borderColor: color === c ? colors.textPrimary : 'transparent',
              },
            ]}
          />
        ))}
      </View>
      <View style={{ height: spacing.md }} />

      {!envelope?.isSavings && (
        <>
          <View style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.md }]}>
            <View style={{ flex: 1 }}>
              <TPText variant="body">{t().rolloverToggle}</TPText>
              <TPText variant="caption" color={colors.textSecondary}>
                {t().rolloverHint}
              </TPText>
            </View>
            <Switch value={rollover} onValueChange={setRollover} trackColor={{ true: colors.accent }} />
          </View>
          <View style={{ height: spacing.md }} />
        </>
      )}

      {!isNew && recent.length > 0 && (
        <>
          <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
            {t().recentExpenses}
          </TPText>
          {recent.map((e) => (
            <View
              key={e.id}
              style={[styles.expRow, { borderBottomColor: colors.border, paddingVertical: spacing.sm }]}
            >
              <View style={{ flex: 1 }}>
                <TPText variant="body">
                  {formatMoney(e.amount, currency, locale)}
                  <TPText variant="bodySmall" color={colors.textSecondary}>
                    {' '}
                    · {e.spender === 'me' ? meName : partnerName}
                    {e.note ? ` · ${e.note}` : ''}
                  </TPText>
                </TPText>
              </View>
              <Pressable accessibilityRole="button" onPress={() => deleteExpense(e.id)}>
                <TPText variant="bodySmall" color={colors.danger}>
                  {t().deleteExpense}
                </TPText>
              </Pressable>
            </View>
          ))}
          <View style={{ height: spacing.md }} />
        </>
      )}

      <Button title={t().save} onPress={save} size="lg" />
      <View style={{ height: spacing.sm }} />
      {!isNew && envelope && !envelope.isSavings && (
        <Button
          title={envelope.archived ? t().unarchive : t().archive}
          variant="ghost"
          onPress={() => {
            archiveEnvelope(envelope.id, !envelope.archived);
            onDone();
          }}
        />
      )}
      <View style={{ height: spacing.sm }} />
      <Button title={t().cancel} variant="ghost" onPress={onDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, fontSize: 16 },
  kindChip: { marginRight: 8 },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 3,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  expRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
});
