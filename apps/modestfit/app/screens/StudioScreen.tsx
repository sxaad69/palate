import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { AvatarViewport, type AvatarModelKey } from '../components/avatar/AvatarViewport';
import { ColorSwatchPicker, type ColorSwatch } from '../components/avatar/ColorSwatchPicker';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import type { RootTabParamList } from '../navigation';

type GarmentCategory = 'abaya' | 'hijab' | 'trousers' | 'layer';

export function StudioScreen() {
  const { colors, spacing } = useTheme();
  const s = t();
  const { lang, isPro } = useModestFit();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const [modelKey, setModelKey] = useState<AvatarModelKey>('sand');
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('abaya');
  const [tones, setTones] = useState<Record<GarmentCategory, string>>({
    abaya: '#CBB180',
    hijab: '#FDFBF7',
    trousers: '#161412',
    layer: '#8C7A6B',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories: { key: GarmentCategory; label: string; icon: string }[] = [
    { key: 'abaya', label: s.categoryAbaya, icon: '👘' },
    { key: 'hijab', label: s.categoryHijab, icon: '🧕' },
    { key: 'trousers', label: s.categoryTrousers, icon: '👖' },
    { key: 'layer', label: s.categoryLayer, icon: '✨' },
  ];

  const handleSelectSwatch = (swatch: ColorSwatch) => {
    setTones((prev) => ({
      ...prev,
      [activeCategory]: swatch.hex,
    }));
  };

  const handleSaveLook = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleEnterDuel = () => {
    void Haptics.selectionAsync().catch(() => {});
    navigation.navigate('Runway');
  };

  const openPaywall = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).navigate('Paywall');
  };

  return (
    <Screen scroll={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <View>
            <MFText variant="caption" color={colors.gold} style={styles.eyebrow}>
              MODESTFIT ATELIER · V2
            </MFText>
            <MFText variant="h1" color={colors.textPrimary}>
              {s.studioTitle}
            </MFText>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openPaywall}
            style={[
              styles.proPill,
              {
                backgroundColor: isPro ? colors.surfaceAlt : colors.goldMuted,
                borderColor: colors.gold,
              },
            ]}
          >
            <MFText variant="caption" color={colors.gold} style={styles.proPillText}>
              {isPro ? '👑 VIP ATELIER' : '✨ GO PRO'}
            </MFText>
          </TouchableOpacity>
        </View>

        {/* 2D Editorial Avatar Canvas */}
        <AvatarViewport
          modelKey={modelKey}
          onModelChange={setModelKey}
          tintHex={tones[activeCategory]}
          harmonyScore={98}
          modestyScore={100}
          lang={lang}
        />

        {/* Category Selector Tabs */}
        <View style={styles.categoryBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryBar}>
            {categories.map((c) => {
              const isActive = activeCategory === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  activeOpacity={0.7}
                  onPress={() => {
                    void Haptics.selectionAsync().catch(() => {});
                    setActiveCategory(c.key);
                  }}
                  style={[
                    styles.categoryTab,
                    {
                      backgroundColor: isActive ? colors.surface : colors.surfaceAlt,
                      borderColor: isActive ? colors.gold : colors.border,
                    },
                  ]}
                >
                  <MFText variant="body">{c.icon}</MFText>
                  <MFText
                    variant="caption"
                    color={isActive ? colors.gold : colors.textSecondary}
                    style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}
                  >
                    {c.label}
                  </MFText>
                  <View
                    style={[
                      styles.categoryToneDot,
                      { backgroundColor: tones[c.key], borderColor: colors.border },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Horizontal Nuance Swatches */}
        <View style={styles.swatchSection}>
          <View style={styles.swatchHeader}>
            <MFText variant="caption" color={colors.textSecondary} style={styles.swatchHeaderTitle}>
              {s.toneHarmony} — {categories.find((c) => c.key === activeCategory)?.label}
            </MFText>
            <MFText variant="caption" color={colors.gold} style={styles.swatchHex}>
              {tones[activeCategory]}
            </MFText>
          </View>
          <ColorSwatchPicker
            selectedHex={tones[activeCategory]}
            onSelect={handleSelectSwatch}
            lang={lang}
          />
        </View>

        {/* Editorial Harmony Card */}
        <View
          style={[
            styles.harmonyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderStrong,
            },
          ]}
        >
          <View style={styles.harmonyHeaderRow}>
            <MFText variant="caption" color={colors.gold} style={styles.harmonyEyebrow}>
              ✨ ATELIER CRITIQUE & HARMONY
            </MFText>
            <MFText variant="caption" color={colors.success} style={styles.complianceBadge}>
              ✓ {s.modestyCompliance}
            </MFText>
          </View>
          <MFText variant="caption" color={colors.textSecondary} style={styles.harmonyDesc}>
            {lang === 'ar'
              ? 'تدرج الكتان الرملي ينسجم تماماً مع درجات الحرير المحايدة ليمنح قواماً انسيابياً محتشماً دون شفافية.'
              : 'Tonal layering of Sand Linen and muted silks achieves flawless vertical proportion with certified zero-sheer coverage.'}
          </MFText>
        </View>

        {/* Action Row */}
        <View style={[styles.actionRow, { gap: spacing.sm }]}>
          <View style={styles.btnFlex}>
            <Button
              title={savedSuccess ? `✓ ${s.lookSaved}` : s.saveToStudio}
              onPress={handleSaveLook}
              variant={savedSuccess ? 'secondary' : 'primary'}
            />
          </View>
          <View style={styles.btnFlex}>
            <Button
              title={s.enterDuel}
              onPress={handleEnterDuel}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  proPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  proPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryBarWrapper: {
    marginVertical: 10,
  },
  categoryBar: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  categoryTabText: {
    fontSize: 12,
  },
  categoryTabTextActive: {
    fontWeight: '700',
  },
  categoryToneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  swatchSection: {
    marginBottom: 12,
  },
  swatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  swatchHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  swatchHex: {
    fontSize: 11,
    fontWeight: '700',
  },
  harmonyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  harmonyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  harmonyEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  complianceBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  harmonyDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  btnFlex: {
    flex: 1,
  },
});
