import React, { useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeProvider';
import { Screen } from '../components/Screen';
import { PostureText } from '../components/PostureText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { saveCheckPhoto } from '../lib/photos';
import { t } from '../lib/i18n';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Guided capture: overlay lines show where the body should sit so the photo
// is a usable side profile (the pose math assumes this framing).
export function CaptureScreen() {
  const { colors, spacing } = useTheme();
  const nav = useNavigation<Nav>();
  const s = t();
  const [phase, setPhase] = useState<'guide' | 'camera'>('guide');
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const goLandmarks = (uri: string) => {
    // replace: going back from landmark placement should not re-open the camera
    nav.replace('Landmarks', { photoUri: uri });
  };

  const storePhoto = async (srcUri: string) => {
    setBusy(true);
    try {
      const uri = await saveCheckPhoto(srcUri, `tmp-${Date.now()}`);
      goLandmarks(uri);
    } finally {
      setBusy(false);
    }
  };

  const capture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7, skipProcessing: true });
    if (photo?.uri) void storePhoto(photo.uri);
  };

  const pickFromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    const uri = res.assets?.[0]?.uri;
    if (!res.canceled && uri) void storePhoto(uri);
  };

  if (phase === 'guide') {
    const tips = [s.guide1, s.guide2, s.guide3, s.guide4];
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, padding: spacing.lg }}>
          <Button title={`‹ ${s.back}`} variant="ghost" size="sm" onPress={() => nav.goBack()} style={{ alignSelf: 'flex-start' }} />
          <View style={{ height: spacing.md }} />
          <PostureText variant="h1">{s.guideTitle}</PostureText>
          <View style={{ height: spacing.md }} />
          <Card>
            {tips.map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                <PostureText variant="body" color={colors.accent}>{`${i + 1}. `}</PostureText>
                <PostureText variant="body" color={colors.textSecondary} style={{ flex: 1 }}>
                  {tip}
                </PostureText>
              </View>
            ))}
          </Card>
          <View style={{ flex: 1 }} />
          <Button title={s.startCamera} size="lg" onPress={() => setPhase('camera')} loading={busy} />
          <View style={{ height: spacing.sm }} />
          <Button title={s.chooseGallery} variant="secondary" onPress={pickFromGallery} loading={busy} />
        </View>
      </Screen>
    );
  }

  // --- camera phase ---
  if (!permission) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, padding: spacing.lg }}>
          <Button title={`‹ ${s.back}`} variant="ghost" size="sm" onPress={() => setPhase('guide')} style={{ alignSelf: 'flex-start' }} />
          <View style={{ height: spacing.md }} />
          <PostureText variant="h1">{s.cameraBlockedTitle}</PostureText>
          <View style={{ height: spacing.sm }} />
          <PostureText variant="body" color={colors.textSecondary}>
            {s.cameraBlockedBody}
          </PostureText>
          <View style={{ height: spacing.lg }} />
          <Button title={s.startCamera} size="lg" onPress={() => void requestPermission()} />
          <View style={{ height: spacing.sm }} />
          <Button title={s.chooseGallery} variant="secondary" onPress={pickFromGallery} />
        </View>
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
        {/* Alignment guides: vertical plumb line + head/hip/knee level marks */}
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0 }}>
          <View
            style={{
              position: 'absolute',
              left: '50%',
              top: '8%',
              bottom: '22%',
              width: 2,
              marginLeft: -1,
              backgroundColor: colors.accent,
              opacity: 0.65,
            }}
          />
          {(['18%', '45%', '72%'] as const).map((top) => (
            <View
              key={top}
              style={{
                position: 'absolute',
                top,
                left: '30%',
                right: '30%',
                height: 2,
                backgroundColor: colors.accent,
                opacity: 0.45,
              }}
            />
          ))}
          <View style={{ position: 'absolute', top: '10%', left: 0, right: 0, alignItems: 'center' }}>
            <PostureText variant="bodySmall" color="#FFFFFF" style={{ textAlign: 'center' }}>
              {s.tapShutter}
            </PostureText>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <Button title={`‹ ${s.back}`} variant="ghost" size="sm" onPress={() => setPhase('guide')} />
          <Button
            title="●"
            accessibilityLabel={s.tapShutter}
            size="lg"
            onPress={() => void capture()}
            loading={busy}
            style={{ width: 84, height: 84, borderRadius: 42 }}
          />
          <Button title={s.chooseGallery} variant="ghost" size="sm" onPress={pickFromGallery} />
        </View>
      </CameraView>
    </View>
  );
}
