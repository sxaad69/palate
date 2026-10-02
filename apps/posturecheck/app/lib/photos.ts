// lib/photos.ts — check photos live in the app's document directory and
// never leave the device (local-only is the privacy story).
import { Directory, File, Paths } from 'expo-file-system';

function photosDir(): Directory {
  return new Directory(Paths.document, 'straightup', 'photos');
}

/** Copy a captured/picked photo into app storage. Returns the stored URI. */
export async function saveCheckPhoto(sourceUri: string, checkId: string): Promise<string> {
  const dir = photosDir();
  if (!dir.exists) dir.create({ intermediates: true });
  const dest = new File(dir, `${checkId}.jpg`);
  const src = new File(sourceUri);
  if (src.exists) src.copy(dest);
  return dest.uri;
}

/** Best-effort delete of a stored check photo. */
export async function deleteCheckPhoto(storedUri: string): Promise<void> {
  try {
    const f = new File(storedUri);
    if (f.exists) f.delete();
  } catch {
    // orphan files are harmless; skip
  }
}
