import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';

const FEATURES = [
  {
    icon: 'scan-outline' as const,
    title: 'Unlimited AI scans',
    subtitle: 'Snap every meal, no daily limits',
  },
  {
    icon: 'time-outline' as const,
    title: 'Full nutrition history',
    subtitle: 'Every meal, searchable, forever',
  },
  {
    icon: 'options-outline' as const,
    title: 'Custom goals',
    subtitle: 'Calories and macros tuned to you',
  },
  {
    icon: 'globe-outline' as const,
    title: 'Priority new cuisines',
    subtitle: 'Vote on the next cuisine packs',
  },
];

export function PaywallScreen() {
  const { colors, spacing, radii } = useTheme();
  const [comingSoon, setComingSoon] = useState(false);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingVertical: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { marginBottom: spacing.lg }]}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor: colors.accent,
                borderRadius: radii.full,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={36}
              color={colors.textInverse}
            />
          </View>
          <Text variant="display">Palate Pro</Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            Your food, fully understood.
          </Text>
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          {FEATURES.map((f, i) => (
            <View
              key={f.title}
              style={[
                styles.feature,
                i < FEATURES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
                { paddingVertical: spacing.sm },
              ]}
            >
              <View
                style={[
                  styles.featureIcon,
                  {
                    backgroundColor: colors.accentMuted,
                    borderRadius: radii.full,
                    marginEnd: spacing.md,
                  },
                ]}
              >
                <Ionicons name={f.icon} size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body">{f.title}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  {f.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        <Card
          style={{
            marginBottom: spacing.lg,
            backgroundColor: colors.accentMuted,
          }}
        >
          <View style={styles.priceRow}>
            <View>
              <Text variant="h1">$4.99</Text>
              <Text variant="bodySmall" color="textSecondary">
                per month · cancel anytime
              </Text>
            </View>
            <View
              style={[
                styles.trial,
                {
                  backgroundColor: colors.accent,
                  borderRadius: radii.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                },
              ]}
            >
              <Text variant="caption" color="textInverse">
                7-day free trial
              </Text>
            </View>
          </View>
        </Card>

        <Button
          title={comingSoon ? 'Coming soon' : 'Start free trial'}
          disabled={comingSoon}
          onPress={() => setComingSoon(true)}
        />
        <View style={{ marginTop: spacing.sm }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore purchase"
            onPress={() => setComingSoon(true)}
            style={styles.restore}
          >
            <Text variant="bodySmall" color="textSecondary">
              {comingSoon
                ? 'Purchases open at launch — stay tuned.'
                : 'Restore purchase'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  logo: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feature: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trial: { alignSelf: 'flex-start' },
  restore: { alignItems: 'center', paddingVertical: 12, minHeight: 48 },
});
