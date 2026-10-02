import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, PanResponder, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { usePosture } from '../store/app';
import {
  ACTIVE_PROVIDER,
  DEFAULT_LANDMARKS,
  LANDMARK_ORDER,
  analyzeAngles,
  computeAngles,
  scorePosture,
  type Landmark,
  type LandmarkKey,
} from '../lib/pose';
import { t } from '../lib/i18n';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Landmarks'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const BOX_H = 440;
const MARK = 40;
const GRAB_RADIUS = 48;

function landmarkName(k: LandmarkKey): string {
  const s = t();
  switch (k) {
    case 'ear': return s.lmEar;
    case 'shoulder': return s.lmShoulder;
    case 'hip': return s.lmHip;
    case 'knee': return s.lmKnee;
    case 'ankle': return s.lmAnkle;
  }
}

// Draggable anatomical markers over the captured photo. Implemented with
// PanResponder from react-native core — no gesture-handler dependency.
export function LandmarkScreen() {
  const { colors, spacing } = useTheme();
  const nav = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const { photoUri } = route.params;
  const { addCheck } = usePosture();
  const s = t();

  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [boxW, setBoxW] = useState(0);
  const [marks, setMarks] = useState<Record<LandmarkKey, Landmark>>(DEFAULT_LANDMARKS);
  const [dragKey, setDragKey] = useState<LandmarkKey | null>(null);

  useEffect(() => {
    Image.getSize(photoUri, (w, h) => setImgSize({ w, h }), () => setImgSize({ w: 3, h: 4 }));
  }, [photoUri]);

  // Displayed-image rect inside the box (contain fit).
  const rect = useMemo(() => {
    if (!imgSize || boxW <= 0) return null;
    const scale = Math.min(boxW / imgSize.w, BOX_H / imgSize.h);
    const dw = imgSize.w * scale;
    const dh = imgSize.h * scale;
    return { dw, dh, ox: (boxW - dw) / 2, oy: (BOX_H - dh) / 2 };
  }, [imgSize, boxW]);

  // Refs so the PanResponder handlers (created once) always see fresh state.
  const marksRef = useRef(marks);
  marksRef.current = marks;
  const rectRef = useRef(rect);
  rectRef.current = rect;
  const grantRef = useRef<LandmarkKey | null>(null);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const r = rectRef.current;
        if (!r) return;
        const { locationX, locationY } = e.nativeEvent;
        let best: LandmarkKey | null = null;
        let bestD = GRAB_RADIUS;
        for (const k of LANDMARK_ORDER) {
          const m = marksRef.current[k];
          const px = r.ox + m.x * r.dw;
          const py = r.oy + m.y * r.dh;
          const d = Math.hypot(px - locationX, py - locationY);
          if (d < bestD) {
            bestD = d;
            best = k;
          }
        }
        grantRef.current = best;
        setDragKey(best);
      },
      onPanResponderMove: (e) => {
        const r = rectRef.current;
        const k = grantRef.current;
        if (!r || !k) return;
        const { locationX, locationY } = e.nativeEvent;
        const nx = Math.min(1, Math.max(0, (locationX - r.ox) / r.dw));
        const ny = Math.min(1, Math.max(0, (locationY - r.oy) / r.dh));
        setMarks((prev) => ({ ...prev, [k]: { x: nx, y: ny } }));
      },
      onPanResponderRelease: () => {
        grantRef.current = null;
        setDragKey(null);
      },
      onPanResponderTerminate: () => {
        grantRef.current = null;
        setDragKey(null);
      },
    }),
  ).current;

  const analyze = () => {
    const angles = computeAngles(marks);
    const observations = analyzeAngles(angles);
    const score = scorePosture(observations);
    const rec = addCheck({
      photoUri,
      score,
      angles,
      observations,
      providerId: ACTIVE_PROVIDER.id,
    });
    nav.replace('Results', { checkId: rec.id });
  };

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, padding: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button title={`‹ ${s.back}`} variant="ghost" size="sm" onPress={() => nav.goBack()} />
          <PostureText variant="h3">{s.lmTitle}</PostureText>
          <Button title={s.lmReset} variant="ghost" size="sm" onPress={() => setMarks(DEFAULT_LANDMARKS)} />
        </View>
        <PostureText variant="bodySmall" color={colors.textSecondary} style={{ marginVertical: spacing.sm }}>
          {s.lmBody}
        </PostureText>

        <View
          onLayout={(e) => setBoxW(e.nativeEvent.layout.width)}
          {...pan.panHandlers}
          style={{
            height: BOX_H,
            backgroundColor: colors.surfaceAlt,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {!rect ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : (
            <>
              <Image
                source={{ uri: photoUri }}
                style={{
                  position: 'absolute',
                  left: rect.ox,
                  top: rect.oy,
                  width: rect.dw,
                  height: rect.dh,
                }}
                resizeMode="contain"
              />
              {/* Plumb line through the ankle: are ear/shoulder/hip stacked above it? */}
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: rect.ox + marks.ankle.x * rect.dw - 1,
                  top: 0,
                  bottom: 0,
                  borderLeftWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: colors.accent,
                  opacity: 0.55,
                }}
              />
              {LANDMARK_ORDER.map((k, i) => {
                const px = rect.ox + marks[k].x * rect.dw;
                const py = rect.oy + marks[k].y * rect.dh;
                const active = dragKey === k;
                return (
                  <View
                    key={k}
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: px - MARK / 2,
                      top: py - MARK / 2,
                      width: MARK,
                      height: MARK,
                      borderRadius: MARK / 2,
                      backgroundColor: active ? colors.accent : colors.surface,
                      borderWidth: 2,
                      borderColor: colors.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: active ? 0.95 : 0.88,
                    }}
                  >
                    <PostureText variant="h3" color={active ? colors.textInverse : colors.accent}>
                      {i + 1}
                    </PostureText>
                  </View>
                );
              })}
            </>
          )}
        </View>

        {/* Legend: number -> body part */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: spacing.sm }}>
          {LANDMARK_ORDER.map((k, i) => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PostureText variant="caption" color={colors.accent}>{`${i + 1} · `}</PostureText>
              <PostureText variant="caption" color={colors.textSecondary}>
                {landmarkName(k)}
              </PostureText>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <Button title={s.lmAnalyze} size="lg" onPress={analyze} />
        <View style={{ height: spacing.sm }} />
        <PostureText variant="caption" color={colors.textTertiary} style={{ textAlign: 'center' }}>
          {s.lmHonest}
        </PostureText>
      </View>
    </Screen>
  );
}
