import { Directory, File, Paths } from 'expo-file-system';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';

export type MicStatus = 'granted' | 'denied' | 'undetermined';

/** Prepare the audio session for recording + playback. */
export async function ensureAudioMode(): Promise<void> {
  await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
}

export async function getMicStatus(): Promise<MicStatus> {
  try {
    const r = await getRecordingPermissionsAsync();
    if (r.granted) return 'granted';
    return r.canAskAgain ? 'undetermined' : 'denied';
  } catch {
    return 'denied';
  }
}

export async function requestMic(): Promise<boolean> {
  try {
    return (await requestRecordingPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

export function attemptsDir(): Directory {
  const dir = new Directory(Paths.document, 'attempts');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

/**
 * Move a finished recording into the attempts dir, one slot per phrase —
 * a new attempt replaces the old one (no growing library of audio files).
 */
export async function persistAttempt(tmpUri: string, phraseId: string): Promise<string> {
  const dest = new File(attemptsDir(), `${phraseId}.m4a`);
  if (dest.exists) dest.delete();
  await new File(tmpUri).move(dest);
  return dest.uri;
}

/** Best-effort delete of an attempt file. */
export function deleteAttempt(uri: string | null): void {
  if (!uri) return;
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {
    // already gone — nothing to do
  }
}
