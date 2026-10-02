import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { KText } from '../components/KText';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useKeeps } from '../store/app';
import { daysLabel, getLang, t } from '../lib/i18n';
import { daysLeft, urgencyOf, type PantryItem, type Urgency } from '../store/types';
import { categoryName } from '../data/foods';

const URGENCY_ORDER: Urgency[] = ['expired', 'soon', 'week', 'fresh'];

function UrgencyPill({ item }: { item: PantryItem }) {
  const { colors } = useTheme();
  const d = daysLeft(item.expiry);
  const u = urgencyOf(item);
  const fg =
    u === 'expired'
      ? colors.danger
      : u === 'soon'
        ? colors.warning
        : u === 'week'
          ? colors.info
          : colors.success;
  const label =
    u === 'expired'
      ? t().expired
      : d === 0
        ? t().expiresToday
        : d === 1
          ? t().expiresTomorrow
          : daysLabel(d);
  return (
    <View
      style={{
        backgroundColor: colors.surfaceAlt,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
      }}
    >
      <KText variant="caption" color={fg}>
        {label}
      </KText>
    </View>
  );
}

function ItemCard({
  item,
  onEdit,
}: {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
}) {
  const { colors, spacing } = useTheme();
  const { markUsed, markWasted } = useKeeps();
  const lang = getLang();
  const locLabel =
    item.loc === 'fridge' ? t().locFridge : item.loc === 'freezer' ? t().locFreezer : t().locPantry;

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={styles.rowTop}>
        <View style={{ flex: 1 }}>
          <KText variant="h3">{item.name}</KText>
          <KText variant="caption" color={colors.textSecondary}>
            {categoryName(item.cat, lang)} · {locLabel} · ×{item.qty}
          </KText>
        </View>
        <UrgencyPill item={item} />
      </View>
      <View style={[styles.rowActions, { marginTop: spacing.sm }]}>
        <Button title={t().markUsed} variant="secondary" size="sm" onPress={() => markUsed(item.id)} />
        <Button
          title={t().markWasted}
          variant="ghost"
          size="sm"
          onPress={() => markWasted(item.id)}
        />
        <Button title={t().edit} variant="ghost" size="sm" onPress={() => onEdit(item)} />
      </View>
    </Card>
  );
}

export function PantryScreen({
  onAdd,
  onEdit,
  onGoPro,
}: {
  onAdd: () => void;
  onEdit: (item: PantryItem) => void;
  onGoPro: () => void;
}) {
  const { colors, spacing } = useTheme();
  const { items, byUrgency, canAdd, isPro } = useKeeps();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return items.filter((it) => it.name.toLowerCase().includes(q));
  }, [items, query]);

  const sectionTitle = (u: Urgency): string =>
    u === 'expired'
      ? t().expired
      : u === 'soon'
        ? t().useSoon
        : u === 'week'
          ? t().thisWeek
          : t().fresh;

  return (
    <Screen>
      <View style={[styles.header, { marginTop: spacing.md }]}>
        <KText variant="h1">{t().pantry}</KText>
        <Button title={t().addItem} size="sm" onPress={() => (canAdd ? onAdd() : onGoPro())} />
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder={t().search}
        accessibilityLabel={t().search}
        style={{ marginTop: spacing.sm }}
      />

      {!isPro && items.length >= 24 ? (
        <Card style={{ marginTop: spacing.sm, borderColor: colors.warning }}>
          <KText variant="bodySmall" color={colors.textSecondary}>
            {t().freeLimitBody}
          </KText>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <View style={[styles.empty, { marginTop: spacing.xl }]}>
          <KText variant="display">🧺</KText>
          <KText variant="h2" style={{ marginTop: spacing.sm }}>
            {t().emptyPantry}
          </KText>
          <KText variant="body" color={colors.textSecondary} style={styles.emptyBody}>
            {t().emptyPantryBody}
          </KText>
          <Button title={t().addItem} onPress={onAdd} style={{ marginTop: spacing.md }} />
        </View>
      ) : filtered ? (
        <View style={{ marginTop: spacing.md }}>
          {filtered.length === 0 ? (
            <KText variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              {t().noResults}
            </KText>
          ) : (
            filtered.map((it) => <ItemCard key={it.id} item={it} onEdit={onEdit} />)
          )}
        </View>
      ) : (
        URGENCY_ORDER.map((u) => {
          const group = byUrgency(u);
          if (group.length === 0) return null;
          return (
            <View key={u} style={{ marginTop: spacing.md }}>
              <KText variant="overline" color={colors.textSecondary} style={{ marginBottom: spacing.sm }}>
                {sectionTitle(u)} · {group.length}
              </KText>
              {group.map((it) => (
                <ItemCard key={it.id} item={it} onEdit={onEdit} />
              ))}
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  rowActions: { flexDirection: 'row', gap: 8 },
  empty: { alignItems: 'center' },
  emptyBody: { textAlign: 'center', marginTop: 4, maxWidth: 300 },
});
