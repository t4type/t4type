let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Generates a subtle, tactile keystroke click using the Web Audio API.
 * Plays a soft click for valid keystrokes and a slightly lower tone for errors.
 */
export function playKeySound(isError: boolean = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = isError ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(isError ? 180 : 520, now);
    oscillator.frequency.exponentialRampToValueAtTime(isError ? 90 : 180, now + 0.035);

    gain.gain.setValueAtTime(isError ? 0.08 : 0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.045);
  } catch {
    // Ignore audio context errors silently
  }
}

