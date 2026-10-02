import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { PieceCard } from '../components/PieceCard';
import { checkOutfit } from '../lib/modesty';
import { OCCASIONS, type Occasion } from '../data/pieces';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'CreateOutfit'>;

export function CreateOutfitScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, pieces, prefs, addOutfit } = useModestFit();
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const s = t();

  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState<Occasion>('daily');
  const [selected, setSelected] = useState<string[]>([
    ...(route.params?.suggestionBaseIds ?? []),
    ...(route.params?.suggestionHijabId ? [route.params.suggestionHijabId] : []),
  ]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const selectedPieces = useMemo(
    () =>
      selected
        .map((id) => pieces.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => !!p),
    [selected, pieces],
  );
  const issues = checkOutfit(selectedPieces, prefs);

  const save = () => {
    if (selected.length === 0) return;
    addOutfit({
      name: name.trim() || `${s[`occ_${occasion}`]} · ${selected.length}`,
      pieceIds: selected,
      occasion,
    });
    nav.goBack();
  };

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.md }}>
        {s.createOutfit}
      </MFText>

      <MFText variant="h3" style={{ marginBottom: spacing.xs }}>
        {s.outfitName}
      </MFText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={s.outfitNamePh}
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
          marginBottom: spacing.md,
          textAlign: lang === 'ar' ? 'right' : 'left',
        }}
      />

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.occasionLabel}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
        {OCCASIONS.map((o) => (
          <Chip key={o} label={s[`occ_${o}`]} selected={occasion === o} onPress={() => setOccasion(o)} />
        ))}
      </View>

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.selectPieces} ({selected.length})
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {pieces.map((item) => (
          <View key={item.id} style={{ width: '48%', flexGrow: 1 }}>
            <PieceCard
              piece={item}
              selected={selected.includes(item.id)}
              onPress={() => toggle(item.id)}
            />
          </View>
        ))}
      </View>

      {selected.length > 0 && (
        <View
          style={{
            backgroundColor: issues.length === 0 ? colors.accentMuted : colors.roseMuted,
            borderRadius: radii.lg,
            padding: spacing.md,
            marginTop: spacing.md,
          }}
        >
          <MFText variant="bodySmall" color={issues.length === 0 ? colors.accent : colors.rose}>
            {issues.length === 0 ? `✓ ${s.modestyOk}` : `⚠ ${s.modestyFail}`}
          </MFText>
        </View>
      )}

      <Button title={s.save} onPress={save} disabled={selected.length === 0} style={{ marginTop: spacing.lg }} />
    </Screen>
  );
}
