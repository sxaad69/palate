import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import { useStrings } from '../lib/strings';
import { useSobriety } from '../store/sobriety';
import { MILESTONES } from '../data/milestones';

export function MilestonesScreen() {
  const { colors, spacing, radii } = useTheme();
  const { t, locale } = useStrings();
  const { daysClean } = useSobriety();

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1" style={{ marginTop: spacing.md }}>{t.msTitle}</Text>
        <Text variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {t.msSubtitle}
        </Text>
        {MILESTONES.map((m) => {
          const reached = daysClean >= m.days;
          const isNext = !reached && MILESTONES.every((x) => x.days >= m.days || daysClean >= x.days);
          return (
            <View key={m.days} style={styles.row}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: reached ? colors.success : isNext ? colors.accent : colors.surfaceAlt,
                      borderColor: reached ? colors.success : colors.borderStrong,
                    },
                  ]}
                >
                  {reached && <Text variant="caption" color="textInverse">✓</Text>}
                </View>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
              </View>
              <Card
                tone={reached ? 'gold' : 'default'}
                style={[styles.card, { opacity: reached || isNext ? 1 : 0.55 }]}
              >
                <View style={styles.cardHeader}>
                  <Text variant="h3">{locale === 'ar' ? m.titleAr : m.titleEn}</Text>
                  {reached && (
                    <Text variant="caption" color="highlight">✓ {t.msReached}</Text>
                  )}
                </View>
                <Text variant="bodySmall" color="textSecondary">
                  {locale === 'ar' ? m.bodyAr : m.bodyEn}
                </Text>
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 4 },
  rail: { alignItems: 'center', marginEnd: 12, width: 28 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { width: 2, flex: 1, marginTop: 4 },
  card: { flex: 1, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
});
