import React, { useState } from 'react';
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
import { type SeedLook } from '../../data/seedStylists';

const { width } = Dimensions.get('window');

const AVATAR_IMAGES: Record<string, ImageSourcePropType> = {
  sand: require('../../assets/avatars/modestfit_avatar_sand_default.jpg'),
  black: require('../../assets/avatars/modestfit_avatar_black_abaya.jpg'),
  olive: require('../../assets/avatars/modestfit_avatar_olive_rose.jpg'),
};

interface Props {
  lookA: SeedLook;
  lookB: SeedLook;
  onVote?: (chosenLookId: string) => void;
  lang?: 'en' | 'ar';
}

export function LookDuelCard({ lookA, lookB, onVote, lang = 'en' }: Props) {
  const { colors } = useTheme();
  const [votedId, setVotedId] = useState<string | null>(null);

  const totalVotes = lookA.votes + lookB.votes + (votedId ? 1 : 0);
  const votesA = lookA.votes + (votedId === lookA.id ? 1 : 0);
  const votesB = lookB.votes + (votedId === lookB.id ? 1 : 0);
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleSelect = (id: string) => {
    if (votedId) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setVotedId(id);
    onVote?.(id);
  };

  const renderSide = (look: SeedLook, pct: number, isLeft: boolean) => {
    const isSelected = votedId === look.id;
    const isWinner = votedId ? pct >= 50 : false;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        disabled={!!votedId}
        onPress={() => handleSelect(look.id)}
        style={[
          styles.sideCard,
          {
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.gold : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={AVATAR_IMAGES[look.avatarKey] || AVATAR_IMAGES.sand}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {votedId && (
            <View
              style={[
                styles.resultOverlay,
                { backgroundColor: isWinner ? 'rgba(197, 160, 89, 0.85)' : 'rgba(22, 20, 18, 0.75)' },
              ]}
            >
              <MFText variant="h2" color="#FFFFFF" style={styles.pctText}>
                {pct}%
              </MFText>
              {isSelected && (
                <MFText variant="caption" color="#FFFFFF" style={styles.votedBadge}>
                  ✓ {lang === 'ar' ? 'صوتك' : 'YOUR VOTE'}
                </MFText>
              )}
            </View>
          )}
        </View>

        <View style={styles.metaBox}>
          <View style={styles.stylistHeader}>
            <MFText variant="caption" color={colors.gold} style={styles.stylistName}>
              {look.stylistName}
            </MFText>
            <MFText variant="caption" color={colors.textTertiary} style={styles.districtName}>
              📍 {look.district}
            </MFText>
          </View>
          <MFText variant="body" color={colors.textPrimary} numberOfLines={2} style={styles.lookTitle}>
            {look.lookTitle}
          </MFText>

          {!votedId ? (
            <View
              style={[
                styles.voteButtonPrompt,
                { backgroundColor: colors.accentMuted, borderColor: colors.border },
              ]}
            >
              <MFText variant="caption" color={colors.textPrimary} style={styles.promptText}>
                {lang === 'ar' ? 'اضغط للتصويت' : 'Tap to Vote'}
              </MFText>
            </View>
          ) : (
            <View style={styles.tallyBox}>
              <MFText variant="caption" color={colors.textSecondary}>
                {isLeft ? votesA : votesB} {lang === 'ar' ? 'صوت' : 'votes'}
              </MFText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.bannerRow}>
        <View>
          <MFText variant="caption" color={colors.gold} style={styles.bannerEyebrow}>
            {lang === 'ar' ? 'نزال الستريت ستايل اليومي' : 'DAILY STREET STYLE DUEL'}
          </MFText>
          <MFText variant="h3" color={colors.textPrimary}>
            {lang === 'ar' ? 'أي إطلالة تعكس التناسق الأرقى؟' : 'Which Curated Silhouette Wins?'}
          </MFText>
        </View>
        {votedId && (
          <View style={[styles.karmaPill, { backgroundColor: colors.goldMuted, borderColor: colors.gold }]}>
            <MFText variant="caption" color={colors.gold} style={styles.karmaText}>
              +10 {lang === 'ar' ? 'نقاط ذوق' : 'Karma'}
            </MFText>
          </View>
        )}
      </View>

      {/* Duel Comparison */}
      <View style={styles.duelRow}>
        {renderSide(lookA, pctA, true)}
        <View style={[styles.vsCircle, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
          <MFText variant="caption" color={colors.gold} style={styles.vsText}>
            VS
          </MFText>
        </View>
        {renderSide(lookB, pctB, false)}
      </View>
    </View>
  );
}

const cardWidth = (width - 44) / 2;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  karmaPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  karmaText: {
    fontWeight: '700',
    fontSize: 11,
  },
  duelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    alignItems: 'center',
  },
  sideCard: {
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pctText: {
    fontSize: 32,
    fontWeight: '800',
  },
  votedBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  metaBox: {
    padding: 10,
  },
  stylistHeader: {
    marginBottom: 4,
  },
  stylistName: {
    fontWeight: '700',
    fontSize: 11,
  },
  districtName: {
    fontSize: 9,
    marginTop: 1,
  },
  lookTitle: {
    fontSize: 12,
    fontWeight: '600',
    minHeight: 32,
    marginBottom: 8,
  },
  voteButtonPrompt: {
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tallyBox: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  vsCircle: {
    position: 'absolute',
    left: '50%',
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  vsText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
