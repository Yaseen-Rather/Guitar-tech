/**
 * Scale definitions with interval patterns, descriptions, and metadata.
 * Intervals are in semitones from the root.
 */

export const SCALES = {
  major: {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    category: 'modes',
    description: 'The foundation of Western music. Bright, happy, and resolved. The scale everything else is built from.',
    famous: 'Used by every guitarist ever — the backbone of music theory.',
  },
  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    category: 'modes',
    description: 'Minor scale with a bright 6th. The go-to scale for minor jazz, funk, and blues soloing. Has a sophisticated, cool sound.',
    famous: 'Carlos Santana, John Mayer (Gravity solo), Miles Davis (So What).',
  },
  phrygian: {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    category: 'modes',
    description: 'Dark and exotic. The flat 2nd gives it a Spanish/Middle Eastern flavor.',
    famous: 'Metallica, Flamenco guitar, Al Di Meola.',
  },
  lydian: {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    category: 'modes',
    description: 'Dreamy and ethereal. The raised 4th creates a floating, magical quality.',
    famous: 'Steve Vai, Joe Satriani (Flying in a Blue Dream), The Simpsons theme.',
  },
  mixolydian: {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    category: 'modes',
    description: 'Major scale with a flat 7th. The sound of classic rock, blues-rock, and country. Dominant and driving.',
    famous: 'Jimi Hendrix, The Allman Brothers, John Mayer, AC/DC.',
  },
  aeolian: {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    category: 'modes',
    description: 'The natural minor scale. Sad, melancholic, and emotional. The relative minor of the major scale.',
    famous: 'Stairway to Heaven, Nothing Else Matters, most metal and rock ballads.',
  },
  locrian: {
    name: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    category: 'modes',
    description: 'The darkest mode. With a flat 2nd and flat 5th, it sounds unstable and tense. Rarely used as a standalone scale.',
    famous: 'Used in metal and jazz over diminished chords.',
  },
  pentatonic_major: {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9],
    category: 'pentatonic',
    description: 'The major pentatonic — 5 notes from the major scale. Sounds bright, country, and feel-good.',
    famous: 'The Allman Brothers, Lynyrd Skynyrd, country guitar.',
  },
  pentatonic_minor: {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10],
    category: 'pentatonic',
    description: 'The most essential rock/blues scale. You already know this one! 5 notes, infinite possibilities. The foundation of soloing for Hendrix, Mayer, Clapton, and almost every guitarist.',
    famous: 'Jimi Hendrix, John Mayer, B.B. King, Eric Clapton, David Gilmour.',
  },
  blues_minor: {
    name: 'Blues Scale (Minor)',
    intervals: [0, 3, 5, 6, 7, 10],
    category: 'blues',
    description: 'Minor pentatonic + the "blue note" (flat 5th / sharp 4th). The soulful, gritty sound of the blues. That extra note adds all the tension and release.',
    famous: 'B.B. King, Stevie Ray Vaughan, Jimi Hendrix, John Mayer.',
  },
  blues_major: {
    name: 'Blues Scale (Major)',
    intervals: [0, 2, 3, 4, 7, 9],
    category: 'blues',
    description: 'Major pentatonic + a flat 3rd passing tone. Sweet and soulful. Gives a gospel/R&B feel to your playing.',
    famous: 'John Mayer, B.B. King, Albert King.',
  },
}

// Scale categories for UI grouping
export const SCALE_CATEGORIES = {
  modes: { name: 'Modes', description: '7 modes of the major scale' },
  pentatonic: { name: 'Pentatonic', description: '5-note scales' },
  blues: { name: 'Blues', description: 'Blues scales with blue notes' },
}

/**
 * CAGED shape positions for pentatonic scales.
 * Each shape defines the fret range relative to the root position.
 * Format: { string: [fret offsets from shape start] } for each of the 6 strings
 */
export const PENTATONIC_SHAPES = {
  shape1: { name: 'Shape 1 (E Shape)', rootString: 6, description: 'The most common box position. Root on the low E string.' },
  shape2: { name: 'Shape 2 (D Shape)', rootString: 4, description: 'Connects above Shape 1. Root on the D string.' },
  shape3: { name: 'Shape 3 (C Shape)', rootString: 5, description: 'The "Albert King" box. Root on the A string.' },
  shape4: { name: 'Shape 4 (A Shape)', rootString: 5, description: 'Connects to Shape 5. Root on the A string.' },
  shape5: { name: 'Shape 5 (G Shape)', rootString: 6, description: 'Wraps back to Shape 1. Root on the low E string.' },
}

/**
 * Get the interval degree labels for a scale
 */
export function getScaleDegreeLabels(scaleKey) {
  const scale = SCALES[scaleKey]
  if (!scale) return []

  const degreeNames = {
    0: 'R', 1: '♭2', 2: '2', 3: '♭3', 4: '3', 5: '4',
    6: '♭5', 7: '5', 8: '♯5', 9: '6', 10: '♭7', 11: '7',
  }

  return scale.intervals.map(i => degreeNames[i])
}
