import { Directory, File, Paths } from 'expo-file-system';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  RecordingPresets,
} from 'expo-audio';

export { RecordingPresets };

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

export function meetingsDir(): Directory {
  const dir = new Directory(Paths.document, 'meetings');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

/** Move the finished recording into the app's meetings dir, named by meeting id. */
export async function persistRecording(tmpUri: string, meetingId: string): Promise<string> {
  const dest = new File(meetingsDir(), `${meetingId}.m4a`);
  if (dest.exists) dest.delete();
  await new File(tmpUri).move(dest);
  return dest.uri;
}

/** Best-effort delete of a recording file (e.g. when its meeting is deleted). */
export function deleteRecording(uri: string | null): void {
  if (!uri) return;
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {
    // already gone — nothing to do
  }
}
