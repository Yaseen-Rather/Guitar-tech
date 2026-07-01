/**
 * Interval definitions with names, semitone counts, and descriptions.
 */

export const INTERVALS = [
  {
    semitones: 0,
    shortName: 'R',
    name: 'Root (Unison)',
    description: 'The tonic — the home base. Every scale and chord is built from here.',
    quality: 'perfect',
  },
  {
    semitones: 1,
    shortName: '♭2',
    name: 'Minor 2nd',
    description: 'Tense and dissonant. The sound of Jaws. One half-step up from the root.',
    quality: 'minor',
  },
  {
    semitones: 2,
    shortName: '2',
    name: 'Major 2nd',
    description: 'A whole step up. Open and slightly tense. The first interval in a major scale.',
    quality: 'major',
  },
  {
    semitones: 3,
    shortName: '♭3',
    name: 'Minor 3rd',
    description: 'The interval that makes a chord minor. Sad, dark, emotional.',
    quality: 'minor',
  },
  {
    semitones: 4,
    shortName: '3',
    name: 'Major 3rd',
    description: 'The interval that makes a chord major. Bright, happy, resolved.',
    quality: 'major',
  },
  {
    semitones: 5,
    shortName: '4',
    name: 'Perfect 4th',
    description: 'Strong and open. The sound of "Here Comes the Bride." A pillar interval.',
    quality: 'perfect',
  },
  {
    semitones: 6,
    shortName: '♭5',
    name: 'Tritone (Diminished 5th)',
    description: 'The "devil\'s interval." Maximum tension. Splits the octave exactly in half. The blues note.',
    quality: 'diminished',
  },
  {
    semitones: 7,
    shortName: '5',
    name: 'Perfect 5th',
    description: 'The power chord interval. Strong, stable, powerful. The most consonant interval after the octave.',
    quality: 'perfect',
  },
  {
    semitones: 8,
    shortName: '♯5',
    name: 'Minor 6th (Augmented 5th)',
    description: 'Bittersweet and complex. Used in augmented chords and certain jazz voicings.',
    quality: 'minor',
  },
  {
    semitones: 9,
    shortName: '6',
    name: 'Major 6th',
    description: 'Sweet and melodic. The sound of "My Bonnie Lies Over the Ocean." Common in pentatonic scales.',
    quality: 'major',
  },
  {
    semitones: 10,
    shortName: '♭7',
    name: 'Minor 7th',
    description: 'Bluesy and soulful. The dominant 7th sound. Essential for blues, funk, and rock.',
    quality: 'minor',
  },
  {
    semitones: 11,
    shortName: '7',
    name: 'Major 7th',
    description: 'Smooth and jazzy. One half-step below the octave. The sound of sophistication.',
    quality: 'major',
  },
]

/**
 * Quick lookup: semitones → interval info
 */
export const INTERVAL_MAP = {}
INTERVALS.forEach(interval => {
  INTERVAL_MAP[interval.semitones] = interval
})

/**
 * Get the interval short name for a number of semitones
 */
export function getIntervalShortName(semitones) {
  const normalized = ((semitones % 12) + 12) % 12
  return INTERVAL_MAP[normalized]?.shortName || '?'
}

/**
 * Get the full interval name for a number of semitones
 */
export function getIntervalName(semitones) {
  const normalized = ((semitones % 12) + 12) % 12
  return INTERVAL_MAP[normalized]?.name || 'Unknown'
}
