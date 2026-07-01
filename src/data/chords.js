/**
 * Chord definitions with interval formulas and voicings.
 *
 * Voicings format: array of 6 values [E, A, D, G, B, e]
 *   - number: fret to press
 *   - 0: open string
 *   - null: muted/not played (x)
 *
 * Voicings are defined in the key of C/A/E/G/D (natural positions)
 * and transposed algorithmically for other roots.
 */

// Chord types defined by interval formula (semitones from root)
export const CHORD_TYPES = {
  major: {
    name: 'Major',
    symbol: '',
    intervals: [0, 4, 7],
    category: 'basic',
    description: 'Bright, happy, resolved. The most fundamental chord.',
  },
  minor: {
    name: 'Minor',
    symbol: 'm',
    intervals: [0, 3, 7],
    category: 'basic',
    description: 'Sad, dark, emotional. The minor counterpart to major.',
  },
  power: {
    name: 'Power Chord',
    symbol: '5',
    intervals: [0, 7],
    category: 'basic',
    description: 'Root and 5th only. Neither major nor minor. The sound of rock.',
  },
  dom7: {
    name: 'Dominant 7th',
    symbol: '7',
    intervals: [0, 4, 7, 10],
    category: '7th',
    description: 'Bluesy and tense. Wants to resolve. The essential blues chord.',
  },
  maj7: {
    name: 'Major 7th',
    symbol: 'maj7',
    intervals: [0, 4, 7, 11],
    category: '7th',
    description: 'Smooth, jazzy, dreamy. The sound of sophistication.',
  },
  min7: {
    name: 'Minor 7th',
    symbol: 'm7',
    intervals: [0, 3, 7, 10],
    category: '7th',
    description: 'Warm and mellow. Essential for jazz, R&B, and neo-soul.',
  },
  dim: {
    name: 'Diminished',
    symbol: 'dim',
    intervals: [0, 3, 6],
    category: 'altered',
    description: 'Tense and unstable. Built on minor 3rds. Wants to resolve.',
  },
  aug: {
    name: 'Augmented',
    symbol: 'aug',
    intervals: [0, 4, 8],
    category: 'altered',
    description: 'Mysterious and unresolved. Built on major 3rds. Symmetrical.',
  },
  sus2: {
    name: 'Suspended 2nd',
    symbol: 'sus2',
    intervals: [0, 2, 7],
    category: 'suspended',
    description: 'Open and ambiguous. The 2nd replaces the 3rd. Neither major nor minor.',
  },
  sus4: {
    name: 'Suspended 4th',
    symbol: 'sus4',
    intervals: [0, 5, 7],
    category: 'suspended',
    description: 'Suspended tension. The 4th replaces the 3rd. Wants to resolve to major.',
  },
  add9: {
    name: 'Add 9',
    symbol: 'add9',
    intervals: [0, 4, 7, 14],
    category: 'extended',
    description: 'Major chord with an added 9th (2nd). Shimmery and full. Hendrix loved these.',
  },
  add11: {
    name: 'Add 11',
    symbol: 'add11',
    intervals: [0, 4, 7, 17],
    category: 'extended',
    description: 'Major chord with an added 11th (4th). Wide and open.',
  },
  dom9: {
    name: 'Dominant 9th',
    symbol: '9',
    intervals: [0, 4, 7, 10, 14],
    category: 'extended',
    description: 'Funky and soulful. The 9th chord. Essential for funk and R&B.',
  },
  dom11: {
    name: 'Dominant 11th',
    symbol: '11',
    intervals: [0, 4, 7, 10, 14, 17],
    category: 'extended',
    description: 'Complex and jazzy. Often used as a dominant substitution.',
  },
  dom13: {
    name: 'Dominant 13th',
    symbol: '13',
    intervals: [0, 4, 7, 10, 14, 21],
    category: 'extended',
    description: 'Full and rich. Contains almost every note of the scale.',
  },
}

// Chord categories for UI grouping
export const CHORD_CATEGORIES = {
  basic: { name: 'Basic', description: 'Major, Minor, Power' },
  '7th': { name: '7th Chords', description: 'Dominant, Major, Minor 7th' },
  altered: { name: 'Altered', description: 'Diminished & Augmented' },
  suspended: { name: 'Suspended', description: 'Sus2 & Sus4' },
  extended: { name: 'Extended', description: '9th, 11th, 13th, Add chords' },
}

/**
 * Common chord voicings in standard tuning.
 * Key: rootNote, Value: object of chord types with voicing arrays.
 *
 * Each voicing: {
 *   frets: [E, A, D, G, B, e],  // null = muted, 0 = open
 *   name: string,                // shape name
 *   barreAt: number | null,      // barre fret if applicable
 *   fingers: [1-4] | null,       // finger assignments (optional)
 * }
 */
