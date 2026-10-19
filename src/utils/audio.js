// Web Audio API Synthesizer for K-Drama OST BGM and Sound Effects
// Works reliably offline and across all browsers without external audio asset dependencies!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Romantic K-Drama chord progression melody in C major / A minor
  // Fmaj7 -> G7 -> Em7 -> Am7 (The classic Korean Ballad / OST cadence)
  startBGM() {
    this.init();
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;

    const chords = [
      // Fmaj7: F3, A3, C4, E4
      { root: 174.61, notes: [174.61, 220.00, 261.63, 329.63], melody: [523.25, 493.88, 440.00, 392.00] },
      // G7: G3, B3, D4, F4
      { root: 196.00, notes: [196.00, 246.94, 293.66, 349.23], melody: [392.00, 440.00, 493.88, 523.25] },
      // Em7: E3, G3, B3, D4
      { root: 164.81, notes: [164.81, 196.00, 246.94, 293.66], melody: [659.25, 587.33, 523.25, 493.88] },
      // Am7: A3, C4, E4, G4
      { root: 220.00, notes: [220.00, 261.63, 329.63, 392.00], melody: [440.00, 493.88, 523.25, 659.25] }
    ];

    let chordIndex = 0;
    let arpeggioStep = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying) return;

      if (!this.isMuted && this.ctx) {
        const chord = chords[chordIndex];
        const noteFreq = chord.notes[arpeggioStep % chord.notes.length];
        
        // Soft electric piano / music box tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.75);

        // Every 4 steps, trigger an emotional melody high bell note
        if (arpeggioStep === 0 || arpeggioStep === 2) {
          const melodyNote = chord.melody[arpeggioStep];
          const melOsc = this.ctx.createOscillator();
          const melGain = this.ctx.createGain();
          melOsc.type = 'sine';
          melOsc.frequency.setValueAtTime(melodyNote, now);
          melGain.gain.setValueAtTime(0, now);
          melGain.gain.linearRampToValueAtTime(0.035, now + 0.08);
          melGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          melOsc.connect(melGain);
          melGain.connect(this.ctx.destination);
          melOsc.start(now);
          melOsc.stop(now + 1.25);
        }
      }

      arpeggioStep++;
      if (arpeggioStep >= 4) {
        arpeggioStep = 0;
        chordIndex = (chordIndex + 1) % chords.length;
      }

      this.bgmTimer = setTimeout(playNextNote, 420);
    };

    playNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Sound Effect: Sweet sparkle chime when selecting an option
  playChime() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.32);
    });
  }

  // Sound Effect: Mini-game catch item sound
  playCatch() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Sound Effect: Dramatic slow-mo romance swell
  playDramaticSwell() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    // Low cinematic cello pad
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now); // A2
    osc.frequency.linearRampToValueAtTime(164.81, now + 2); // E3

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(600, now + 1.5);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  // Sound Effect: Celebratory fanfare for birthday candle blow & confession reaction
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.05, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.65);
    });
  }
}

export const soundEngine = new SoundEngine();
