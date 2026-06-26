/**
 * Notes Data — All chromatic notes, frequencies, and tuning definitions
 */

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Enharmonic display preferences per key (true = use flats)
const KEY_USE_FLATS = {
  'C': false, 'C#': false, 'Db': true, 'D': false, 'D#': false, 'Eb': true,
  'E': false, 'F': true, 'F#': false, 'Gb': true, 'G': false, 'G#': false,
  'Ab': true, 'A': false, 'A#': false, 'Bb': true, 'B': false,
};

// All 12 root note options for the selector
const ROOT_NOTES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

// Note index lookup (handles both sharp and flat names)
function noteToIndex(note) {
  let idx = NOTES.indexOf(note);
  if (idx >= 0) return idx;
  idx = NOTE_NAMES_FLAT.indexOf(note);
  if (idx >= 0) return idx;
  // Handle combined names like "C#/Db"
  if (note.includes('/')) {
    const parts = note.split('/');
    for (const p of parts) {
      idx = NOTES.indexOf(p);
      if (idx >= 0) return idx;
      idx = NOTE_NAMES_FLAT.indexOf(p);
      if (idx >= 0) return idx;
    }
  }
  return -1;
}

// Get note name considering key context
function getNoteName(noteIndex, useFlats = false) {
  const idx = ((noteIndex % 12) + 12) % 12;
  return useFlats ? NOTE_NAMES_FLAT[idx] : NOTES[idx];
}

/**
 * Tuning definitions
 * Each string defined as MIDI note number (for frequency calc) and note name
 * Strings ordered: low E (6th) to high e (1st)
 */
const TUNINGS = {
  standard: {
    name: 'Standard',
    label: 'EADGBE',
    strings: [
      { note: 'E', octave: 2, midi: 40 },  // 6th string (low E)
      { note: 'A', octave: 2, midi: 45 },  // 5th string
      { note: 'D', octave: 3, midi: 50 },  // 4th string
      { note: 'G', octave: 3, midi: 55 },  // 3rd string
      { note: 'B', octave: 3, midi: 59 },  // 2nd string
      { note: 'E', octave: 4, midi: 64 },  // 1st string (high e)
    ]
  },
  eflat: {
    name: 'E-flat (Half Step Down)',
    label: 'Eb Ab Db Gb Bb Eb',
    strings: [
      { note: 'Eb', octave: 2, midi: 39 },
      { note: 'Ab', octave: 2, midi: 44 },
      { note: 'Db', octave: 3, midi: 49 },
      { note: 'Gb', octave: 3, midi: 54 },
      { note: 'Bb', octave: 3, midi: 58 },
      { note: 'Eb', octave: 4, midi: 63 },
    ]
  }
};

/**
 * Calculate frequency from MIDI note number
 * A4 = MIDI 69 = 440Hz
 */
function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Get the note index (0-11) for a given string and fret
 */
function getNoteAtFret(stringMidi, fret) {
  return (stringMidi + fret) % 12;
}

/**
 * Interval names
 */
const INTERVAL_NAMES = [
  'R', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'
];

const INTERVAL_FULL_NAMES = [
  'Root (Unison)', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd',
  'Perfect 4th', 'Tritone (Diminished 5th)', 'Perfect 5th', 'Minor 6th (Augmented 5th)',
  'Major 6th', 'Minor 7th', 'Major 7th'
];

const INTERVAL_SEMITONES = {
  'R': 0, '1': 0,
  'b2': 1, 'b9': 1,
  '2': 2, '9': 2,
  'b3': 3, '#9': 3,
  '3': 4,
  '4': 5, '11': 5,
  'b5': 6, '#4': 6, '#11': 6,
  '5': 7,
  '#5': 8, 'b6': 8, 'b13': 8,
  '6': 9, '13': 9,
  'b7': 10,
  '7': 11,
};

// Export for use in modules
if (typeof window !== 'undefined') {
  window.NotesData = {
    NOTES, NOTE_NAMES_FLAT, KEY_USE_FLATS, ROOT_NOTES,
    noteToIndex, getNoteName,
    TUNINGS, midiToFrequency, getNoteAtFret,
    INTERVAL_NAMES, INTERVAL_FULL_NAMES, INTERVAL_SEMITONES,
  };
}
