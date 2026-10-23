// Web Audio API sound generator - 100% self-contained, no external mp3 assets needed!
let audioCtx = null;
let bgmInterval = null;
let isBgmPlaying = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a sweet melodic chime (ideal for Celebrate & confetti)
 */
export function playSparkleChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Sweet pentatonic arpeggio: C5, E5, G5, A5, C6, E6
    const notes = [523.25, 659.25, 783.99, 880.0, 1046.5, 1318.51];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  } catch {
    // Graceful fallback if audio is blocked
  }
}

/**
 * Play a cute soft pop sound for quiz selection & button clicks
 */
export function playPop() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a gentle candle blow sound (soft breath whoosh + fairy chime)
 */
export function playBlowSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Gentle noise for breath
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);

    // Followed by a warm celebration chime
    setTimeout(() => {
      playSparkleChime();
    }, 280);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a heartwarming chord for envelope opening & heartfelt actions
 */
export function playHeartChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Warm Fmaj7 chord: F4, A4, C5, E5
    const freqs = [349.23, 440.0, 523.25, 659.25];

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Calming lo-fi music box loop (synthesized in real-time)
 */
export function toggleBackgroundMusic(onStateChange) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isBgmPlaying) {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    isBgmPlaying = false;
    if (onStateChange) onStateChange(false);
    return false;
  }

  // Melodic sequence for a gentle ambient music box
  // Chord progression: F - G - Em - Am
  const melodyPattern = [
    { note: 349.23, time: 0 },    // F4
    { note: 523.25, time: 250 },  // C5
    { note: 659.25, time: 500 },  // E5
    { note: 392.00, time: 1000 }, // G4
    { note: 587.33, time: 1250 }, // D5
    { note: 783.99, time: 1500 }, // G5
    { note: 329.63, time: 2000 }, // E4
    { note: 493.88, time: 2250 }, // B4
    { note: 659.25, time: 2500 }, // E5
    { note: 440.00, time: 3000 }, // A4
    { note: 523.25, time: 3250 }, // C5
    { note: 659.25, time: 3500 }, // E5
  ];

  const loopDuration = 4000;

  function playNote(freq) {
    if (!isBgmPlaying) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  function runSequence() {
    if (!isBgmPlaying) return;
    melodyPattern.forEach((item) => {
      setTimeout(() => {
        if (isBgmPlaying) playNote(item.note);
      }, item.time);
    });
  }

  isBgmPlaying = true;
  runSequence();
  bgmInterval = setInterval(runSequence, loopDuration);

  if (onStateChange) onStateChange(true);
  return true;
}
