import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { checkOutfit } from '../lib/modesty';
import type { RootStackParamList } from '../navigation';

export function OutfitsScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, outfits, pieceById, removeOutfit, prefs } = useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = t();
  const [expanded, setExpanded] = useState<string | null>(null);

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(name, '', [
      { text: s.cancel, style: 'cancel' },
      { text: s.delete, style: 'destructive', onPress: () => removeOutfit(id) },
    ]);
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}
      >
        <MFText variant="h1">{s.outfitsTitle}</MFText>
        <Button title={`＋ ${s.createOutfit}`} size="sm" onPress={() => nav.navigate('CreateOutfit')} />
      </View>

      {outfits.length === 0 ? (
        <EmptyState
          glyph="✨"
          title={s.emptyOutfits}
          desc={s.emptyOutfitsDesc}
          actionLabel={s.createOutfit}
          onAction={() => nav.navigate('CreateOutfit')}
        />
      ) : (
        outfits.map((o) => {
          const pieces = o.pieceIds
            .map((id) => pieceById(id))
            .filter((p): p is NonNullable<typeof p> => !!p);
          const issues = checkOutfit(pieces, prefs);
          const open = expanded === o.id;
          return (
            <View
              key={o.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: radii.lg,
                borderWidth: 1,
                borderColor: colors.border,
                padding: spacing.md,
                marginBottom: spacing.sm,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <MFText variant="h3">{o.name}</MFText>
                  <MFText variant="caption" color={colors.textSecondary}>
                    {s[`occ_${o.occasion}`]} · {pieces.length} {s.piecesLabel}
                  </MFText>
                </View>
                <View
                  style={{
                    backgroundColor: issues.length === 0 ? colors.accentMuted : colors.roseMuted,
                    borderRadius: radii.full,
                    paddingVertical: spacing.xs,
                    paddingHorizontal: spacing.sm,
                  }}
                >
                  <MFText
                    variant="caption"
                    color={issues.length === 0 ? colors.accent : colors.rose}
                  >
                    {issues.length === 0 ? `✓ ${s.modestyOk}` : `⚠ ${s.modestyFail}`}
                  </MFText>
                </View>
              </View>
              {open && (
                <View style={{ marginTop: spacing.sm }}>
                  {pieces.map((p) => (
                    <MFText key={p.id} variant="bodySmall" color={colors.textSecondary}>
                      • {p.name[lang]}
                    </MFText>
                  ))}
                </View>
              )}
              <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
                <Button
                  title={open ? s.close : s.selectPieces}
                  size="sm"
                  variant="ghost"
                  onPress={() => setExpanded(open ? null : o.id)}
                />
                <View style={{ width: spacing.sm }} />
                <Button
                  title={s.delete}
                  size="sm"
                  variant="ghost"
                  onPress={() => confirmDelete(o.id, o.name)}
                />
              </View>
            </View>
          );
        })
      )}
    </Screen>
  );
}
