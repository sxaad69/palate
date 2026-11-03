import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MFText } from '../MFText';
import { useTheme } from '../../theme/ThemeProvider';

export interface ColorSwatch {
  id: string;
  hex: string;
  name: { en: string; ar: string };
}

export const ATELIER_SWATCHES: ColorSwatch[] = [
  { id: 'sand', hex: '#CBB180', name: { en: 'Sand Linen', ar: 'كتان رملي' } },
  { id: 'pearl', hex: '#FDFBF7', name: { en: 'Alabaster', ar: 'مرمر لؤلؤي' } },
  { id: 'olive', hex: '#646B3A', name: { en: 'Olive Silk', ar: 'حرير زيتي' } },
  { id: 'rose', hex: '#D6937C', name: { en: 'Dusty Rose', ar: 'وردي ترابي' } },
  { id: 'gold', hex: '#C5A059', name: { en: 'Champagne', ar: 'ذهب شامبانيا' } },
  { id: 'noir', hex: '#161412', name: { en: 'Midnight Noir', ar: 'أسود ليلي' } },
  { id: 'navy', hex: '#1F2937', name: { en: 'Royal Navy', ar: 'كحلي ملكي' } },
  { id: 'taupe', hex: '#8C7A6B', name: { en: 'Warm Taupe', ar: 'رمادي دافئ' } },
];

interface Props {
  selectedHex: string;
  onSelect: (swatch: ColorSwatch) => void;
  lang?: 'en' | 'ar';
}

export function ColorSwatchPicker({ selectedHex, onSelect, lang = 'en' }: Props) {
  const { colors } = useTheme();

  const handlePress = (swatch: ColorSwatch) => {
    void Haptics.selectionAsync().catch(() => {});
    onSelect(swatch);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {ATELIER_SWATCHES.map((s) => {
          const isSelected = s.hex.toLowerCase() === selectedHex.toLowerCase();
          return (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.8}
              onPress={() => handlePress(s)}
              style={styles.swatchItem}
              accessibilityRole="button"
              accessibilityLabel={s.name[lang]}
            >
              <View
                style={[
                  styles.swatchRing,
                  {
                    borderColor: isSelected ? colors.gold : 'transparent',
                    backgroundColor: colors.surfaceAlt,
                  },
                ]}
              >
                <View
                  style={[
                    styles.swatchCore,
                    {
                      backgroundColor: s.hex,
                      borderColor: colors.border,
                      borderWidth: s.hex === '#FDFBF7' ? 1 : 0,
                    },
                  ]}
                />
              </View>
              <MFText
                variant="caption"
                color={isSelected ? colors.gold : colors.textSecondary}
                style={[styles.swatchLabel, isSelected && styles.swatchLabelActive]}
                numberOfLines={1}
              >
                {s.name[lang]}
              </MFText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  swatchItem: {
    alignItems: 'center',
    width: 64,
  },
  swatchRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  swatchCore: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  swatchLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  swatchLabelActive: {
    fontWeight: '700',
  },
});
