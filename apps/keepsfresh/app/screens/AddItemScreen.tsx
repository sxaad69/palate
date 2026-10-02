import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useKeeps } from '../store/app';
import { getLang, t } from '../lib/i18n';
import {
  CATEGORIES,
  findFood,
  type FoodCategory,
  type FoodDefault,
  type StorageLoc,
} from '../data/foods';
import { daysLeft, type PantryItem } from '../store/types';

const QUICK_DAYS = [3, 7, 14, 30];
const LOCS: StorageLoc[] = ['pantry', 'fridge', 'freezer'];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      android_ripple={{ color: colors.overlay }}
      style={{
        backgroundColor: selected ? colors.accent : colors.surface,
        borderColor: selected ? colors.accent : colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
      }}
    >
      <KText variant="bodySmall" color={selected ? colors.textInverse : colors.textPrimary}>
        {label}
      </KText>
    </Pressable>
  );
}

function Stepper({
  label,
  value,
  unit,
  onChange,
  min = 1,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
  min?: number;
}) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ marginTop: spacing.md }}>
      <KText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
        {label}
      </KText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Button title="−" size="sm" variant="secondary" onPress={() => onChange(Math.max(min, value - 1))} />
        <KText variant="h2" style={{ minWidth: 90, textAlign: 'center' }}>
          {value} {unit}
        </KText>
        <Button title="+" size="sm" variant="secondary" onPress={() => onChange(value + 1)} />
      </View>
    </View>
  );
}

export function AddItemScreen({
  initial,
  onClose,
  onGoPro,
}: {
  initial: PantryItem | null;
  onClose: () => void;
  onGoPro: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { addItem, updateItem, canAdd, isPro } = useKeeps();
  const lang = getLang();
  const editing = initial !== null;

  const [name, setName] = useState(initial?.name ?? '');
  const [cat, setCat] = useState<FoodCategory>(initial?.cat ?? 'produce');
  const [loc, setLoc] = useState<StorageLoc>(initial?.loc ?? 'fridge');
  const [days, setDays] = useState(initial ? Math.max(1, daysLeft(initial.expiry)) : 7);
  const [qty, setQty] = useState(initial?.qty ?? 1);
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [error, setError] = useState('');
  const [pickedDefault, setPickedDefault] = useState<FoodDefault | null>(null);

  const suggestions = useMemo(() => findFood(name, lang), [name, lang]);

  const pick = (f: FoodDefault) => {
    setPickedDefault(f);
    setName(lang === 'ar' ? f.ar : f.en);
    setCat(f.cat);
    setLoc(f.loc);
    setDays(f.days);
    setPrice(String(f.price));
    setError('');
  };

  const locLabel = (l: StorageLoc) =>
    l === 'fridge' ? t().locFridge : l === 'freezer' ? t().locFreezer : t().locPantry;

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t().nameRequired);
      return;
    }
    const expiry = new Date();
    expiry.setHours(0, 0, 0, 0);
    const expiryMs = expiry.getTime() + days * 86400000;
    const parsedPrice = parseFloat(price);
    if (editing && initial) {
      updateItem(initial.id, {
        name: trimmed,
        cat,
        loc,
        expiry: expiryMs,
        qty,
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      });
      onClose();
      return;
    }
    if (!canAdd && !isPro) {
      onGoPro();
      return;
    }
    const ok = addItem({
      name: trimmed,
      cat,
      loc,
      expiry: expiryMs,
      qty,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      defaultId: pickedDefault?.id,
    });
    if (ok) onClose();
    else onGoPro();
  };

  return (
    <Screen>
      <View style={[styles.header, { marginTop: spacing.md }]}>
        <KText variant="h1">{editing ? t().editItemTitle : t().addItemTitle}</KText>
        <Button title={t().cancel} variant="ghost" size="sm" onPress={onClose} />
      </View>

      <Input
        label={t().itemName}
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (!editing) setPickedDefault(null);
          setError('');
        }}
        placeholder={t().itemNamePlaceholder}
        error={error}
        style={{ marginTop: spacing.md }}
      />

      {!editing && name.trim().length > 0 && !pickedDefault ? (
        <View style={{ marginTop: spacing.sm }}>
          {suggestions.map((f) => (
            <Card
              key={f.id}
              onPress={() => pick(f)}
              accessibilityLabel={lang === 'ar' ? f.ar : f.en}
              style={{ marginBottom: spacing.xs, paddingVertical: spacing.sm }}
            >
              <View style={styles.suggestRow}>
                <KText variant="body">{lang === 'ar' ? f.ar : f.en}</KText>
                <KText variant="caption" color={colors.textSecondary}>
                  {f.days}d · {locLabel(f.loc)}
                </KText>
              </View>
            </Card>
          ))}
          {suggestions.length === 0 ? (
            <KText variant="caption" color={colors.textSecondary}>
              {t().noMatch}
            </KText>
          ) : null}
        </View>
      ) : null}

      {pickedDefault ? (
        <Card style={{ marginTop: spacing.sm, borderColor: colors.accent }}>
          <KText variant="bodySmall">
            <KText variant="bodySmall" color={colors.accent}>
              {t().smartDefault}:{' '}
            </KText>
            <KText variant="bodySmall" color={colors.textSecondary}>
              {t()
                .smartDefaultBody.replace('{days}', String(pickedDefault.days))
                .replace('{loc}', locLabel(pickedDefault.loc))}
            </KText>
          </KText>
        </Card>
      ) : null}

      <View style={{ marginTop: spacing.md }}>
        <KText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
          {t().category}
        </KText>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={lang === 'ar' ? c.ar : c.en}
              selected={cat === c.id}
              onPress={() => setCat(c.id)}
            />
          ))}
        </View>
      </View>

      <View style={{ marginTop: spacing.sm }}>
        <KText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.xs }}>
          {t().location}
        </KText>
        <View style={styles.chipRow}>
          {LOCS.map((l) => (
            <Chip key={l} label={locLabel(l)} selected={loc === l} onPress={() => setLoc(l)} />
          ))}
        </View>
      </View>

      <Stepper label={t().expiry} value={days} unit={t().expiryInDays} onChange={setDays} />
      <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
        {QUICK_DAYS.map((d) => (
          <Chip key={d} label={`${d}`} selected={days === d} onPress={() => setDays(d)} />
        ))}
      </View>

      <Stepper label={t().quantity} value={qty} unit="" onChange={setQty} />

      <Input
        label={t().price}
        value={price}
        onChangeText={setPrice}
        placeholder="3.50"
        keyboardType="numeric"
        style={{ marginTop: spacing.md }}
      />

      <Button title={t().save} onPress={save} style={{ marginTop: spacing.lg }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
