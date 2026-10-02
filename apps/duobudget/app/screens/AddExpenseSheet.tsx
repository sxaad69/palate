import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TPText } from '../components/TPText';
import { Button } from '../components/Button';
import { useTwoPurse, type Spender } from '../store/app';
import { getLang, t } from '../lib/i18n';
import { formatMoney } from '../lib/money';

export function AddExpenseSheet({ onDone }: { onDone: () => void }) {
  const { colors, spacing, radii } = useTheme();
  const { envelopes, addExpense, currency, meName, partnerName } = useTwoPurse();
  const active = envelopes.filter((e) => !e.archived && !e.isSavings);
  const [amount, setAmount] = useState('');
  const [envelopeId, setEnvelopeId] = useState(active[0]?.id ?? '');
  const [spender, setSpender] = useState<Spender>('me');
  const [note, setNote] = useState('');
  const [dayOffset, setDayOffset] = useState(0);
  const [error, setError] = useState('');

  const locale = getLang() === 'ar' ? 'ar-SA' : 'en-US';
  const parsed = parseFloat(amount.replace(',', '.'));

  const dateLabel =
    dayOffset === 0
      ? t().today
      : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(
          new Date(Date.now() + dayOffset * 86400000),
        );

  const save = () => {
    if (!parsed || parsed <= 0 || !envelopeId) {
      setError(t().amountRequired);
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    addExpense({
      envelopeId,
      amount: Math.round(parsed * 100) / 100,
      spender,
      note: note.trim(),
      date: d.getTime(),
    });
    onDone();
  };

  const seg = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.seg,
        {
          backgroundColor: selected ? colors.accent : colors.surfaceAlt,
          borderRadius: radii.full,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      <TPText variant="body" color={selected ? colors.textInverse : colors.textPrimary} style={styles.center}>
        {label}
      </TPText>
    </Pressable>
  );

  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <TPText variant="h1">{t().addExpense}</TPText>
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary}>
        {t().amount} ({currency})
      </TPText>
      <TextInput
        testID="amountInput"
        value={amount}
        onChangeText={(v) => {
          setAmount(v.replace(/[^0-9.,]/g, ''));
          setError('');
        }}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textTertiary}
        autoFocus
        style={[
          styles.amountInput,
          {
            color: colors.textPrimary,
            borderBottomColor: colors.borderStrong,
          },
        ]}
      />
      {!!error && (
        <TPText variant="bodySmall" color={colors.danger}>
          {error}
        </TPText>
      )}
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {t().pickEnvelope}
      </TPText>
      <View style={styles.wrap}>
        {active.map((e) => (
          <Pressable
            key={e.id}
            accessibilityRole="button"
            onPress={() => setEnvelopeId(e.id)}
            style={[
              styles.chip,
              {
                borderColor: envelopeId === e.id ? e.color : colors.border,
                backgroundColor: envelopeId === e.id ? colors.surfaceAlt : colors.surface,
                borderRadius: radii.full,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderWidth: envelopeId === e.id ? 2 : 1,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: e.color }]} />
            <TPText variant="bodySmall">{e.name}</TPText>
          </Pressable>
        ))}
      </View>
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {t().whoSpent}
      </TPText>
      <View style={styles.segRow}>
        {seg(meName, spender === 'me', () => setSpender('me'))}
        <View style={{ width: spacing.sm }} />
        {seg(partnerName, spender === 'partner', () => setSpender('partner'))}
      </View>
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: spacing.sm }}>
        {t().date}
      </TPText>
      <View style={[styles.segRow, { alignItems: 'center' }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous day"
          onPress={() => setDayOffset(dayOffset - 1)}
          style={[styles.dayBtn, { borderColor: colors.border }]}
        >
          <TPText variant="h3" color={colors.accent}>
            {'‹'}
          </TPText>
        </Pressable>
        <TPText variant="body" style={{ flex: 1, textAlign: 'center' }}>
          {dateLabel}
        </TPText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next day"
          disabled={dayOffset >= 0}
          onPress={() => setDayOffset(Math.min(0, dayOffset + 1))}
          style={[styles.dayBtn, { borderColor: colors.border, opacity: dayOffset >= 0 ? 0.4 : 1 }]}
        >
          <TPText variant="h3" color={colors.accent}>
            {'›'}
          </TPText>
        </Pressable>
      </View>
      <View style={{ height: spacing.md }} />

      <TPText variant="overline" color={colors.textTertiary} style={{ marginBottom: 4 }}>
        {t().noteOptional}
      </TPText>
      <TextInput
        value={note}
        onChangeText={setNote}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.textPrimary,
            backgroundColor: colors.surface,
            borderRadius: radii.md,
            padding: spacing.md,
          },
        ]}
      />
      <View style={{ height: spacing.lg }} />

      <Button
        testID="saveExpenseBtn"
        title={
          parsed > 0
            ? `${t().saveExpense} · ${formatMoney(parsed, currency, locale)}`
            : t().saveExpense
        }
        onPress={save}
        size="lg"
      />
      <View style={{ height: spacing.sm }} />
      <Button title={t().cancel} variant="ghost" onPress={onDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  amountInput: { fontSize: 44, fontWeight: '700', borderBottomWidth: 2, paddingVertical: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  segRow: { flexDirection: 'row' },
  seg: { flex: 1 },
  dayBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { borderWidth: 1, fontSize: 16 },
});
