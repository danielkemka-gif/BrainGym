/**
 * AKUCHE AUDIO ENGINE — WARM WELCOME CHIME
 * 
 * Synthesizes a calming, warm, harmonic welcome chime using Web Audio API.
 * Uses soft sine/triangle oscillators tuned to an uplifting F Major 9th chord (F3, C4, E4, G4, A4)
 * with gentle decay and low-pass filtering.
 * 
 * Benefits:
 * - 0kb external asset loading (works 100% offline)
 * - Zero latency
 * - Premium, soothing acoustic aesthetic
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioWelcomeEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem("akuche_welcome_sound_enabled");
  return val !== "false";
}

export function setAudioWelcomeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("akuche_welcome_sound_enabled", enabled ? "true" : "false");
}

export function playWarmWelcomeChime(): void {
  if (!isAudioWelcomeEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // F Major 9 chord frequencies for an uplifting, warm, brain-calming resonance
    const frequencies = [
      174.61, // F3 (Grounding fundamental)
      261.63, // C4 (Stability)
      329.63, // E4 (Warm major 7th)
      392.00, // G4 (Harmonic clarity)
      440.00, // A4 (Bright 9th overtone)
    ];

    // Master filter to remove harshness and create a soft, warm chime
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.8);
    filter.connect(ctx.destination);

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    masterGain.connect(filter);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Slight frequency micro-detune for organic warmth
      osc.detune.setValueAtTime((idx - 2) * 3, now);

      const delayOffset = idx * 0.035; // Strummed arpeggiation effect
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.3 / (idx + 1), now + delayOffset + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.00001, now + delayOffset + 2.0);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + delayOffset);
      osc.stop(now + delayOffset + 2.2);
    });
  } catch {
    // Graceful fallback on audio restrictions
  }
}
