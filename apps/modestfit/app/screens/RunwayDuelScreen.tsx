import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { LookDuelCard } from '../components/social/LookDuelCard';
import { LeaderboardFeed } from '../components/social/LeaderboardFeed';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit } from '../store/app';
import { t } from '../lib/i18n';
import { SEED_DUEL_LOOKS } from '../data/seedStylists';
import type { RootTabParamList } from '../navigation';

export function RunwayDuelScreen() {
  const { colors } = useTheme();
  const s = t();
  const { lang, isPro } = useModestFit();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const [karmaStreak, setKarmaStreak] = useState(3);
  const [karmaPoints, setKarmaPoints] = useState(140);

  const handleVote = (_chosenId: string) => {
    setKarmaStreak((prev) => prev + 1);
    setKarmaPoints((prev) => prev + 10);
  };

  const handleGoToStudio = () => {
    void Haptics.selectionAsync().catch(() => {});
    navigation.navigate('Studio');
  };

  const openPaywall = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).navigate('Paywall');
  };

  return (
    <Screen scroll={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <MFText variant="caption" color={colors.gold} style={styles.eyebrow}>
              HAUTE RUNWAY · STREET DUEL
            </MFText>
            <MFText variant="h1" color={colors.textPrimary}>
              {s.runwayTitle}
            </MFText>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: colors.surfaceAlt, borderColor: colors.gold }]}>
            <MFText variant="caption" color={colors.gold} style={styles.streakText}>
              🔥 {karmaStreak} {lang === 'ar' ? 'أيام تتابع' : 'Day Streak'}
            </MFText>
            <MFText variant="caption" color={colors.textTertiary} style={styles.karmaText}>
              {karmaPoints} {lang === 'ar' ? 'نقطة ذوق' : 'Karma'}
            </MFText>
          </View>
        </View>

        {/* Daily Street Style Duel Component */}
        <LookDuelCard
          lookA={SEED_DUEL_LOOKS[0]}
          lookB={SEED_DUEL_LOOKS[1]}
          onVote={handleVote}
          lang={lang}
        />

        {/* Atelier CTA Banner */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={isPro ? handleGoToStudio : openPaywall}
            style={[
              styles.ctaCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.gold,
              },
            ]}
          >
            <View style={styles.ctaTextCol}>
              <MFText variant="caption" color={colors.gold} style={styles.ctaEyebrow}>
                {isPro ? '👑 ATELIER COUTURE ACTIVE' : '✨ SUBMIT YOUR OWN LOOK'}
              </MFText>
              <MFText variant="body" color={colors.textPrimary} style={styles.ctaTitle}>
                {lang === 'ar'
                  ? 'صممي إطلالتك في الأتيليه وادخلي نزال الحي'
                  : 'Dress your avatar & compete for District Stylist #1'}
              </MFText>
            </View>
            <View style={[styles.ctaButtonPill, { backgroundColor: colors.gold }]}>
              <MFText variant="caption" color="#FFFFFF" style={styles.ctaBtnText}>
                {isPro ? (lang === 'ar' ? 'الأتيليه' : 'Studio') : (lang === 'ar' ? 'ترقية' : 'Unlock')}
              </MFText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stylist Leaderboard Feed */}
        <LeaderboardFeed lang={lang} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'flex-end',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
  },
  karmaText: {
    fontSize: 9,
    marginTop: 1,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaTextCol: {
    flex: 1,
    marginRight: 10,
  },
  ctaEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  ctaTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  ctaButtonPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaBtnText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
