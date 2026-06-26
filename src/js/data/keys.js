/**
 * Keys Data — Key signatures, diatonic chords, circle of fifths
 */

// Circle of fifths order (clockwise from C)
const CIRCLE_OF_FIFTHS_MAJOR = ['C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const CIRCLE_OF_FIFTHS_MINOR = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m/Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

// Key signature data (number of sharps/flats)
const KEY_SIGNATURES = {
  'C':  { sharps: 0, flats: 0, accidentals: [] },
  'G':  { sharps: 1, flats: 0, accidentals: ['F#'] },
  'D':  { sharps: 2, flats: 0, accidentals: ['F#', 'C#'] },
  'A':  { sharps: 3, flats: 0, accidentals: ['F#', 'C#', 'G#'] },
  'E':  { sharps: 4, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#'] },
  'B':  { sharps: 5, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  'F#': { sharps: 6, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
  'Gb': { sharps: 0, flats: 6, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
  'Db': { sharps: 0, flats: 5, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
  'Ab': { sharps: 0, flats: 4, accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
  'Eb': { sharps: 0, flats: 3, accidentals: ['Bb', 'Eb', 'Ab'] },
  'Bb': { sharps: 0, flats: 2, accidentals: ['Bb', 'Eb'] },
  'F':  { sharps: 0, flats: 1, accidentals: ['Bb'] },
};

/**
 * Diatonic chords in a major key
 * Roman numeral: I  ii  iii  IV  V  vi  vii°
 * Quality:       M  m   m    M   M  m   dim
 * Intervals from root: 0, 2, 4, 5, 7, 9, 11
 */
const DIATONIC_CHORD_PATTERN = [
  { degree: 'I',    quality: 'major',  interval: 0 },
  { degree: 'ii',   quality: 'minor',  interval: 2 },
  { degree: 'iii',  quality: 'minor',  interval: 4 },
  { degree: 'IV',   quality: 'major',  interval: 5 },
  { degree: 'V',    quality: 'major',  interval: 7 },
  { degree: 'vi',   quality: 'minor',  interval: 9 },
  { degree: 'vii°', quality: 'dim',    interval: 11 },
];

// 7th chord extensions for diatonic chords
const DIATONIC_7TH_PATTERN = [
  { degree: 'Imaj7',   quality: 'maj7',  interval: 0 },
  { degree: 'ii7',     quality: 'min7',  interval: 2 },
  { degree: 'iii7',    quality: 'min7',  interval: 4 },
  { degree: 'IVmaj7',  quality: 'maj7',  interval: 5 },
  { degree: 'V7',      quality: 'dom7',  interval: 7 },
  { degree: 'vi7',     quality: 'min7',  interval: 9 },
  { degree: 'vii∅7',   quality: 'min7b5',interval: 11 },
];

const NOTES_CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT =      ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

/**
 * Get diatonic chords for a given key
 */
function getDiatonicChords(rootNote, use7ths = false) {
  const rootIdx = NOTES_CHROMATIC.indexOf(rootNote) >= 0
    ? NOTES_CHROMATIC.indexOf(rootNote)
    : NOTES_FLAT.indexOf(rootNote);

  if (rootIdx < 0) return [];

  const useFlats = NOTES_FLAT.indexOf(rootNote) >= 0 && NOTES_CHROMATIC.indexOf(rootNote) < 0;
  const noteArray = useFlats ? NOTES_FLAT : NOTES_CHROMATIC;
  const pattern = use7ths ? DIATONIC_7TH_PATTERN : DIATONIC_CHORD_PATTERN;

  return pattern.map(chord => {
    const noteIdx = (rootIdx + chord.interval) % 12;
    const noteName = noteArray[noteIdx];
    const suffix = chord.quality === 'major' ? '' :
                   chord.quality === 'minor' ? 'm' :
                   chord.quality === 'dim' ? 'dim' :
                   chord.quality === 'maj7' ? 'maj7' :
                   chord.quality === 'min7' ? 'm7' :
                   chord.quality === 'dom7' ? '7' :
                   chord.quality === 'min7b5' ? 'm7b5' : '';
    return {
      degree: chord.degree,
      name: noteName + suffix,
      root: noteName,
      quality: chord.quality,
      interval: chord.interval,
    };
  });
}

/**
 * Get relative minor/major
 */
function getRelativeMinor(majorRoot) {
  const idx = NOTES_CHROMATIC.indexOf(majorRoot) >= 0
    ? NOTES_CHROMATIC.indexOf(majorRoot)
    : NOTES_FLAT.indexOf(majorRoot);
  if (idx < 0) return null;
  const minorIdx = (idx + 9) % 12; // 9 semitones up = relative minor
  return NOTES_CHROMATIC[minorIdx];
}

function getRelativeMajor(minorRoot) {
  const idx = NOTES_CHROMATIC.indexOf(minorRoot) >= 0
    ? NOTES_CHROMATIC.indexOf(minorRoot)
    : NOTES_FLAT.indexOf(minorRoot);
  if (idx < 0) return null;
  const majorIdx = (idx + 3) % 12; // 3 semitones up = relative major
  return NOTES_CHROMATIC[majorIdx];
}

/**
 * Common chord progressions
 */
const COMMON_PROGRESSIONS = [
  {
    name: 'I - IV - V',
    degrees: ['I', 'IV', 'V'],
    description: 'The most basic rock/blues/country progression. "Johnny B. Goode", "La Bamba".',
    genre: 'Rock / Blues'
  },
  {
    name: 'I - V - vi - IV',
    degrees: ['I', 'V', 'vi', 'IV'],
    description: 'The most popular progression in modern pop. "Let It Be", "No Woman No Cry", "Someone Like You".',
    genre: 'Pop / Rock'
  },
  {
    name: 'I - vi - IV - V',
    degrees: ['I', 'vi', 'IV', 'V'],
    description: '50s progression / doo-wop. "Stand By Me", "Every Breath You Take".',
    genre: 'Pop / Doo-wop'
  },
  {
    name: 'ii - V - I',
    degrees: ['ii', 'V', 'I'],
    description: 'The essential jazz progression. The backbone of jazz harmony. "Autumn Leaves".',
    genre: 'Jazz'
  },
  {
    name: 'I - IV - vi - V',
    degrees: ['I', 'IV', 'vi', 'V'],
    description: 'Anthemic pop/rock. "With Or Without You", countless worship songs.',
    genre: 'Pop / Rock'
  },
  {
    name: 'vi - IV - I - V',
    degrees: ['vi', 'IV', 'I', 'V'],
    description: 'Emotional, minor-key feel starting on vi. "Neon" by John Mayer, "Save Tonight".',
    genre: 'Pop / Soul'
  },
  {
    name: '12-Bar Blues',
    degrees: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
    description: 'THE blues form. 12 bars, 3 chords, infinite soul. "Red House" (Hendrix), every blues song ever.',
    genre: 'Blues'
  },
  {
    name: 'I - III - IV - iv',
    degrees: ['I', 'III', 'IV', 'iv'],
    description: 'Borrowed chord progression. The minor iv creates a beautiful, bittersweet resolution. "Creep" by Radiohead.',
    genre: 'Alternative'
  },
];

/**
 * Modes data — for the modes module
 */
const MODES = [
  {
    name: 'Ionian',
    degree: 1,
    intervals: [0, 2, 4, 5, 7, 9, 11],
    intervalNames: ['R', '2', '3', '4', '5', '6', '7'],
    mood: 'Happy, bright, resolved',
    description: 'The major scale itself. The "home base" — bright, stable, happy. All other modes are derived from shifting the starting point of this scale.',
    color: '#f5c842',
    examples: ['"Let It Be" — Beatles', '"Thinking Out Loud" — Ed Sheeran'],
  },
  {
    name: 'Dorian',
    degree: 2,
    intervals: [0, 2, 3, 5, 7, 9, 10],
    intervalNames: ['R', '2', 'b3', '4', '5', '6', 'b7'],
    mood: 'Jazzy minor, sophisticated, smooth',
    description: 'Minor scale with a raised 6th — brighter than natural minor. THE John Mayer mode. Funky, soulful, jazzy. Also used heavily in Santana and Grateful Dead.',
    color: '#4fc3f7',
    examples: ['"Neon" — John Mayer', '"Oye Como Va" — Santana', '"So What" — Miles Davis'],
  },
  {
    name: 'Phrygian',
    degree: 3,
    intervals: [0, 1, 3, 5, 7, 8, 10],
    intervalNames: ['R', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    mood: 'Dark, Spanish, exotic, aggressive',
    description: 'The darkest common mode — that b2 creates instant tension. Spanish/flamenco feel. Used in metal for heaviness.',
    color: '#e74c3c',
    examples: ['"White Rabbit" — Jefferson Airplane', '"War" — Joe Satriani'],
  },
  {
    name: 'Lydian',
    degree: 4,
    intervals: [0, 2, 4, 6, 7, 9, 11],
    intervalNames: ['R', '2', '3', '#4', '5', '6', '7'],
    mood: 'Dreamy, floating, ethereal, magical',
    description: 'Major scale with a raised 4th — creates a floating, otherworldly feel. Think movie soundtracks (think Steve Vai, Joe Satriani). The #4 is the magic note.',
    color: '#9b59b6',
    examples: ['"Flying in a Blue Dream" — Joe Satriani', '"The Simpsons Theme"'],
  },
  {
    name: 'Mixolydian',
    degree: 5,
    intervals: [0, 2, 4, 5, 7, 9, 10],
    intervalNames: ['R', '2', '3', '4', '5', '6', 'b7'],
    mood: 'Bluesy major, rock, funky',
    description: 'Major scale with a b7 — the rock/blues mode. Dominant chord territory. Think Hendrix rhythm playing, AC/DC, Grateful Dead. Major feel but with an edge.',
    color: '#e67e22',
    examples: ['"Hey Joe" — Jimi Hendrix', '"Sympathy for the Devil" — Rolling Stones'],
  },
  {
    name: 'Aeolian',
    degree: 6,
    intervals: [0, 2, 3, 5, 7, 8, 10],
    intervalNames: ['R', '2', 'b3', '4', '5', 'b6', 'b7'],
    mood: 'Sad, emotional, dark, melancholic',
    description: 'The natural minor scale. Sad, dark, emotional. The default "minor" sound. Used everywhere — rock, metal, pop, classical.',
    color: '#3498db',
    examples: ['"Stairway to Heaven" — Led Zeppelin', '"Comfortably Numb" — Pink Floyd'],
  },
  {
    name: 'Locrian',
    degree: 7,
    intervals: [0, 1, 3, 5, 6, 8, 10],
    intervalNames: ['R', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    mood: 'Extremely dark, unstable, dissonant',
    description: 'The most dissonant mode — has a b5 which makes even the root chord diminished. Rarely used as a key center but important for theory. Used in metal and avant-garde jazz.',
    color: '#7f8c8d',
    examples: ['"Enter Sandman" intro riff — Metallica (briefly)', 'Jazz tension passages'],
  },
];

// Export
if (typeof window !== 'undefined') {
  window.KeysData = {
    CIRCLE_OF_FIFTHS_MAJOR, CIRCLE_OF_FIFTHS_MINOR,
    KEY_SIGNATURES, DIATONIC_CHORD_PATTERN, DIATONIC_7TH_PATTERN,
    getDiatonicChords, getRelativeMinor, getRelativeMajor,
    COMMON_PROGRESSIONS, MODES,
  };
}
