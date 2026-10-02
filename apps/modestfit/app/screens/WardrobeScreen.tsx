import React, { useMemo, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { PieceCard } from '../components/PieceCard';
import { EmptyState } from '../components/EmptyState';
import { CATEGORIES, STARTER_CATALOG, type Category } from '../data/pieces';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WardrobeScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, pieces, addStarterPiece, removePiece } = useModestFit();
  const nav = useNavigation<Nav>();
  const s = t();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pieces.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!q ||
          p.name.en.toLowerCase().includes(q) ||
          p.name.ar.includes(query.trim())),
    );
  }, [pieces, query, cat]);

  const adopt = (id: string) => {
    const def = STARTER_CATALOG.find((d) => d.id === id);
    if (!def) return;
    if (!addStarterPiece(def)) {
      Alert.alert(s.freeLimitTitle, s.freeLimitDesc, [
        { text: s.cancel, style: 'cancel' },
        { text: s.goPro, onPress: () => nav.navigate('Paywall') },
      ]);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(name, '', [
      { text: s.cancel, style: 'cancel' },
      { text: s.delete, style: 'destructive', onPress: () => removePiece(id) },
    ]);
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.sm,
        }}
      >
        <MFText variant="h1">{s.wardrobeTitle}</MFText>
        <Button
          title="📊"
          accessibilityLabel={s.insightsTitle}
          variant="ghost"
          size="sm"
          onPress={() => nav.navigate('Insights')}
        />
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={s.wardrobeSearch}
        placeholderTextColor={colors.textTertiary}
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 48,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
          textAlign: lang === 'ar' ? 'right' : 'left',
        }}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={s[`cat_${c}`]}
            selected={cat === c}
            onPress={() => setCat(cat === c ? null : c)}
          />
        ))}
      </View>

      {filtered.length === 0 && pieces.length === 0 ? (
        <EmptyState
          glyph="👗"
          title={s.emptyWardrobe}
          desc={s.emptyWardrobeDesc}
          actionLabel={s.addPiece}
          onAction={() => nav.navigate('AddPiece')}
        />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {filtered.map((item) => (
            <View key={item.id} style={{ width: '48%', flexGrow: 1 }}>
              <PieceCard
                piece={item}
                onPress={() => confirmDelete(item.id, item.name[lang])}
              />
            </View>
          ))}
        </View>
      )}

      <Button
        title={`＋ ${s.addPiece}`}
        onPress={() => nav.navigate('AddPiece')}
        style={{ marginTop: spacing.lg }}
      />

      <MFText variant="h2" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
        {s.starterIdeas}
      </MFText>
      {STARTER_CATALOG.slice(0, 12).map((d) => (
        <View
          key={d.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.sm,
            marginBottom: spacing.sm,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: d.colorHex,
              marginEnd: spacing.sm,
            }}
          />
          <View style={{ flex: 1 }}>
            <MFText variant="bodySmall">{d.name[lang]}</MFText>
            <MFText variant="caption" color={colors.textSecondary}>
              {s[`cat_${d.category}`]}
            </MFText>
          </View>
          <Button title="＋" size="sm" variant="secondary" onPress={() => adopt(d.id)} />
        </View>
      ))}
    </Screen>
  );
}
