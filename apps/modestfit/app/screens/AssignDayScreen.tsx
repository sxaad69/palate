import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { OCCASIONS, type Occasion } from '../data/pieces';
import type { RootStackParamList } from '../navigation';

export function AssignDayScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, outfits, setPlanEntry } = useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AssignDay'>>();
  const s = t();
  const [occasion, setOccasion] = useState<Occasion>('daily');

  const assign = (outfitId: string) => {
    setPlanEntry(route.params.date, { outfitId, occasion, worn: false });
    nav.goBack();
  };

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.md }}>
        {s.pickOutfit}
      </MFText>
      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.occasionLabel}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
        {OCCASIONS.map((o) => (
          <Chip key={o} label={s[`occ_${o}`]} selected={occasion === o} onPress={() => setOccasion(o)} />
        ))}
      </View>
      {outfits.map((o) => (
        <View
          key={o.id}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
            marginBottom: spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <MFText variant="bodySmall">{o.name}</MFText>
            <MFText variant="caption" color={colors.textSecondary}>
              {s[`occ_${o.occasion}`]} · {o.pieceIds.length} {s.piecesLabel}
            </MFText>
          </View>
          <Button title={s.add} size="sm" onPress={() => assign(o.id)} />
        </View>
      ))}
      {outfits.length === 0 && (
        <MFText variant="bodySmall" color={colors.textSecondary}>
          {s.emptyOutfitsDesc}
        </MFText>
      )}
      <Button
        title={s.cancel}
        variant="ghost"
        onPress={() => nav.goBack()}
        style={{ marginTop: spacing.md }}
      />
      <Button
        title={`✕ ${s.noOutfit}`}
        variant="ghost"
        onPress={() => {
          setPlanEntry(route.params.date, null);
          nav.goBack();
        }}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}
