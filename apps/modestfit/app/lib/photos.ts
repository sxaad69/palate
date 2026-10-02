import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';

// Local-only piece photos. Picked images are copied into the app's document
// directory so they survive cache eviction; nothing is ever uploaded.

function photosDir(): Directory {
  return new Directory(Paths.document, 'modestfit', 'photos');
}

export async function pickPiecePhoto(pieceId: string): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.7,
  });
  if (result.canceled || result.assets.length === 0) return null;
  const src = result.assets[0]?.uri;
  if (!src) return null;
  const dir = photosDir();
  if (!dir.exists) dir.create({ intermediates: true });
  const dest = new File(dir, `${pieceId}.jpg`);
  await new File(src).copy(dest);
  return dest.uri;
}
