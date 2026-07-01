// All 12 chromatic notes with sharp and flat spellings
export const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Note index lookup (using sharps)
export const NOTE_INDEX = {}
SHARP_NOTES.forEach((note, i) => { NOTE_INDEX[note] = i })
FLAT_NOTES.forEach((note, i) => { if (!NOTE_INDEX[note]) NOTE_INDEX[note] = i })

// Enharmonic equivalents
export const ENHARMONIC_MAP = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#',
}

// Base frequencies for octave 4 (A4 = 440Hz)
const A4_FREQ = 440
const A4_MIDI = 69

/**
 * Get the frequency for a given MIDI note number
 */
export function midiToFrequency(midi) {
  return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12)
}

/**
 * Convert note name + octave to MIDI number
 * e.g., noteToMidi('A', 4) = 69
 */
export function noteToMidi(noteName, octave) {
  const index = NOTE_INDEX[noteName]
  if (index === undefined) return null
  return (octave + 1) * 12 + index
}

/**
 * Convert MIDI number to note name and octave
 */
export function midiToNoteName(midi, useFlats = false) {
  const notes = useFlats ? FLAT_NOTES : SHARP_NOTES
  const octave = Math.floor(midi / 12) - 1
  const noteIndex = midi % 12
  return { note: notes[noteIndex], octave }
}

/**
 * Get all 12 note names
 */
export function getNoteNames(useFlats = false) {
  return useFlats ? [...FLAT_NOTES] : [...SHARP_NOTES]
}

/**
 * Get note name at a given number of semitones from a root
 */
export function getNoteAtInterval(root, semitones, useFlats = false) {
  const notes = useFlats ? FLAT_NOTES : SHARP_NOTES
  const rootIndex = NOTE_INDEX[root]
  if (rootIndex === undefined) return null
  const targetIndex = (rootIndex + semitones) % 12
  return notes[targetIndex]
}
