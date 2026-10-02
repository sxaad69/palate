import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety } from '../store/sobriety';

// Savings goals — the marquee Plus feature. The running total is free;
// allocating it toward tangible goals ("weekend trip", "new laptop") is what
// makes the money feel real. That's the differentiator vs Trifoil's Sober.
export function GoalsScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useStrings();
  const { goals, addGoal, removeGoal, moneySaved, currency } = useSobriety();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const save = () => {
    const targetNum = parseFloat(target);
    if (!name.trim() || !targetNum || targetNum <= 0) return;
    addGoal(name.trim(), targetNum);
    setName('');
    setTarget('');
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={{ marginTop: spacing.md }}>{t.goalTitle}</Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {t.dashSaved}: {currency}{moneySaved.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </Text>

        {goals.map((g) => {
          const pct = Math.min(100, (moneySaved / g.target) * 100);
          const funded = moneySaved >= g.target;
          return (
            <Card key={g.id} tone={funded ? 'gold' : 'default'} style={{ marginBottom: spacing.sm }}>
              <View style={styles.header}>
                <Text variant="h3">{g.name}</Text>
                <Text variant="caption" color="textTertiary" onPress={() => removeGoal(g.id)}>✕</Text>
              </View>
              <Text variant="bodySmall" color="textSecondary">
                {currency}{Math.min(moneySaved, g.target).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                {' '}{t.goalOf}{' '}
                {currency}{g.target.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                {funded ? ' ✓' : ''}
              </Text>
              <View style={[styles.progress, { backgroundColor: colors.surfaceAlt }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: funded ? colors.highlight : colors.accent, width: `${pct}%` },
                  ]}
                />
              </View>
            </Card>
          );
        })}

        <Card style={{ marginTop: spacing.sm }}>
          <Text variant="overline" color="textSecondary">{t.goalAdd}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t.goalName}
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
            accessibilityLabel={t.goalName}
          />
          <TextInput
            value={target}
            onChangeText={(v) => setTarget(v.replace(/[^0-9.]/g, ''))}
            placeholder={t.goalTarget}
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, marginTop: spacing.sm }]}
            accessibilityLabel={t.goalTarget}
          />
          <Button title={t.goalSave} variant="gold" onPress={save} disabled={!name.trim() || !target} style={{ marginTop: spacing.sm }} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progress: { height: 8, borderRadius: 9999, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 9999 },
  input: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 8, marginTop: 4 },
});
