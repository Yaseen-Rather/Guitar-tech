/**
 * Audio Engine — Web Audio API note/chord playback
 * Clean guitar-like tone using oscillators + envelope
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.4;
    this.masterGain.connect(this.ctx.destination);
    this.isInitialized = true;
  }

  /**
   * Play a single note
   * @param {number} frequency - Hz
   * @param {number} duration - seconds (default 1.5)
   */
  playNote(frequency, duration = 1.5) {
    if (!this.isInitialized) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    // Create oscillators for richer tone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Guitar-like tone: triangle + slight detune
    osc1.type = 'triangle';
    osc1.frequency.value = frequency;

    osc2.type = 'sine';
    osc2.frequency.value = frequency;
    osc2.detune.value = 3; // subtle detuning for warmth

    // Low-pass filter for warmth
    filter.type = 'lowpass';
    filter.frequency.value = 2500;
    filter.Q.value = 1;

    // Guitar envelope: quick attack, medium sustain, slow decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.008); // fast attack
    gainNode.gain.exponentialRampToValueAtTime(0.35, now + 0.1); // initial decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // sustain decay

    // Connect
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Start and stop
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    // Cleanup
    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Play a note by MIDI number
   */
  playMidi(midiNote, duration = 1.5) {
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
    this.playNote(freq, duration);
  }

  /**
   * Play a chord (strum multiple notes with slight delay)
   * @param {number[]} midiNotes - array of MIDI note numbers
   * @param {number} strumDelay - ms between each note (default 30)
   */
  playChord(midiNotes, strumDelay = 30) {
    midiNotes.forEach((midi, i) => {
      if (midi !== null && midi !== undefined) {
        setTimeout(() => this.playMidi(midi, 2.0), i * strumDelay);
      }
    });
  }

  /**
   * Play a note by string and fret with current tuning
   */
  playStringFret(stringMidi, fret, duration = 1.5) {
    this.playMidi(stringMidi + fret, duration);
  }
}

// Global instance
window.audioEngine = new AudioEngine();
