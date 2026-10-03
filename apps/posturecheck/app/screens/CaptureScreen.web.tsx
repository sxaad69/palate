import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

// Web version of the Capture screen. No camera on web — the guide phase is
// shown, and photos come from the gallery picker (expo-image-picker works on
// web via file input). Metro picks this file over CaptureScreen.tsx for web
// builds.

export function CaptureScreen() {
  const { colors, spacing } = useTheme();
  const nav = useNavigation<Nav>();
  const s = t();
  const [busy, setBusy] = useState(false);

  const goLandmarks = (uri: string) => {
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

  const pickFromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    const uri = res.assets?.[0]?.uri;
    if (!res.canceled && uri) void storePhoto(uri);
  };

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
        <View style={{ height: spacing.md }} />
        <PostureText variant="bodySmall" color={colors.textSecondary} style={{ textAlign: 'center' }}>
          Camera is not available in the web preview — choose a photo instead.
        </PostureText>
        <View style={{ flex: 1 }} />
        <Button title={s.chooseGallery} size="lg" onPress={pickFromGallery} loading={busy} />
      </View>
    </Screen>
  );
}
