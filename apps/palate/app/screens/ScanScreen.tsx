import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
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
import {
  analyzeMeal,
  mealInputFromAnalysis,
  FreeScansExhaustedError,
  type DishGuess,
} from '../lib/api';
import { getDeviceId } from '../lib/device';
import type { RootTabParamList } from '../navigation';

type Phase = 'idle' | 'analyzing' | 'result' | 'unknown';

// Fallback when the camera or backend is unavailable — the demo never
// dead-ends. Nutrition is an AI estimate snapshot, stored when logged.
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

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof RNTextInput>) {
  const { colors, spacing, radii, typography } = useTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        variant="bodySmall"
        color="textSecondary"
        style={{ marginBottom: spacing.xs }}
      >
        {label}
      </Text>
      <RNTextInput
        placeholderTextColor={colors.textTertiary}
        style={[
          typography.body,
          {
            backgroundColor: colors.surfaceAlt,
            borderRadius: radii.md,
            padding: spacing.sm,
            color: colors.textPrimary,
          },
        ]}
        {...props}
      />
    </View>
  );
}

export function ScanScreen() {
  const { colors, spacing, radii } = useTheme();
  const { addMeal, freeScansLeft, useFreeScan, syncFreeScansLeft } = useApp();
  const tabNav = useNavigation<NavigationProp<RootTabParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('idle');
  const [unknownGuess, setUnknownGuess] = useState<DishGuess | null>(null);
  const [customName, setCustomName] = useState('');
  const [customCals, setCustomCals] = useState('');
  const cameraRef = useRef<CameraView>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const goPaywall = () => tabNav.navigate('Profile', { screen: 'Paywall' });

  const resetScan = () => {
    setPhase('idle');
    setUnknownGuess(null);
    setCustomName('');
    setCustomCals('');
  };

  // Demo path: no camera or backend unreachable. Consumes a local scan.
  const runSimulatedScan = () => {
    if (!useFreeScan()) {
      goPaywall();
      setPhase('idle');
      return;
    }
    setPhase('analyzing');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase('result'), 2000);
  };

  // Real path: capture a photo, send it to analyze-meal, route on the result.
  const analyze = async () => {
    if (freeScansLeft <= 0) {
      goPaywall();
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setPhase('analyzing');
    try {
      let base64: string | null = null;
      if (permission?.granted && cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true,
            quality: 0.7,
            exif: false,
          });
          base64 = photo?.base64 ?? null;
        } catch (e) {
          console.warn('camera capture failed, using demo scan', e);
        }
      }
      if (!base64) {
        runSimulatedScan();
        return;
      }

      const res = await analyzeMeal(base64, await getDeviceId());
      syncFreeScansLeft(res.scans_left); // server is the authority
      if (res.matched) {
        resetScan();
        tabNav.navigate('Today', {
          screen: 'DishDetail',
          params: {
            preview: mealInputFromAnalysis(res, mealTypeForNow()),
          },
        });
        return;
      }
      setUnknownGuess(res.ai);
      setCustomName(res.ai.dish_name);
      setCustomCals('');
      setPhase('unknown');
    } catch (e) {
      if (e instanceof FreeScansExhaustedError) {
        syncFreeScansLeft(0);
        resetScan();
        goPaywall();
        return;
      }
      console.warn('analyze-meal failed, falling back to demo scan', e);
      runSimulatedScan();
    }
  };

  const logMeal = () => {
    addMeal({ ...SIMULATED_RESULT, mealType: mealTypeForNow(), plates: 1 });
    resetScan();
    tabNav.navigate('Today');
  };

  const customCalsNum = parseInt(customCals, 10);
  const canLogCustom =
    customName.trim().length > 0 &&
    Number.isFinite(customCalsNum) &&
    customCalsNum > 0;

  const logCustomMeal = () => {
    if (!canLogCustom) return;
    addMeal({
      dishId: 'custom',
      nameEn: customName.trim(),
      nameAr: '',
      cuisine: 'Custom',
      region: 'Unknown',
      mealType: mealTypeForNow(),
      plates: 1,
      nutrition: { calories: customCalsNum, protein: 0, carbs: 0, fat: 0 },
      tags: ['custom'],
      allergens: [],
    });
    resetScan();
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
                ref={cameraRef}
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
                onPress={resetScan}
              />
            </View>
          </Card>
        )}

        {phase === 'unknown' && unknownGuess && (
          <Card style={styles.resultCard}>
            <Text variant="h2" style={{ marginBottom: spacing.xs }}>
              Couldn&apos;t identify this dish
            </Text>
            <Text
              variant="bodySmall"
              color="textSecondary"
              style={{ marginBottom: spacing.md }}
            >
              The AI guessed &ldquo;{unknownGuess.dish_name}&rdquo; (
              {Math.round(unknownGuess.confidence * 100)}% confident), but
              it&apos;s not in our nutrition database yet. Log it manually
              instead:
            </Text>
            <Field
              label="Dish name"
              value={customName}
              onChangeText={setCustomName}
              autoCapitalize="words"
              returnKeyType="next"
              accessibilityLabel="Dish name"
            />
            <Field
              label="Calories (estimate)"
              value={customCals}
              onChangeText={setCustomCals}
              keyboardType="numeric"
              returnKeyType="done"
              accessibilityLabel="Estimated calories"
            />
            <Text
              variant="caption"
              color="textTertiary"
              style={{ marginBottom: spacing.md }}
            >
              Macros aren&apos;t estimated for custom meals.
            </Text>
            <Button
              title="Log custom meal"
              disabled={!canLogCustom}
              onPress={logCustomMeal}
            />
            <View style={{ marginTop: spacing.sm }}>
              <Button
                title="Scan again"
                variant="ghost"
                onPress={resetScan}
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
