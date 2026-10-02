import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useApp } from '../store/app';
import type { FeedType } from '../lib/baby';

// Quick feed editor: type → side (breast) / amount (bottle) → save.
export function FeedEditorScreen() {
  const { colors, spacing, radii, typography } = useTheme();
  const { t, useMetric, addFeed } = useApp();
  const navigation = useNavigation<any>();

  const [feedType, setFeedType] = useState<FeedType>('breast');
  const [side, setSide] = useState<'left' | 'right' | 'both'>('left');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const Chip = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.full,
        backgroundColor: selected ? colors.accent : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.accent : colors.border,
        minHeight: 48,
        justifyContent: 'center',
      }}
    >
      <Text variant="body" color={selected ? 'textInverse' : 'textPrimary'}>{label}</Text>
    </Pressable>
  );

  const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
  const amountMl = Number.isFinite(parsedAmount)
    ? useMetric
      ? parsedAmount
      : Math.round(parsedAmount * 29.5735)
    : undefined;

  const onSave = () => {
    addFeed({
      feedType,
      side: feedType === 'breast' ? side : undefined,
      amountMl: feedType === 'bottle' ? amountMl : undefined,
      note: note.trim() || undefined,
    });
    navigation.goBack();
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text variant="h1" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
          🍼 {t.logFeed}
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Chip label={t.breast} selected={feedType === 'breast'} onPress={() => setFeedType('breast')} />
          <Chip label={t.bottle} selected={feedType === 'bottle'} onPress={() => setFeedType('bottle')} />
          <Chip label={t.solid} selected={feedType === 'solid'} onPress={() => setFeedType('solid')} />
        </View>

        {feedType === 'breast' && (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
            <Chip label={t.left} selected={side === 'left'} onPress={() => setSide('left')} />
            <Chip label={t.right} selected={side === 'right'} onPress={() => setSide('right')} />
            <Chip label={t.both} selected={side === 'both'} onPress={() => setSide('both')} />
          </View>
        )}

        {feedType === 'bottle' && (
          <>
            <Text variant="h3" style={{ marginBottom: spacing.xs }}>
              {t.amountMl.replace('ml', useMetric ? t.ml : t.oz)}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="120"
              placeholderTextColor={colors.textTertiary}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radii.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                minHeight: 48,
                color: colors.textPrimary,
                marginBottom: spacing.lg,
                ...typography.body,
              }}
              accessibilityLabel={t.amountMl}
            />
          </>
        )}

        <Text variant="h3" style={{ marginBottom: spacing.xs }}>{t.note}</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 48,
            color: colors.textPrimary,
            marginBottom: spacing.lg,
            ...typography.body,
          }}
          accessibilityLabel={t.note}
        />

        <Button title={t.save} onPress={onSave} />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}
