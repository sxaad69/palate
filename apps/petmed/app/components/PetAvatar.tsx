import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { PawText } from './PawText';
import type { Pet, Species } from '../store/app';

export const SPECIES_ICON: Record<Species, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐇',
  other: '🐾',
};

export function petColor(pet: Pet, colors: string[]): string {
  return colors[pet.colorIndex % colors.length] ?? colors[0] ?? '#0E9E8E';
}

export function PetAvatar({ pet, size = 56 }: { pet: Pet; size?: number }) {
  const { petColors, colors } = useTheme();
  const color = petColor(pet, [...petColors]);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.accentMuted,
        borderWidth: 3,
        borderColor: color,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {pet.photoUri ? (
        <Image source={{ uri: pet.photoUri }} style={{ width: size, height: size }} />
      ) : (
        <PawText style={{ fontSize: size * 0.5 }}>{SPECIES_ICON[pet.species]}</PawText>
      )}
    </View>
  );
}
