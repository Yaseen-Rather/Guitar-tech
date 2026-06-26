/**
 * Chords Data — All chord types with voicings
 * 
 * Each voicing is a 6-element array [6th, 5th, 4th, 3rd, 2nd, 1st]
 * null = muted/not played, 0 = open string, number = fret
 * 
 * Voicings are defined for the KEY OF E or A (lowest common shapes)
 * and transposed by the fretboard renderer based on selected root.
 * 
 * "open" voicings are common open chord shapes (key-specific).
 * "barre" and "movable" voicings are transposable.
 */

const CHORD_TYPES = {
  // ─── MAJOR CHORDS ────────────────────────────────────────
  major: {
    name: 'Major',
    symbol: '',
    formula: [0, 4, 7],
    formulaNames: ['R', '3', '5'],
    description: 'The happy, bright, resolved chord. The foundation of all harmony.',
    voicings: {
      'E_shape': { name: 'E Shape Barre', baseFret: 0, frets: [0, 2, 2, 1, 0, 0], barreString: 0, movable: true },
      'A_shape': { name: 'A Shape Barre', baseFret: 0, frets: [null, 0, 2, 2, 2, 0], barreString: 1, movable: true },
      'C_shape': { name: 'C Shape', baseFret: 0, frets: [null, 3, 2, 0, 1, 0], movable: false },
      'D_shape': { name: 'D Shape', baseFret: 0, frets: [null, null, 0, 2, 3, 2], movable: true },
      'G_shape': { name: 'G Shape', baseFret: 0, frets: [3, 2, 0, 0, 0, 3], movable: false },
    },
    openChords: {
      'C': { frets: [null, 3, 2, 0, 1, 0], name: 'C Major' },
      'D': { frets: [null, null, 0, 2, 3, 2], name: 'D Major' },
      'E': { frets: [0, 2, 2, 1, 0, 0], name: 'E Major' },
      'F': { frets: [1, 3, 3, 2, 1, 1], name: 'F Major (Barre)' },
      'G': { frets: [3, 2, 0, 0, 0, 3], name: 'G Major' },
      'A': { frets: [null, 0, 2, 2, 2, 0], name: 'A Major' },
      'B': { frets: [null, 2, 4, 4, 4, 2], name: 'B Major (Barre)' },
    }
  },

  // ─── MINOR CHORDS ────────────────────────────────────────
  minor: {
    name: 'Minor',
    symbol: 'm',
    formula: [0, 3, 7],
    formulaNames: ['R', 'b3', '5'],
    description: 'The sad, dark, emotional chord. Lowered 3rd creates the minor quality.',
    voicings: {
      'Em_shape': { name: 'E Minor Shape Barre', baseFret: 0, frets: [0, 2, 2, 0, 0, 0], barreString: 0, movable: true },
      'Am_shape': { name: 'A Minor Shape Barre', baseFret: 0, frets: [null, 0, 2, 2, 1, 0], barreString: 1, movable: true },
      'Dm_shape': { name: 'D Minor Shape', baseFret: 0, frets: [null, null, 0, 2, 3, 1], movable: true },
    },
    openChords: {
      'Am': { frets: [null, 0, 2, 2, 1, 0], name: 'A Minor' },
      'Dm': { frets: [null, null, 0, 2, 3, 1], name: 'D Minor' },
      'Em': { frets: [0, 2, 2, 0, 0, 0], name: 'E Minor' },
      'Bm': { frets: [null, 2, 4, 4, 3, 2], name: 'B Minor (Barre)' },
      'Fm': { frets: [1, 3, 3, 1, 1, 1], name: 'F Minor (Barre)' },
      'Gm': { frets: [3, 5, 5, 3, 3, 3], name: 'G Minor (Barre)' },
      'Cm': { frets: [null, 3, 5, 5, 4, 3], name: 'C Minor (Barre)' },
    }
  },

  // ─── DOMINANT 7TH ────────────────────────────────────────
  dom7: {
    name: 'Dominant 7th',
    symbol: '7',
    formula: [0, 4, 7, 10],
    formulaNames: ['R', '3', '5', 'b7'],
    description: 'The blues chord. Major triad + b7 creates tension that wants to resolve. Essential for blues, funk, and jazz. Hendrix\'s favorite.',
    voicings: {
      'E7_shape': { name: 'E7 Shape', baseFret: 0, frets: [0, 2, 0, 1, 0, 0], movable: true },
      'A7_shape': { name: 'A7 Shape', baseFret: 0, frets: [null, 0, 2, 0, 2, 0], movable: true },
      'C7_shape': { name: 'C7 Shape', baseFret: 0, frets: [null, 3, 2, 3, 1, 0], movable: false },
    },
    openChords: {
      'A7': { frets: [null, 0, 2, 0, 2, 0], name: 'A7' },
      'B7': { frets: [null, 2, 1, 2, 0, 2], name: 'B7' },
      'C7': { frets: [null, 3, 2, 3, 1, 0], name: 'C7' },
      'D7': { frets: [null, null, 0, 2, 1, 2], name: 'D7' },
      'E7': { frets: [0, 2, 0, 1, 0, 0], name: 'E7' },
      'G7': { frets: [3, 2, 0, 0, 0, 1], name: 'G7' },
    }
  },

  // ─── MINOR 7TH ───────────────────────────────────────────
  min7: {
    name: 'Minor 7th',
    symbol: 'm7',
    formula: [0, 3, 7, 10],
    formulaNames: ['R', 'b3', '5', 'b7'],
    description: 'Minor triad + b7. Smooth, jazzy, mellow. Think neo-soul, R&B, jazz. John Mayer uses these constantly.',
    voicings: {
      'Em7_shape': { name: 'Em7 Shape', baseFret: 0, frets: [0, 2, 2, 0, 3, 0], movable: true },
      'Am7_shape': { name: 'Am7 Shape', baseFret: 0, frets: [null, 0, 2, 0, 1, 0], movable: true },
      'Dm7_shape': { name: 'Dm7 Shape', baseFret: 0, frets: [null, null, 0, 2, 1, 1], movable: true },
    },
    openChords: {
      'Am7': { frets: [null, 0, 2, 0, 1, 0], name: 'Am7' },
      'Bm7': { frets: [null, 2, 4, 2, 3, 2], name: 'Bm7' },
      'Dm7': { frets: [null, null, 0, 2, 1, 1], name: 'Dm7' },
      'Em7': { frets: [0, 2, 2, 0, 3, 0], name: 'Em7' },
    }
  },

  // ─── MAJOR 7TH ───────────────────────────────────────────
  maj7: {
    name: 'Major 7th',
    symbol: 'maj7',
    formula: [0, 4, 7, 11],
    formulaNames: ['R', '3', '5', '7'],
    description: 'Major triad + major 7th. Dreamy, lush, sophisticated. Think jazz standards, bossa nova, neo-soul. Beautiful in ballads.',
    voicings: {
      'Cmaj7_shape': { name: 'Cmaj7 Shape', baseFret: 0, frets: [null, 3, 2, 0, 0, 0], movable: false },
      'Amaj7_shape': { name: 'Amaj7 Shape', baseFret: 0, frets: [null, 0, 2, 1, 2, 0], movable: true },
      'Emaj7_shape': { name: 'Emaj7 Shape', baseFret: 0, frets: [0, 2, 1, 1, 0, 0], movable: true },
    },
    openChords: {
      'Cmaj7': { frets: [null, 3, 2, 0, 0, 0], name: 'Cmaj7' },
      'Dmaj7': { frets: [null, null, 0, 2, 2, 2], name: 'Dmaj7' },
      'Emaj7': { frets: [0, 2, 1, 1, 0, 0], name: 'Emaj7' },
      'Fmaj7': { frets: [1, null, 2, 2, 1, 0], name: 'Fmaj7' },
      'Gmaj7': { frets: [3, 2, 0, 0, 0, 2], name: 'Gmaj7' },
      'Amaj7': { frets: [null, 0, 2, 1, 2, 0], name: 'Amaj7' },
    }
  },

  // ─── SUSPENDED 2ND ───────────────────────────────────────
  sus2: {
    name: 'Suspended 2nd',
    symbol: 'sus2',
    formula: [0, 2, 7],
    formulaNames: ['R', '2', '5'],
    description: 'The 3rd is replaced by a 2nd — open, airy, ambiguous. Neither major nor minor. Great for atmospheric playing.',
    voicings: {
      'Asus2_shape': { name: 'Asus2 Shape', baseFret: 0, frets: [null, 0, 2, 2, 0, 0], movable: true },
      'Dsus2_shape': { name: 'Dsus2 Shape', baseFret: 0, frets: [null, null, 0, 2, 3, 0], movable: true },
      'Esus2_shape': { name: 'Esus2 Shape', baseFret: 0, frets: [0, 2, 4, 4, 0, 0], movable: true },
    },
    openChords: {
      'Asus2': { frets: [null, 0, 2, 2, 0, 0], name: 'Asus2' },
      'Dsus2': { frets: [null, null, 0, 2, 3, 0], name: 'Dsus2' },
      'Esus2': { frets: [0, 2, 4, 4, 0, 0], name: 'Esus2' },
    }
  },

  // ─── SUSPENDED 4TH ───────────────────────────────────────
  sus4: {
    name: 'Suspended 4th',
    symbol: 'sus4',
    formula: [0, 5, 7],
    formulaNames: ['R', '4', '5'],
    description: 'The 3rd is replaced by a 4th — creates tension that wants to resolve back to major. Classic rock move.',
    voicings: {
      'Asus4_shape': { name: 'Asus4 Shape', baseFret: 0, frets: [null, 0, 2, 2, 3, 0], movable: true },
      'Dsus4_shape': { name: 'Dsus4 Shape', baseFret: 0, frets: [null, null, 0, 2, 3, 3], movable: true },
      'Esus4_shape': { name: 'Esus4 Shape', baseFret: 0, frets: [0, 2, 2, 2, 0, 0], movable: true },
    },
    openChords: {
      'Asus4': { frets: [null, 0, 2, 2, 3, 0], name: 'Asus4' },
      'Dsus4': { frets: [null, null, 0, 2, 3, 3], name: 'Dsus4' },
      'Esus4': { frets: [0, 2, 2, 2, 0, 0], name: 'Esus4' },
    }
  },

  // ─── DIMINISHED ──────────────────────────────────────────
  dim: {
    name: 'Diminished',
    symbol: 'dim',
    formula: [0, 3, 6],
    formulaNames: ['R', 'b3', 'b5'],
    description: 'Minor chord with a flatted 5th — tense, unstable, sinister. Used as passing chords and in jazz.',
    voicings: {
      'Edim_shape': { name: 'E dim Shape', baseFret: 0, frets: [null, null, 1, 2, 1, null], movable: true },
      'Adim_shape': { name: 'A dim Shape', baseFret: 0, frets: [null, 0, 1, 2, 1, null], movable: true },
    },
    openChords: {}
  },

  // ─── AUGMENTED ───────────────────────────────────────────
  aug: {
    name: 'Augmented',
    symbol: 'aug',
    formula: [0, 4, 8],
    formulaNames: ['R', '3', '#5'],
    description: 'Major chord with a raised 5th — dreamy, floating, unresolved. Think Beatles, Radiohead. Symmetrical — same shape repeats every 4 frets.',
    voicings: {
      'Eaug_shape': { name: 'E aug Shape', baseFret: 0, frets: [0, 3, 2, 1, 1, 0], movable: true },
      'Caug_shape': { name: 'C aug Shape', baseFret: 0, frets: [null, 3, 2, 1, 1, 0], movable: true },
    },
    openChords: {}
  },

  // ─── ADD9 ────────────────────────────────────────────────
  add9: {
    name: 'Add 9',
    symbol: 'add9',
    formula: [0, 4, 7, 14],
    formulaNames: ['R', '3', '5', '9'],
    description: 'Major triad + 9th (no 7th). Bright, shimmering, open. A Mayer staple — adds color without the jazz weight of a full 9th chord.',
    voicings: {
      'Cadd9_shape': { name: 'Cadd9 Shape', baseFret: 0, frets: [null, 3, 2, 0, 3, 0], movable: false },
      'Gadd9_shape': { name: 'Gadd9 Shape', baseFret: 0, frets: [3, 0, 0, 0, 0, 3], movable: false },
    },
    openChords: {
      'Cadd9': { frets: [null, 3, 2, 0, 3, 0], name: 'Cadd9' },
      'Gadd9': { frets: [3, 0, 0, 0, 0, 3], name: 'Gadd9' },
      'Eadd9': { frets: [0, 2, 2, 1, 0, 2], name: 'Eadd9' },
    }
  },

  // ─── DOMINANT 9TH ────────────────────────────────────────
  dom9: {
    name: 'Dominant 9th',
    symbol: '9',
    formula: [0, 4, 7, 10, 14],
    formulaNames: ['R', '3', '5', 'b7', '9'],
    description: 'Dominant 7 + 9th. Funky, bluesy, sophisticated. The Hendrix chord (7#9) lives next door.',
    voicings: {
      'A9_shape': { name: 'A9 Shape', baseFret: 0, frets: [null, 0, 2, 1, 2, 0], movable: true },
      'E9_shape': { name: 'E9 Shape', baseFret: 0, frets: [0, 2, 0, 1, 0, 2], movable: true },
    },
    openChords: {}
  },

  // ─── 7#9 (HENDRIX CHORD) ─────────────────────────────────
  dom7sharp9: {
    name: '7#9 (Hendrix Chord)',
    symbol: '7#9',
    formula: [0, 4, 7, 10, 15],
    formulaNames: ['R', '3', '5', 'b7', '#9'],
    description: 'THE Hendrix chord — "Purple Haze", "Foxey Lady". Dominant 7 + #9 creates a major AND minor clash. Aggressive, psychedelic, iconic.',
    voicings: {
      'E7s9_shape': { name: 'E7#9 Shape', baseFret: 0, frets: [0, 2, 1, 2, 3, null], movable: true },
    },
    openChords: {
      'E7#9': { frets: [0, 2, 1, 2, 3, null], name: 'E7#9 (Hendrix)' },
    }
  },

  // ─── POWER CHORD ─────────────────────────────────────────
  power: {
    name: 'Power Chord',
    symbol: '5',
    formula: [0, 7],
    formulaNames: ['R', '5'],
    description: 'Root + 5th — no 3rd means it\'s neither major nor minor. Pure power. The backbone of rock and metal.',
    voicings: {
      'E5_shape': { name: '6th String Root', baseFret: 0, frets: [0, 2, 2, null, null, null], movable: true },
      'A5_shape': { name: '5th String Root', baseFret: 0, frets: [null, 0, 2, 2, null, null], movable: true },
      'D5_shape': { name: '4th String Root', baseFret: 0, frets: [null, null, 0, 2, 2, null], movable: true },
    },
    openChords: {}
  },
};

// Chord categories for UI grouping
const CHORD_CATEGORIES = [
  { name: 'Basic', types: ['major', 'minor', 'power'] },
  { name: '7th Chords', types: ['dom7', 'min7', 'maj7'] },
  { name: 'Extended', types: ['dom9', 'add9', 'dom7sharp9'] },
  { name: 'Suspended', types: ['sus2', 'sus4'] },
  { name: 'Altered', types: ['dim', 'aug'] },
];

// Export
if (typeof window !== 'undefined') {
  window.ChordsData = { CHORD_TYPES, CHORD_CATEGORIES };
}
