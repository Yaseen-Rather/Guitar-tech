/**
 * Fretboard grid generation and note position calculation utilities.
 */
import { SHARP_NOTES, FLAT_NOTES, NOTE_INDEX, midiToFrequency } from '../data/notes'
import { TUNINGS } from '../data/tunings'

/**
 * Generate the complete fretboard note grid for a given tuning.
 * Returns a 2D array: [string][fret] = { note, midi, frequency }
 *
 * Strings are ordered from low E (index 0) to high E (index 5).
 * Frets go from 0 (open) to fretCount.
 *
 * @param {string} tuningKey - Key from TUNINGS object
 * @param {number} fretCount - Number of frets (default 22)
 * @param {boolean} useFlats - Use flat note names
 * @returns {Array<Array<{note: string, midi: number, frequency: number, string: number, fret: number}>>}
 */
export function generateFretboardNotes(tuningKey = 'standard', fretCount = 22, useFlats = false) {
  const tuning = TUNINGS[tuningKey]
  if (!tuning) return []

  const notes = useFlats ? FLAT_NOTES : SHARP_NOTES
  const grid = []

  for (let string = 0; string < 6; string++) {
    const stringNotes = []
    const openMidi = tuning.midi[string]

    for (let fret = 0; fret <= fretCount; fret++) {
      const midi = openMidi + fret
      const noteIndex = midi % 12
      const note = notes[noteIndex]
      const frequency = midiToFrequency(midi)

      stringNotes.push({
        note,
        midi,
        frequency,
        string,        // 0 = low E, 5 = high E
        fret,
        octave: Math.floor(midi / 12) - 1,
      })
    }
    grid.push(stringNotes)
  }

  return grid
}

/**
 * Get fretboard positions where a specific set of notes appear.
 * Used for highlighting scales, chords, intervals, etc.
 *
 * @param {Array<string>} targetNotes - Notes to find (e.g., ['A', 'C', 'E'])
 * @param {string} tuningKey - Tuning
 * @param {number} fretCount - Number of frets
 * @param {boolean} useFlats - Use flat names
 * @returns {Array<{string: number, fret: number, note: string, midi: number, frequency: number}>}
 */
export function findNotePositions(targetNotes, tuningKey = 'standard', fretCount = 22, useFlats = false) {
  const grid = generateFretboardNotes(tuningKey, fretCount, useFlats)
  const positions = []

  // Normalize target notes to indices for comparison
  const targetIndices = new Set(
    targetNotes.map(note => NOTE_INDEX[note]).filter(i => i !== undefined)
  )

  for (const stringNotes of grid) {
    for (const noteData of stringNotes) {
      const noteIndex = NOTE_INDEX[noteData.note]
      if (targetIndices.has(noteIndex)) {
        positions.push(noteData)
      }
    }
  }

  return positions
}

/**
 * Get positions for a specific scale shape (for CAGED shapes).
 * Filters positions to a specific fret range.
 *
 * @param {Array<string>} scaleNotes - Notes in the scale
 * @param {number} startFret - Start fret of the shape
 * @param {number} endFret - End fret of the shape
 * @param {string} tuningKey - Tuning
 * @param {boolean} useFlats
 * @returns {Array}
 */
export function getShapePositions(scaleNotes, startFret, endFret, tuningKey = 'standard', useFlats = false) {
  const allPositions = findNotePositions(scaleNotes, tuningKey, 24, useFlats)
  return allPositions.filter(pos => pos.fret >= startFret && pos.fret <= endFret)
}

/**
 * Calculate the starting fret for each pentatonic shape based on root note.
 * Returns an object with shape1-5 start/end fret ranges.
 */
export function getPentatonicShapeRanges(rootNote, tuningKey = 'standard') {
  const tuning = TUNINGS[tuningKey]
  if (!tuning) return {}

  // Find the root note on the low E string (string 0)
  const lowEMidi = tuning.midi[0]
  const rootIndex = NOTE_INDEX[rootNote]
  if (rootIndex === undefined) return {}

  // Find the root fret on low E
  let rootFret = (rootIndex - (lowEMidi % 12) + 12) % 12
  if (rootFret === 0) rootFret = 12 // Use 12th fret position for open string roots

  // Shape positions relative to the root fret on low E
  // These are standard pentatonic minor box patterns
  return {
    shape1: { start: rootFret - 3, end: rootFret, name: 'Shape 1 (E Shape)' },
    shape2: { start: rootFret, end: rootFret + 3, name: 'Shape 2 (D Shape)' },
    shape3: { start: rootFret + 2, end: rootFret + 5, name: 'Shape 3 (C Shape)' },
    shape4: { start: rootFret + 5, end: rootFret + 7, name: 'Shape 4 (A Shape)' },
    shape5: { start: rootFret + 7, end: rootFret + 10, name: 'Shape 5 (G Shape)' },
  }
}

/**
 * Get the string label for display (note name of the open string)
 */
export function getStringLabels(tuningKey = 'standard') {
  const tuning = TUNINGS[tuningKey]
  if (!tuning) return ['E', 'A', 'D', 'G', 'B', 'E']
  return [...tuning.notes]
}

/**
 * Get which frets have position markers (dots)
 */
export function getFretMarkers(fretCount = 22) {
  const single = [3, 5, 7, 9, 15, 17, 19, 21]
  const double = [12, 24]

  const markers = {}
  for (let fret = 1; fret <= fretCount; fret++) {
    if (double.includes(fret)) {
      markers[fret] = 'double'
    } else if (single.includes(fret)) {
      markers[fret] = 'single'
    }
  }
  return markers
}
