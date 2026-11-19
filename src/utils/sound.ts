let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch {
    void 0;
  }
  return audioCtx;
}

export function playKeySound(isError: boolean = false): void {
  try {
    const ctx = initAudioContext();
    if (!ctx || !masterGain) return;

    const now = ctx.currentTime;
    const pitchOffset = isError ? 1 : 1 + (Math.random() - 0.5) * 0.1;

    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();

    const startFreq = isError ? 220 : 380 * pitchOffset;
    const endFreq = isError ? 110 : 180 * pitchOffset;

    bodyOsc.type = isError ? 'triangle' : 'sine';
    bodyOsc.frequency.setValueAtTime(startFreq, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.035);

    const bodyPeakGain = isError ? 0.05 : 0.04;
    bodyGain.gain.setValueAtTime(bodyPeakGain, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(masterGain);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.04);

    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();

    const snapStartFreq = isError ? 800 : 1900 * pitchOffset;
    const snapEndFreq = isError ? 300 : 700 * pitchOffset;

    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(snapStartFreq, now);
    snapOsc.frequency.exponentialRampToValueAtTime(snapEndFreq, now + 0.012);

    const snapPeakGain = isError ? 0.03 : 0.035;
    snapGain.gain.setValueAtTime(snapPeakGain, now);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

    snapOsc.connect(snapGain);
    snapGain.connect(masterGain);

    snapOsc.start(now);
    snapOsc.stop(now + 0.016);
  } catch {
    void 0;
  }
}
