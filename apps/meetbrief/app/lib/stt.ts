/**
 * STT insertion point (launch work — NOT wired in v1).
 *
 * Why not wired: true on-device speech-to-text on Expo without native
 * modules is not feasible in a managed build. Android's on-device
 * SpeechRecognizer (via expo-speech-recognition) needs extra native config
 * and proved unreliable in quick verification, so v1 ships WITHOUT
 * half-working STT: the app is a genuinely useful recorder + action tracker
 * on day one.
 *
 * When a transcription module is ready, implement this interface and inject
 * it here. The Meeting model already carries a `transcript` field; the only
 * call site that needs the result is MeetingDetailScreen (transcript input)
 * plus lib/summary.ts, which gains a "key points" section from transcript
 * keywords.
 */
export interface SttResult {
  /** Full transcript text, empty string when nothing was recognized. */
  text: string;
  /** 0..1 confidence when the engine reports it, else null. */
  confidence: number | null;
}

export interface SttProvider {
  readonly name: string;
  /** Transcribe a local audio file. Must not upload anywhere. */
  transcribe(audioUri: string): Promise<SttResult>;
}

/** v1 placeholder: always returns empty, never throws. */
export class NullSttProvider implements SttProvider {
  readonly name = 'none';
  async transcribe(_audioUri: string): Promise<SttResult> {
    return { text: '', confidence: null };
  }
}

// Candidate providers to evaluate at launch (all on-device, zero cost):
// 1. expo-speech-recognition — Android SpeechRecognizer; verify it works in
//    the Expo managed workflow without ejecting before depending on it.
// 2. sherpa-onnx (k2-f/whisper port) via a dev-client native module —
//    real offline Whisper, but requires a custom dev client build.
// 3. Optional user-supplied cloud key (BYOK) as a non-default opt-in —
//    must stay optional; the app works fully without it.
export const sttProvider: SttProvider = new NullSttProvider();
