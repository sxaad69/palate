import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MFText } from '../MFText';
import { useTheme } from '../../theme/ThemeProvider';

const { width } = Dimensions.get('window');

export type AvatarModelKey = 'sand' | 'black' | 'olive';

const AVATAR_IMAGES: Record<AvatarModelKey, ImageSourcePropType> = {
  sand: require('../../assets/avatars/modestfit_avatar_sand_default.jpg'),
  black: require('../../assets/avatars/modestfit_avatar_black_abaya.jpg'),
  olive: require('../../assets/avatars/modestfit_avatar_olive_rose.jpg'),
};

export const AVATAR_MODELS: {
  key: AvatarModelKey;
  title: { en: string; ar: string };
  silhouette: { en: string; ar: string };
  defaultTone: string;
}[] = [
  {
    key: 'sand',
    title: { en: 'Sand Linen & Ivory', ar: 'كتان رملي وعاجي' },
    silhouette: { en: 'Draped Trench Abaya', ar: 'عباية ترنش منسدلة' },
    defaultTone: '#CBB180',
  },
  {
    key: 'black',
    title: { en: 'Monochrome Midnight', ar: 'أسود ليلي مونوكروم' },
    silhouette: { en: 'Minimalist Noir Kimono', ar: 'كيمونو أسود ناعم' },
    defaultTone: '#161412',
  },
  {
    key: 'olive',
    title: { en: 'Olive Silk & Rose', ar: 'حرير زيتي ووردي' },
    silhouette: { en: 'Layered Atelier Maxi', ar: 'ماكسي أتيليه بطبقات' },
    defaultTone: '#646B3A',
  },
];

interface Props {
  modelKey: AvatarModelKey;
  onModelChange: (key: AvatarModelKey) => void;
  tintHex?: string;
  harmonyScore?: number;
  modestyScore?: number;
  lang?: 'en' | 'ar';
}

export function AvatarViewport({
  modelKey,
  onModelChange,
  tintHex,
  harmonyScore = 98,
  modestyScore = 100,
  lang = 'en',
}: Props) {
  const { colors } = useTheme();

  const currentModel = AVATAR_MODELS.find((m) => m.key === modelKey) ?? AVATAR_MODELS[0]!;

  const handleNextModel = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const idx = AVATAR_MODELS.findIndex((m) => m.key === modelKey);
    const nextIdx = (idx + 1) % AVATAR_MODELS.length;
    const target = AVATAR_MODELS[nextIdx];
    if (target) onModelChange(target.key);
  };

  const handlePrevModel = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const idx = AVATAR_MODELS.findIndex((m) => m.key === modelKey);
    const prevIdx = (idx - 1 + AVATAR_MODELS.length) % AVATAR_MODELS.length;
    const target = AVATAR_MODELS[prevIdx];
    if (target) onModelChange(target.key);
  };

  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.viewportFrame,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderStrong,
          },
        ]}
      >
        <Image
          source={AVATAR_IMAGES[modelKey]}
          style={styles.avatarImage}
          resizeMode="cover"
        />

        {/* Dynamic code-based tone overlay tint (quiet luxury lighting effect) */}
        {tintHex && (
          <View
            pointerEvents="none"
            style={[
              styles.tintOverlay,
              {
                backgroundColor: tintHex,
                opacity: 0.12,
              },
            ]}
          />
        )}

        {/* Top Floating Badges */}
        <View style={styles.topBadgeRow}>
          <View
            style={[
              styles.badgePill,
              { backgroundColor: 'rgba(22, 20, 18, 0.78)', borderColor: colors.gold },
            ]}
          >
            <MFText variant="caption" color={colors.gold} style={styles.badgeText}>
              ✨ {harmonyScore}% {lang === 'ar' ? 'تناسق' : 'Harmony'}
            </MFText>
          </View>
          <View
            style={[
              styles.badgePill,
              { backgroundColor: 'rgba(22, 20, 18, 0.78)', borderColor: 'rgba(255,255,255,0.2)' },
            ]}
          >
            <MFText variant="caption" color="#FFFFFF" style={styles.badgeText}>
              🛡️ {modestyScore}% {lang === 'ar' ? 'حشمة' : 'Modesty'}
            </MFText>
          </View>
        </View>

        {/* Navigation Arrows for Model Switching */}
        <TouchableOpacity
          onPress={handlePrevModel}
          activeOpacity={0.7}
          style={[styles.arrowButton, styles.leftArrow]}
          accessibilityLabel="Previous Model"
        >
          <MFText variant="body" color="#FFFFFF">
            ‹
          </MFText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextModel}
          activeOpacity={0.7}
          style={[styles.arrowButton, styles.rightArrow]}
          accessibilityLabel="Next Model"
        >
          <MFText variant="body" color="#FFFFFF">
            ›
          </MFText>
        </TouchableOpacity>

        {/* Bottom Silhouette Overlay */}
        <View
          style={[
            styles.bottomMetaContainer,
            {
              backgroundColor: 'rgba(22, 20, 18, 0.88)',
              borderTopColor: colors.gold,
            },
          ]}
        >
          <View style={styles.bottomMetaRow}>
            <View>
              <MFText variant="caption" color={colors.gold} style={styles.metaEyebrow}>
                {lang === 'ar' ? 'الموديل الأتيليه' : 'ATELIER SILHOUETTE'}
              </MFText>
              <MFText variant="body" color="#FFFFFF" style={styles.metaTitle}>
                {currentModel.title[lang]}
              </MFText>
            </View>
            <View
              style={[
                styles.toneIndicator,
                { backgroundColor: tintHex || currentModel.defaultTone },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  viewportFrame: {
    width: width - 32,
    height: 380,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBadgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrowButton: {
    position: 'absolute',
    top: '46%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(22, 20, 18, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftArrow: {
    left: 12,
  },
  rightArrow: {
    right: 12,
  },
  bottomMetaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1.5,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  metaTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  toneIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
