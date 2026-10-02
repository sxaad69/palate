import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { generateSuggestions } from '../lib/suggest';
import { OCCASIONS, type Occasion } from '../data/pieces';
import type { RootStackParamList } from '../navigation';

export function SuggestScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, pieces, prefs, pieceById } = useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = t();
  const [occasion, setOccasion] = useState<Occasion>('daily');
  const [round, setRound] = useState(0);

  // Deterministic per occasion; "shuffle" just rotates the window.
  const suggestions = useMemo(
    () => generateSuggestions(pieces, occasion, prefs, 6 + (round % 3)),
    [pieces, occasion, prefs, round],
  );

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.xs }}>
        {s.suggestTitle}
      </MFText>
      <MFText variant="bodySmall" color={colors.textSecondary} style={{ marginBottom: spacing.md }}>
        {s.suggestDesc}
      </MFText>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
        {OCCASIONS.map((o) => (
          <Chip
            key={o}
            label={s[`occ_${o}`]}
            selected={occasion === o}
            onPress={() => {
              setOccasion(o);
              setRound(0);
            }}
          />
        ))}
      </View>

      {suggestions.length === 0 ? (
        <EmptyState
          glyph="💡"
          title={s.noSuggestions}
          desc={s.noSuggestionsDesc}
          actionLabel={s.addPiece}
          onAction={() => nav.navigate('AddPiece')}
        />
      ) : (
        <>
          {suggestions.map((sg, i) => {
            const base = sg.baseIds
              .map((id) => pieceById(id))
              .filter((p): p is NonNullable<typeof p> => !!p);
            const hijab = pieceById(sg.hijabId);
            if (!hijab) return null;
            return (
              <View
                key={sg.key}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: spacing.sm,
                  }}
                >
                  <MFText variant="overline" color={colors.textSecondary}>
                    {s[`occ_${occasion}`].toUpperCase()}
                  </MFText>
                  {i === 0 && (
                    <View
                      style={{
                        backgroundColor: colors.accentMuted,
                        borderRadius: radii.full,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.sm,
                      }}
                    >
                      <MFText variant="caption" color={colors.accent}>
                        {s.bestMatch}
                      </MFText>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                  {[...base, hijab].map((p) => (
                    <View
                      key={p.id}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: p.colorHex,
                        marginEnd: spacing.xs,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    />
                  ))}
                </View>
                {base.map((p) => (
                  <MFText key={p.id} variant="bodySmall" color={colors.textSecondary}>
                    • {p.name[lang]}
                  </MFText>
                ))}
                <MFText variant="bodySmall" style={{ marginTop: spacing.xs }}>
                  🧕 {s.hijabPairing}: {hijab.name[lang]}
                </MFText>
                <Button
                  title={s.saveOutfit}
                  size="sm"
                  variant="secondary"
                  onPress={() =>
                    nav.navigate('CreateOutfit', {
                      suggestionBaseIds: sg.baseIds,
                      suggestionHijabId: sg.hijabId,
                    })
                  }
                  style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}
                />
              </View>
            );
          })}
          <Button
            title={`↻ ${s.regenerate}`}
            variant="ghost"
            onPress={() => setRound((r) => r + 1)}
            style={{ marginTop: spacing.sm }}
          />
        </>
      )}
    </Screen>
  );
}
