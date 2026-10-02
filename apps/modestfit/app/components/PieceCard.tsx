import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { MFText } from './MFText';
import { useModestFit } from '../store/app';
import type { OwnedPiece, PieceDef } from '../data/pieces';
import { t } from '../lib/i18n';

// Grid card for a wardrobe piece: photo or color swatch, name, wear count.
export function PieceCard({
  piece,
  onPress,
  selected,
}: {
  piece: OwnedPiece | PieceDef;
  onPress?: () => void;
  selected?: boolean;
}) {
  const { colors, spacing, radii } = useTheme();
  const { lang } = useModestFit();
  const wearCount = 'wearCount' in piece ? piece.wearCount : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={piece.name[lang]}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      disabled={!onPress}
      android_ripple={{ color: colors.overlay }}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.accent : colors.border,
        overflow: 'hidden',
        opacity: pressed ? 0.85 : 1,
        minWidth: 0,
      })}
    >
      {'photo' in piece && piece.photo ? (
        <Image
          source={{ uri: piece.photo }}
          style={{ width: '100%', aspectRatio: 3 / 4, backgroundColor: colors.surfaceAlt }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            aspectRatio: 3 / 4,
            backgroundColor: piece.colorHex,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MFText variant="display" color="rgba(255,255,255,0.85)">
            {categoryGlyph(piece.category)}
          </MFText>
        </View>
      )}
      <View style={{ padding: spacing.sm }}>
        <MFText variant="bodySmall" numberOfLines={1}>
          {piece.name[lang]}
        </MFText>
        <MFText variant="caption" color={colors.textSecondary}>
          {wearCount} {t().wears}
        </MFText>
      </View>
    </Pressable>
  );
}

function categoryGlyph(c: OwnedPiece['category']): string {
  switch (c) {
    case 'abaya': return '🖤';
    case 'hijab': return '🧕';
    case 'skirt': return '👗';
    case 'trousers': return '👖';
    case 'top': return '👚';
    case 'dress': return '👘';
    case 'outerwear': return '🧥';
  }
}
