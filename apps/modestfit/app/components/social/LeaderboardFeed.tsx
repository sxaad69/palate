import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MFText } from '../MFText';
import { useTheme } from '../../theme/ThemeProvider';
import {
  SEED_LEADERBOARD_DISTRICT,
  SEED_LEADERBOARD_GLOBAL,
  type StylistRank,
} from '../../data/seedStylists';

const AVATAR_IMAGES: Record<string, ImageSourcePropType> = {
  sand: require('../../assets/avatars/modestfit_avatar_sand_default.jpg'),
  black: require('../../assets/avatars/modestfit_avatar_black_abaya.jpg'),
  olive: require('../../assets/avatars/modestfit_avatar_olive_rose.jpg'),
};

type Scope = 'district' | 'gcc' | 'global';

interface Props {
  lang?: 'en' | 'ar';
}

export function LeaderboardFeed({ lang = 'en' }: Props) {
  const { colors } = useTheme();
  const [scope, setScope] = useState<Scope>('district');

  const ranks: StylistRank[] =
    scope === 'global' ? SEED_LEADERBOARD_GLOBAL : SEED_LEADERBOARD_DISTRICT;

  const top3 = ranks.slice(0, 3);
  const rest = ranks.slice(3);

  const handleTab = (s: Scope) => {
    void Haptics.selectionAsync().catch(() => {});
    setScope(s);
  };

  const getPodiumBadgeColor = (rank: number) => {
    if (rank === 1) return colors.gold;
    if (rank === 2) return '#A0A0A0';
    return '#B87333';
  };

  return (
    <View style={styles.container}>
      {/* Scope Selector Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => handleTab('district')}
          style={[styles.tabBtn, scope === 'district' && { backgroundColor: colors.surface }]}
        >
          <MFText
            variant="caption"
            color={scope === 'district' ? colors.gold : colors.textSecondary}
            style={scope === 'district' ? styles.activeTabText : styles.tabText}
          >
            📍 {lang === 'ar' ? 'الحي / دبي' : 'District'}
          </MFText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTab('gcc')}
          style={[styles.tabBtn, scope === 'gcc' && { backgroundColor: colors.surface }]}
        >
          <MFText
            variant="caption"
            color={scope === 'gcc' ? colors.gold : colors.textSecondary}
            style={scope === 'gcc' ? styles.activeTabText : styles.tabText}
          >
            🌙 {lang === 'ar' ? 'الخليج والشرق' : 'GCC / Region'}
          </MFText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTab('global')}
          style={[styles.tabBtn, scope === 'global' && { backgroundColor: colors.surface }]}
        >
          <MFText
            variant="caption"
            color={scope === 'global' ? colors.gold : colors.textSecondary}
            style={scope === 'global' ? styles.activeTabText : styles.tabText}
          >
            🌍 {lang === 'ar' ? 'عالمي' : 'Global'}
          </MFText>
        </TouchableOpacity>
      </View>

      {/* Top 3 Podium Cards */}
      <View style={styles.podiumRow}>
        {/* Rank 2 */}
        {top3[1] && (
          <View style={[styles.podiumCol, { marginTop: 24 }]}>
            <View style={styles.avatarCircleWrapper}>
              <Image
                source={AVATAR_IMAGES[top3[1].avatarKey] || AVATAR_IMAGES.sand}
                style={styles.podiumAvatar}
              />
              <View style={[styles.rankPill, { backgroundColor: getPodiumBadgeColor(2) }]}>
                <MFText variant="caption" color="#FFFFFF" style={styles.rankPillText}>
                  2
                </MFText>
              </View>
            </View>
            <MFText variant="caption" color={colors.textPrimary} numberOfLines={1} style={styles.podiumName}>
              {top3[1].name}
            </MFText>
            <MFText variant="caption" color={colors.textTertiary} style={styles.podiumVotes}>
              {top3[1].votes} pts
            </MFText>
          </View>
        )}

        {/* Rank 1 (Master Stylist) */}
        {top3[0] && (
          <View style={[styles.podiumCol, styles.podiumColFirst]}>
            <View style={styles.crownContainer}>
              <MFText variant="h3">👑</MFText>
            </View>
            <View style={[styles.avatarCircleWrapper, { borderColor: colors.gold, borderWidth: 2 }]}>
              <Image
                source={AVATAR_IMAGES[top3[0].avatarKey] || AVATAR_IMAGES.sand}
                style={[styles.podiumAvatar, styles.podiumAvatarLarge]}
              />
              <View style={[styles.rankPill, { backgroundColor: getPodiumBadgeColor(1) }]}>
                <MFText variant="caption" color="#FFFFFF" style={styles.rankPillText}>
                  1
                </MFText>
              </View>
            </View>
            <MFText variant="caption" color={colors.gold} numberOfLines={1} style={[styles.podiumName, { fontWeight: '800' }]}>
              {top3[0].name}
            </MFText>
            <MFText variant="caption" color={colors.textSecondary} style={styles.podiumVotes}>
              {top3[0].votes} pts
            </MFText>
          </View>
        )}

        {/* Rank 3 */}
        {top3[2] && (
          <View style={[styles.podiumCol, { marginTop: 32 }]}>
            <View style={styles.avatarCircleWrapper}>
              <Image
                source={AVATAR_IMAGES[top3[2].avatarKey] || AVATAR_IMAGES.sand}
                style={styles.podiumAvatar}
              />
              <View style={[styles.rankPill, { backgroundColor: getPodiumBadgeColor(3) }]}>
                <MFText variant="caption" color="#FFFFFF" style={styles.rankPillText}>
                  3
                </MFText>
              </View>
            </View>
            <MFText variant="caption" color={colors.textPrimary} numberOfLines={1} style={styles.podiumName}>
              {top3[2].name}
            </MFText>
            <MFText variant="caption" color={colors.textTertiary} style={styles.podiumVotes}>
              {top3[2].votes} pts
            </MFText>
          </View>
        )}
      </View>

      {/* Ranks 4+ List */}
      <View style={styles.rankedList}>
        {rest.map((s) => (
          <View
            key={s.rank}
            style={[
              styles.rankedRow,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.rankNumberBox}>
              <MFText variant="body" color={colors.textTertiary} style={styles.rankNumber}>
                #{s.rank}
              </MFText>
            </View>

            <Image
              source={AVATAR_IMAGES[s.avatarKey] || AVATAR_IMAGES.sand}
              style={styles.listAvatar}
            />

            <View style={styles.stylistInfo}>
              <MFText variant="body" color={colors.textPrimary} style={styles.rowName}>
                {s.name}
              </MFText>
              <MFText variant="caption" color={colors.textTertiary}>
                {s.badge} • {s.specialty}
              </MFText>
            </View>

            <View style={styles.rowPointsBox}>
              <MFText variant="body" color={colors.gold} style={styles.rowVotes}>
                {s.votes}
              </MFText>
              <MFText variant="caption" color={colors.textTertiary}>
                {lang === 'ar' ? 'صوت' : 'pts'}
              </MFText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  podiumCol: {
    alignItems: 'center',
    width: 90,
  },
  podiumColFirst: {
    marginTop: 0,
    width: 104,
  },
  crownContainer: {
    marginBottom: -6,
    zIndex: 5,
  },
  avatarCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'relative',
    marginBottom: 6,
  },
  podiumAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  podiumAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  rankPill: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  rankPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  podiumVotes: {
    fontSize: 10,
    marginTop: 2,
  },
  rankedList: {
    gap: 8,
  },
  rankedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  rankNumberBox: {
    width: 32,
    alignItems: 'center',
  },
  rankNumber: {
    fontWeight: '700',
    fontSize: 14,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  stylistInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowPointsBox: {
    alignItems: 'flex-end',
  },
  rowVotes: {
    fontWeight: '700',
    fontSize: 14,
  },
});
