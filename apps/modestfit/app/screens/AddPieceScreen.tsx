import React, { useState } from 'react';
import { Alert, Image, TextInput, View, type TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeProvider';
import { useModestFit, uid } from '../store/app';
import { t } from '../lib/i18n';
import { Screen } from '../components/Screen';
import { MFText } from '../components/MFText';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { pickPiecePhoto } from '../lib/photos';
import {
  CATEGORIES,
  type Category,
  type ColorKey,
  type Hem,
  type Opacity,
  type OwnedPiece,
  type Sleeve,
} from '../data/pieces';
import type { RootStackParamList } from '../navigation';

const SWATCHES: { key: ColorKey; hex: string; en: string; ar: string }[] = [
  { key: 'black', hex: '#23201A', en: 'Black', ar: 'أسود' },
  { key: 'white', hex: '#F5F2EA', en: 'White', ar: 'أبيض' },
  { key: 'ivory', hex: '#F1EAD9', en: 'Ivory', ar: 'عاجي' },
  { key: 'beige', hex: '#D9C7A8', en: 'Beige', ar: 'بيج' },
  { key: 'sand', hex: '#DCC9A6', en: 'Sand', ar: 'رملي' },
  { key: 'grey', hex: '#8A8578', en: 'Grey', ar: 'رمادي' },
  { key: 'navy', hex: '#2E3A52', en: 'Navy', ar: 'كحلي' },
  { key: 'olive', hex: '#7C8547', en: 'Olive', ar: 'زيتي' },
  { key: 'rose', hex: '#C5735B', en: 'Rose', ar: 'وردي' },
  { key: 'taupe', hex: '#A89880', en: 'Taupe', ar: 'طوبي' },
  { key: 'brown', hex: '#6B4F35', en: 'Brown', ar: 'بني' },
];

export function AddPieceScreen() {
  const { colors, spacing, radii } = useTheme();
  const { lang, addPiece } = useModestFit();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = t();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('abaya');
  const [colorKey, setColorKey] = useState<ColorKey>('black');
  const [sleeve, setSleeve] = useState<Sleeve>('long');
  const [hem, setHem] = useState<Hem>('maxi');
  const [opacity, setOpacity] = useState<Opacity>('opaque');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const inputStyle: TextStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: lang === 'ar' ? 'right' : 'left',
  };

  const save = () => {
    const swatch = SWATCHES.find((w) => w.key === colorKey) ?? SWATCHES[0]!;
    const piece: OwnedPiece = {
      id: uid('p'),
      name: { en: name.trim() || 'Untitled piece', ar: name.trim() || 'قطعة بدون اسم' },
      category,
      colorKey,
      colorHex: swatch.hex,
      sleeve,
      hem,
      opacity,
      occasions: ['daily'],
      photo,
      wearCount: 0,
      addedAt: Date.now(),
    };
    if (!addPiece(piece)) {
      Alert.alert(s.freeLimitTitle, s.freeLimitDesc, [
        { text: s.cancel, style: 'cancel' },
        { text: s.goPro, onPress: () => nav.navigate('Paywall') },
      ]);
      return;
    }
    nav.goBack();
  };

  const takePhoto = async () => {
    const uri = await pickPiecePhoto(uid('tmp'));
    if (uri) setPhoto(uri);
  };

  return (
    <Screen>
      <MFText variant="h1" style={{ marginBottom: spacing.md }}>
        {s.addPiece}
      </MFText>

      <MFText variant="h3" style={{ marginBottom: spacing.xs }}>
        {s.pieceName}
      </MFText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={s.pieceNamePh}
        placeholderTextColor={colors.textTertiary}
        style={inputStyle}
      />

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.pieceCategory}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {CATEGORIES.map((c) => (
          <Chip key={c} label={s[`cat_${c}`]} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.pieceColor}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {SWATCHES.map((w) => (
          <Chip
            key={w.key}
            label={lang === 'ar' ? w.ar : w.en}
            selected={colorKey === w.key}
            onPress={() => setColorKey(w.key)}
          />
        ))}
      </View>

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.pieceSleeve}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {(['sleeveless', 'short', 'threeQuarter', 'long', 'na'] as Sleeve[]).map((o) => (
          <Chip
            key={o}
            label={s[`sleeve_${o}`]}
            selected={sleeve === o}
            onPress={() => setSleeve(o)}
          />
        ))}
      </View>

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.pieceHem}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm }}>
        {(['short', 'knee', 'midi', 'maxi', 'floor', 'na'] as Hem[]).map((o) => (
          <Chip
            key={o}
            label={o === 'short' ? s.hem_short : o === 'na' ? s.sleeve_na : s[`hem_${o}`]}
            selected={hem === o}
            onPress={() => setHem(o)}
          />
        ))}
      </View>

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.pieceOpacity}
      </MFText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
        {(['opaque', 'semiSheer', 'sheer'] as Opacity[]).map((o) => (
          <Chip
            key={o}
            label={s[`opacity_${o}`]}
            selected={opacity === o}
            onPress={() => setOpacity(o)}
          />
        ))}
      </View>

      <MFText variant="h3" style={{ marginBottom: spacing.sm }}>
        {s.piecePhoto}
      </MFText>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radii.lg, marginBottom: spacing.sm }}
          resizeMode="cover"
        />
      ) : null}
      <Button
        title={photo ? s.changePhoto : s.pickPhoto}
        variant="secondary"
        onPress={() => void takePhoto()}
        style={{ marginBottom: spacing.lg }}
      />

      <Button title={s.save} onPress={save} />
    </Screen>
  );
}