export const VOICINGS = {
  // Open chord voicings (common keys)
  C: {
    major: [
      { frets: [null, 3, 2, 0, 1, 0], name: 'Open', barreAt: null },
      { frets: [8, 10, 10, 9, 8, 8], name: 'E Shape Barre', barreAt: 8 },
      { frets: [null, 3, 5, 5, 5, 3], name: 'A Shape Barre', barreAt: 3 },
    ],
    minor: [
      { frets: [null, 3, 5, 5, 4, 3], name: 'A Shape Barre', barreAt: 3 },
      { frets: [8, 10, 10, 8, 8, 8], name: 'E Shape Barre', barreAt: 8 },
    ],
  },
  D: {
    major: [
      { frets: [null, null, 0, 2, 3, 2], name: 'Open', barreAt: null },
      { frets: [null, 5, 7, 7, 7, 5], name: 'A Shape Barre', barreAt: 5 },
      { frets: [10, 12, 12, 11, 10, 10], name: 'E Shape Barre', barreAt: 10 },
    ],
    minor: [
      { frets: [null, null, 0, 2, 3, 1], name: 'Open', barreAt: null },
      { frets: [null, 5, 7, 7, 6, 5], name: 'A Shape Barre', barreAt: 5 },
      { frets: [10, 12, 12, 10, 10, 10], name: 'E Shape Barre', barreAt: 10 },
    ],
  },
  E: {
    major: [
      { frets: [0, 2, 2, 1, 0, 0], name: 'Open', barreAt: null },
    ],
    minor: [
      { frets: [0, 2, 2, 0, 0, 0], name: 'Open', barreAt: null },
    ],
    dom7: [
      { frets: [0, 2, 0, 1, 0, 0], name: 'Open', barreAt: null },
    ],
  },
  A: {
    major: [
      { frets: [null, 0, 2, 2, 2, 0], name: 'Open', barreAt: null },
      { frets: [5, 7, 7, 6, 5, 5], name: 'E Shape Barre', barreAt: 5 },
      { frets: [null, 0, 2, 2, 2, 0], name: 'A Shape', barreAt: null },
      { frets: [null, null, 7, 6, 5, 5], name: 'C Shape', barreAt: null },
      { frets: [null, null, 12, 11, 10, 10], name: 'D Shape', barreAt: null },
    ],
    minor: [
      { frets: [null, 0, 2, 2, 1, 0], name: 'Open', barreAt: null },
      { frets: [5, 7, 7, 5, 5, 5], name: 'E Shape Barre', barreAt: 5 },
    ],
    dom7: [
      { frets: [null, 0, 2, 0, 2, 0], name: 'Open', barreAt: null },
      { frets: [5, 7, 5, 6, 5, 5], name: 'E Shape Barre', barreAt: 5 },
    ],
    maj7: [
      { frets: [null, 0, 2, 1, 2, 0], name: 'Open', barreAt: null },
    ],
    min7: [
      { frets: [null, 0, 2, 0, 1, 0], name: 'Open', barreAt: null },
    ],
  },
  G: {
    major: [
      { frets: [3, 2, 0, 0, 0, 3], name: 'Open', barreAt: null },
      { frets: [3, 5, 5, 4, 3, 3], name: 'E Shape Barre', barreAt: 3 },
    ],
    minor: [
      { frets: [3, 5, 5, 3, 3, 3], name: 'E Shape Barre', barreAt: 3 },
    ],
  },
  F: {
    major: [
      { frets: [1, 3, 3, 2, 1, 1], name: 'E Shape Barre', barreAt: 1 },
      { frets: [null, null, 3, 2, 1, 1], name: 'Partial Barre', barreAt: 1 },
    ],
    minor: [
      { frets: [1, 3, 3, 1, 1, 1], name: 'E Shape Barre', barreAt: 1 },
    ],
  },
  B: {
    major: [
      { frets: [null, 2, 4, 4, 4, 2], name: 'A Shape Barre', barreAt: 2 },
      { frets: [7, 9, 9, 8, 7, 7], name: 'E Shape Barre', barreAt: 7 },
    ],
    minor: [
      { frets: [null, 2, 4, 4, 3, 2], name: 'A Shape Barre', barreAt: 2 },
      { frets: [7, 9, 9, 7, 7, 7], name: 'E Shape Barre', barreAt: 7 },
    ],
  },
}

/**
 * Generate a barre chord voicing by transposing an E or A shape
 */
export function generateBarreVoicing(rootNote, chordType, shape = 'E') {
  const NOTE_INDEX = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 }

  const baseShapes = {
    E: {
      major: [0, 2, 2, 1, 0, 0],
      minor: [0, 2, 2, 0, 0, 0],
      dom7: [0, 2, 0, 1, 0, 0],
      maj7: [0, 2, 1, 1, 0, 0],
      min7: [0, 2, 0, 0, 0, 0],
    },
    A: {
      major: [null, 0, 2, 2, 2, 0],
      minor: [null, 0, 2, 2, 1, 0],
      dom7: [null, 0, 2, 0, 2, 0],
      maj7: [null, 0, 2, 1, 2, 0],
      min7: [null, 0, 2, 0, 1, 0],
    },
  }

  const baseNote = shape === 'E' ? 'E' : 'A'
  const baseIndex = NOTE_INDEX[baseNote]
  const targetIndex = NOTE_INDEX[rootNote]
  if (targetIndex === undefined) return null

  const offset = ((targetIndex - baseIndex) + 12) % 12
  const baseShape = baseShapes[shape]?.[chordType]
  if (!baseShape) return null

  const frets = baseShape.map(f => f === null ? null : f + offset)

  return {
    frets,
    name: `${shape} Shape Barre`,
    barreAt: offset > 0 ? offset : null,
  }
}

/**
 * Get all available voicings for a given root + chord type
 */
export function getVoicingsForChord(rootNote, chordType) {
  // First check if we have pre-defined voicings
  const predefined = VOICINGS[rootNote]?.[chordType] || []

  // If we don't have any, generate barre chord voicings
  if (predefined.length === 0) {
    const voicings = []
    const eShape = generateBarreVoicing(rootNote, chordType, 'E')
    const aShape = generateBarreVoicing(rootNote, chordType, 'A')
    if (eShape) voicings.push(eShape)
    if (aShape) voicings.push(aShape)
    return voicings
  }

  return predefined
}
