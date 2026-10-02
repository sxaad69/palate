import * as ImagePicker from 'expo-image-picker';
import { File, Directory, Paths } from 'expo-file-system';

// Pet photos: copied into the app document directory so they survive
// picker-cache eviction. Returns a file:// URI, or null on failure/decline.

function petsDir(): Directory {
  const dir = new Directory(Paths.document, 'pets');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export async function pickPetPhoto(petId: string): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return null;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (res.canceled || !res.assets?.[0]?.uri) return null;
    const src = new File(res.assets[0].uri);
    const dest = new File(petsDir(), `${petId}.jpg`);
    await src.copy(dest);
    return dest.uri;
  } catch {
    // ponytail: photo is cosmetic; a failed copy must never break add-pet.
    return null;
  }
}
