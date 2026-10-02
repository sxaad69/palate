import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useTheme } from '../theme/ThemeProvider';
import { useApp, type LoggedMeal } from '../store/app';
import type { RootTabParamList } from '../navigation';

type Phase = 'idle' | 'analyzing' | 'result';

// Simulated AI result — a real vision model plugs in here later.
// Nutrition is an AI estimate snapshot, stored on the meal when logged.
const SIMULATED_RESULT: Omit<LoggedMeal, 'id' | 'mealType' | 'plates' | 'loggedDate'> = {
  dishId: 'ap-kabsa',
  nameEn: 'Chicken Kabsa',
  nameAr: 'كبسة دجاج',
  cuisine: 'Gulf',
  region: 'Arabian Peninsula',
  nutrition: { calories: 640, protein: 42, carbs: 58, fat: 22 },
  tags: ['rice', 'chicken', 'spiced'],
  allergens: [],
};

function mealTypeForNow(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Breakfast';
  if (h < 16) return 'Lunch';
  if (h < 21) return 'Dinner';
  return 'Snack';
}

export function ScanScreen() {
  const { colors, spacing, radii } = useTheme();
  const { addMeal, freeScansLeft, useFreeScan } = useApp();
  const tabNav = useNavigation<NavigationProp<RootTabParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // One tap = one scan. Exhausted free scans route to the paywall.
  const analyze = () => {
    if (!useFreeScan()) {
      tabNav.navigate('Profile', { screen: 'Paywall' });
      return;
    }
    setPhase('analyzing');
    timer.current = setTimeout(() => setPhase('result'), 2000);
  };

  const logMeal = () => {
    addMeal({ ...SIMULATED_RESULT, mealType: mealTypeForNow(), plates: 1 });
    setPhase('idle');
    tabNav.navigate('Today');
  };

  const scansChip =
    freeScansLeft > 0 ? (
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Chip label={`✨ ${freeScansLeft} free scan${freeScansLeft === 1 ? '' : 's'} left`} />
      </View>
    ) : null;

  return (
    <Screen>
      <View style={styles.center}>
        {phase === 'idle' && (
          <>
            {permission === null ? (
              <ActivityIndicator size="large" color={colors.accent} />
            ) : permission.granted ? (
              <CameraView
                style={[
                  styles.frame,
                  { borderRadius: radii.xl, marginBottom: spacing.lg },
                ]}
                facing="back"
              />
            ) : (
              <>
                <View
                  style={[
                    styles.frame,
                    {
                      borderColor: colors.borderStrong,
                      borderRadius: radii.xl,
                      padding: spacing.lg,
                      marginBottom: spacing.lg,
                      borderWidth: 2,
                      borderStyle: 'dashed',
                    },
                  ]}
                >
                  <Ionicons
                    name="camera-outline"
                    size={56}
                    color={colors.textTertiary}
                  />
                  <Text
                    variant="bodySmall"
                    color="textTertiary"
                    style={{ textAlign: 'center', marginTop: spacing.sm }}
                  >
                    Palate needs camera access to snap your meals
                  </Text>
                </View>
                <View style={{ width: '100%', marginBottom: spacing.sm }}>
                  <Button
                    title="Grant camera access"
                    onPress={requestPermission}
                  />
                </View>
              </>
            )}
            {scansChip}
            <Text
              variant="bodySmall"
              color="textSecondary"
              style={{ textAlign: 'center', marginBottom: spacing.lg }}
            >
              Point at any dish — Palate recognizes cuisines from around the
              world, not just Western food.
            </Text>
            <Button
              title={permission?.granted ? 'Analyze meal' : 'Simulate scan'}
              onPress={analyze}
            />
          </>
        )}

        {phase === 'analyzing' && (
          <>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text
              variant="body"
              color="textSecondary"
              style={{ marginTop: spacing.md }}
            >
              Identifying your dish…
            </Text>
          </>
        )}

        {phase === 'result' && (
          <Card style={styles.resultCard}>
            <View style={[styles.resultHead, { marginBottom: spacing.sm }]}>
              <View style={{ flex: 1 }}>
                <Text variant="h2">{SIMULATED_RESULT.nameEn}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  {SIMULATED_RESULT.nameAr}
                </Text>
              </View>
              <Chip label={SIMULATED_RESULT.cuisine} />
            </View>
            <Text
              variant="caption"
              color="textTertiary"
              style={{ marginBottom: spacing.md }}
            >
              AI estimate — confirm before logging
            </Text>
            <View style={[styles.nutGrid, { gap: spacing.sm, marginBottom: spacing.lg }]}>
              {(
                [
                  ['Calories', `${SIMULATED_RESULT.nutrition.calories}`],
                  ['Protein', `${SIMULATED_RESULT.nutrition.protein}g`],
                  ['Carbs', `${SIMULATED_RESULT.nutrition.carbs}g`],
                  ['Fat', `${SIMULATED_RESULT.nutrition.fat}g`],
                ] as const
              ).map(([label, value]) => (
                <View
                  key={label}
                  style={[
                    styles.nutCell,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderRadius: radii.md,
                      padding: spacing.sm,
                    },
                  ]}
                >
                  <Text variant="h3">{value}</Text>
                  <Text variant="caption" color="textSecondary">
                    {label}
                  </Text>
                </View>
              ))}
            </View>
            <Button title="Log this meal" onPress={logMeal} />
            <View style={{ marginTop: spacing.sm }}>
              <Button
                title="Scan again"
                variant="ghost"
                onPress={() => setPhase('idle')}
              />
            </View>
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  resultCard: { width: '100%' },
  resultHead: { flexDirection: 'row', alignItems: 'flex-start' },
  nutGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  nutCell: { flexBasis: '48%', flexGrow: 1, alignItems: 'center' },
});
