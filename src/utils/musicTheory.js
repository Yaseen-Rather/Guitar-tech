/**
 * Core music theory calculation utilities.
 */
import { SHARP_NOTES, FLAT_NOTES, NOTE_INDEX, getNoteAtInterval } from '../data/notes'
import { SCALES } from '../data/scales'
import { CHORD_TYPES } from '../data/chords'

/**
 * Get all notes in a scale for a given root
 * @param {string} root - Root note (e.g., 'A', 'C#')
 * @param {string} scaleKey - Scale key from SCALES (e.g., 'pentatonic_minor')
 * @param {boolean} useFlats - Use flat names instead of sharps
 * @returns {Array<{note: string, interval: number, degree: string}>}
 */
export function getScaleNotes(root, scaleKey, useFlats = false) {
  const scale = SCALES[scaleKey]
  if (!scale) return []

  const degreeNames = {
    0: 'R', 1: '♭2', 2: '2', 3: '♭3', 4: '3', 5: '4',
    6: '♭5', 7: '5', 8: '♯5', 9: '6', 10: '♭7', 11: '7',
  }

  return scale.intervals.map(interval => ({
    note: getNoteAtInterval(root, interval, useFlats),
    interval,
    degree: degreeNames[interval] || '?',
  }))
}

/**
 * Get all notes in a chord for a given root
 */
export function getChordNotes(root, chordTypeKey, useFlats = false) {
  const chordType = CHORD_TYPES[chordTypeKey]
  if (!chordType) return []

  return chordType.intervals.map(interval => ({
    note: getNoteAtInterval(root, interval % 12, useFlats),
    interval: interval % 12,
  }))
}

/**
 * Get the diatonic chords (triads) for a key
 * @param {string} key - Root note of the key
 * @param {string} scaleKey - Scale type (default: 'major')
 * @returns {Array<{root: string, type: string, numeral: string}>}
 */
export function getDiatonicChords(key, scaleKey = 'major', useFlats = false) {
  const scale = SCALES[scaleKey]
  if (!scale) return []

  const notes = scale.intervals.map(i => getNoteAtInterval(key, i, useFlats))

  // Diatonic triad qualities for major scale
  const majorTriadQualities = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim']
  const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

  // Diatonic 7th chord qualities for major scale
  const major7thQualities = ['maj7', 'min7', 'min7', 'maj7', 'dom7', 'min7', 'min7b5']
  const major7thNumerals = ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7']

  return notes.map((note, i) => ({
    root: note,
    type: majorTriadQualities[i],
    numeral: majorNumerals[i],
    seventh: major7thQualities[i],
    seventhNumeral: major7thNumerals[i],
  }))
}

/**
 * Get common chord progressions for a key
 */
export function getCommonProgressions(key, useFlats = false) {
  const chords = getDiatonicChords(key, 'major', useFlats)

  return [
    {
      name: 'I - IV - V',
      description: 'The most basic rock/blues progression',
      chords: [chords[0], chords[3], chords[4]],
    },
    {
      name: 'I - V - vi - IV',
      description: 'The "pop" progression — used in thousands of hits',
      chords: [chords[0], chords[4], chords[5], chords[3]],
    },
    {
      name: 'ii - V - I',
      description: 'The jazz standard progression',
      chords: [chords[1], chords[4], chords[0]],
    },
    {
      name: 'I - vi - IV - V',
      description: 'The "50s" progression — doo-wop and classic rock',
      chords: [chords[0], chords[5], chords[3], chords[4]],
    },
    {
      name: 'vi - IV - I - V',
      description: 'The minor "hit" progression',
      chords: [chords[5], chords[3], chords[0], chords[4]],
    },
    {
      name: 'I - IV - vi - V',
      description: 'Country/folk staple',
      chords: [chords[0], chords[3], chords[5], chords[4]],
    },
  ]
}

/**
 * Check if a note is in a given scale
 */
export function isNoteInScale(note, root, scaleKey) {
  const scaleNotes = getScaleNotes(root, scaleKey).map(n => n.note)
  const flatScaleNotes = getScaleNotes(root, scaleKey, true).map(n => n.note)
  return scaleNotes.includes(note) || flatScaleNotes.includes(note)
}

/**
 * Get the interval (in semitones) between two notes
 */
export function getInterval(note1, note2) {
  const idx1 = NOTE_INDEX[note1]
  const idx2 = NOTE_INDEX[note2]
  if (idx1 === undefined || idx2 === undefined) return null
  return ((idx2 - idx1) + 12) % 12
}

/**
 * Get the key signature (number of sharps or flats) for a major key
 */
export function getKeySignature(key) {
  const keySignatures = {
    'C': { sharps: 0, flats: 0, accidentals: [] },
    'G': { sharps: 1, flats: 0, accidentals: ['F#'] },
    'D': { sharps: 2, flats: 0, accidentals: ['F#', 'C#'] },
    'A': { sharps: 3, flats: 0, accidentals: ['F#', 'C#', 'G#'] },
    'E': { sharps: 4, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#'] },
    'B': { sharps: 5, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
    'F#': { sharps: 6, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
    'Gb': { sharps: 0, flats: 6, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
    'F': { sharps: 0, flats: 1, accidentals: ['Bb'] },
    'Bb': { sharps: 0, flats: 2, accidentals: ['Bb', 'Eb'] },
    'Eb': { sharps: 0, flats: 3, accidentals: ['Bb', 'Eb', 'Ab'] },
    'Ab': { sharps: 0, flats: 4, accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
    'Db': { sharps: 0, flats: 5, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
  }
  return keySignatures[key] || { sharps: 0, flats: 0, accidentals: [] }
}

/**
 * Get the relative minor for a major key (or vice versa)
 */
export function getRelativeMinor(majorKey, useFlats = false) {
  return getNoteAtInterval(majorKey, 9, useFlats) // 9 semitones up = minor 6th
}

export function getRelativeMajor(minorKey, useFlats = false) {
  return getNoteAtInterval(minorKey, 3, useFlats) // 3 semitones up = minor 3rd
}
