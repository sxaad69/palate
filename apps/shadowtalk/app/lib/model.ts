import * as Speech from 'expo-speech';

// On-device TTS "native model". Zero cost, works offline, EN + AR voices.
// Used in both directions of the AR<->EN wedge: en-US for English phrases,
// ar-SA for Arabic phrases.
export type TtsLang = 'en-US' | 'ar-SA';

let voiceRate = 0.85; // unhurried native-model pace; adjustable in Profile

export function setVoiceRate(r: number) {
  voiceRate = Math.min(1.5, Math.max(0.5, r));
}

export function getVoiceRate(): number {
  return voiceRate;
}

export async function stopModel(): Promise<void> {
  try {
    await Speech.stop();
  } catch {
    // never break a practice session over TTS
  }
}

/** Speak the model phrase the learner is about to shadow. */
export function playModel(text: string, language: TtsLang): void {
  void stopModel().catch(() => {});
  Speech.speak(text, {
    language,
    rate: voiceRate,
    onError: () => {},
  });
}
