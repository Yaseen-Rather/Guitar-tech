/**
 * Guitar tuning presets.
 * Each tuning defines the open string notes from low to high (6th string to 1st string)
 * as MIDI note numbers.
 *
 * Standard tuning: E2 A2 D3 G3 B3 E4
 * MIDI: E2=40, A2=45, D3=50, G3=55, B3=59, E4=64
 */

export const TUNINGS = {
  standard: {
    name: 'Standard',
    label: 'EADGBE',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
    midi: [40, 45, 50, 55, 59, 64],
    description: 'Standard tuning. The default for almost everything.',
  },
  drop_d: {
    name: 'Drop D',
    label: 'DADGBE',
    notes: ['D', 'A', 'D', 'G', 'B', 'E'],
    midi: [38, 45, 50, 55, 59, 64],
    description: 'Low E dropped to D. Heavy riffs, power chords with one finger.',
  },
  half_step_down: {
    name: 'Half-Step Down',
    label: 'E♭A♭D♭G♭B♭E♭',
    notes: ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
    midi: [39, 44, 49, 54, 58, 63],
    description: 'Hendrix & SRV tuning. Slightly darker and easier to bend.',
  },
  open_g: {
    name: 'Open G',
    label: 'DGDGBD',
    notes: ['D', 'G', 'D', 'G', 'B', 'D'],
    midi: [38, 43, 50, 55, 59, 62],
    description: 'Open G major chord. Keith Richards\' signature tuning.',
  },
  open_d: {
    name: 'Open D',
    label: 'DADF#AD',
    notes: ['D', 'A', 'D', 'F#', 'A', 'D'],
    midi: [38, 45, 50, 54, 57, 62],
    description: 'Open D major chord. Great for slide guitar.',
  },
  dadgad: {
    name: 'DADGAD',
    label: 'DADGAD',
    notes: ['D', 'A', 'D', 'G', 'A', 'D'],
    midi: [38, 45, 50, 55, 57, 62],
    description: 'Celtic/folk tuning. Suspended, open sound. Used by Led Zeppelin.',
  },
  open_e: {
    name: 'Open E',
    label: 'EBEG#BE',
    notes: ['E', 'B', 'E', 'G#', 'B', 'E'],
    midi: [40, 47, 52, 56, 59, 64],
    description: 'Open E major chord. Duane Allman\'s slide tuning.',
  },
}

/**
 * Get the note names for the open strings of a tuning
 */
export function getTuningNotes(tuningKey) {
  const tuning = TUNINGS[tuningKey]
  return tuning ? [...tuning.notes] : TUNINGS.standard.notes
}

/**
 * Get the MIDI values for the open strings of a tuning
 */
export function getTuningMidi(tuningKey) {
  const tuning = TUNINGS[tuningKey]
  return tuning ? [...tuning.midi] : TUNINGS.standard.midi
}
