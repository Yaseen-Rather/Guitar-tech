/**
 * Scales Data — All scale formulas and 5-position box shapes
 * 
 * Each scale defines:
 *   - intervals: semitones from root
 *   - shapes: 5 box shapes, each defined as fret offsets per string
 *             relative to the root note position on the low E string
 *   - description: musical character of the scale
 */

const SCALES = {
  // ─── PENTATONIC MINOR ─────────────────────────────────────
  pentatonic_minor: {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10],
    intervalNames: ['R', 'b3', '4', '5', 'b7'],
    description: 'The most essential rock/blues scale. You already know this one! The foundation of soloing for Hendrix, Mayer, Clapton, and almost every guitarist.',
    shapes: [
      {
        name: 'Shape 1 (E Shape)',
        startFretOffset: 0,
        frets: [
          [0, 3],       // 6th string (low E)
          [0, 2],       // 5th string (A)
          [0, 2],       // 4th string (D)
          [0, 2],       // 3rd string (G)
          [0, 3],       // 2nd string (B)
          [0, 3],       // 1st string (high e)
        ]
      },
      {
        name: 'Shape 2 (D Shape)',
        startFretOffset: 3,
        frets: [
          [3, 5],
          [2, 5],
          [2, 5],
          [2, 5],
          [3, 5],
          [3, 5],
        ]
      },
      {
        name: 'Shape 3 (C Shape)',
        startFretOffset: 5,
        frets: [
          [5, 7],
          [5, 7],
          [5, 7],
          [5, 7],
          [5, 8],
          [5, 8],
        ]
      },
      {
        name: 'Shape 4 (A Shape)',
        startFretOffset: 7,
        frets: [
          [7, 10],
          [7, 10],
          [7, 9],
          [7, 9],
          [8, 10],
          [8, 10],
        ]
      },
      {
        name: 'Shape 5 (G Shape)',
        startFretOffset: 10,
        frets: [
          [10, 12],
          [10, 12],
          [9, 12],
          [9, 12],
          [10, 12],
          [10, 12],
        ]
      },
    ]
  },

  // ─── PENTATONIC MAJOR ─────────────────────────────────────
  pentatonic_major: {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9],
    intervalNames: ['R', '2', '3', '5', '6'],
    description: 'The bright, happy version of the pentatonic. Same shapes as minor pentatonic but starting from a different root. Think country licks and uplifting solos.',
    shapes: [
      {
        name: 'Shape 1 (E Shape)',
        startFretOffset: 0,
        frets: [
          [0, 2],
          [0, 2],
          [-1, 2],
          [-1, 2],
          [0, 2],
          [0, 2],
        ]
      },
      {
        name: 'Shape 2 (D Shape)',
        startFretOffset: 2,
        frets: [
          [2, 4],
          [2, 4],
          [2, 4],
          [2, 4],
          [2, 5],
          [2, 5],
        ]
      },
      {
        name: 'Shape 3 (C Shape)',
        startFretOffset: 4,
        frets: [
          [4, 7],
          [4, 7],
          [4, 7],
          [4, 6],
          [5, 7],
          [5, 7],
        ]
      },
      {
        name: 'Shape 4 (A Shape)',
        startFretOffset: 7,
        frets: [
          [7, 9],
          [7, 9],
          [7, 9],
          [6, 9],
          [7, 9],
          [7, 9],
        ]
      },
      {
        name: 'Shape 5 (G Shape)',
        startFretOffset: 9,
        frets: [
          [9, 12],
          [9, 12],
          [9, 11],
          [9, 11],
          [9, 12],
          [9, 12],
        ]
      },
    ]
  },

  // ─── NATURAL MINOR (AEOLIAN) ──────────────────────────────
  natural_minor: {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    intervalNames: ['R', '2', 'b3', '4', '5', 'b6', 'b7'],
    description: 'The full minor scale — adds two notes to your minor pentatonic. Sad, emotional, dark. This is the Aeolian mode.',
    shapes: [
      {
        name: 'Shape 1 (E Shape)',
        startFretOffset: 0,
        frets: [
          [0, 1, 3],
          [0, 2, 3],
          [0, 2],
          [0, 2],
          [0, 1, 3],
          [0, 1, 3],
        ]
      },
      {
        name: 'Shape 2 (D Shape)',
        startFretOffset: 3,
        frets: [
          [3, 5],
          [3, 5],
          [2, 3, 5],
          [2, 3, 5],
          [3, 5, 6],
          [3, 5],
        ]
      },
      {
        name: 'Shape 3 (C Shape)',
        startFretOffset: 5,
        frets: [
          [5, 7, 8],
          [5, 7],
          [5, 7],
          [5, 7],
          [6, 8],
          [5, 7, 8],
        ]
      },
      {
        name: 'Shape 4 (A Shape)',
        startFretOffset: 7,
        frets: [
          [7, 8, 10],
          [7, 8, 10],
          [7, 9, 10],
          [7, 9, 10],
          [8, 10],
          [8, 10],
        ]
      },
      {
        name: 'Shape 5 (G Shape)',
        startFretOffset: 10,
        frets: [
          [10, 12],
          [10, 12, 13],
          [10, 12],
          [10, 12],
          [10, 11, 13],
          [10, 12, 13],
        ]
      },
    ]
  },

  // ─── MAJOR (IONIAN) ──────────────────────────────────────
  major: {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    intervalNames: ['R', '2', '3', '4', '5', '6', '7'],
    description: 'The foundational scale in all of Western music. Bright, happy, resolved. This is the Ionian mode — the one everything else is built from.',
    shapes: [
      {
        name: 'Shape 1 (E Shape)',
        startFretOffset: 0,
        frets: [
          [0, 2, 4],
          [0, 2],
          [-1, 0, 2],
          [-1, 1, 2],
          [0, 2],
          [0, 2, 4],
        ]
      },
      {
        name: 'Shape 2 (D Shape)',
        startFretOffset: 2,
        frets: [
          [2, 4, 5],
          [2, 4, 5],
          [2, 4],
          [2, 4],
          [2, 4, 5],
          [2, 4],
        ]
      },
      {
        name: 'Shape 3 (C Shape)',
        startFretOffset: 4,
        frets: [
          [4, 5, 7],
          [4, 5, 7],
          [4, 6, 7],
          [4, 6],
          [5, 7],
          [4, 5, 7],
        ]
      },
      {
        name: 'Shape 4 (A Shape)',
        startFretOffset: 7,
        frets: [
          [7, 9],
          [7, 9],
          [7, 9],
          [6, 7, 9],
          [7, 9, 10],
          [7, 9],
        ]
      },
      {
        name: 'Shape 5 (G Shape)',
        startFretOffset: 9,
        frets: [
          [9, 11, 12],
          [9, 10, 12],
          [9, 11],
          [9, 11],
          [10, 12],
          [9, 11, 12],
        ]
      },
    ]
  },

  // ─── BLUES ────────────────────────────────────────────────
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    intervalNames: ['R', 'b3', '4', 'b5', '5', 'b7'],
    description: 'Minor pentatonic + the "blue note" (b5). That extra chromatic note creates the signature blues tension. Essential for blues, rock, and funk.',
    shapes: [
      {
        name: 'Shape 1 (E Shape)',
        startFretOffset: 0,
        frets: [
          [0, 3],
          [0, 1, 2],
          [0, 2],
          [0, 1, 2],
          [0, 3],
          [0, 3],
        ]
      },
      {
        name: 'Shape 2 (D Shape)',
        startFretOffset: 3,
        frets: [
          [3, 5, 6],
          [2, 5],
          [2, 4, 5],
          [2, 5],
          [3, 5],
          [3, 5, 6],
        ]
      },
      {
        name: 'Shape 3 (C Shape)',
        startFretOffset: 5,
        frets: [
          [5, 6, 7],
          [5, 7],
          [5, 7],
          [5, 6, 7],
          [5, 8],
          [5, 6, 8],
        ]
      },
      {
        name: 'Shape 4 (A Shape)',
        startFretOffset: 7,
        frets: [
          [7, 10],
          [7, 8, 10],
          [7, 9],
          [7, 8, 9],
          [8, 10],
          [8, 10],
        ]
      },
      {
        name: 'Shape 5 (G Shape)',
        startFretOffset: 10,
        frets: [
          [10, 12],
          [10, 12],
          [9, 11, 12],
          [9, 12],
          [10, 11, 12],
          [10, 12],
        ]
      },
    ]
  },

  // ─── HARMONIC MINOR ───────────────────────────────────────
  harmonic_minor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    intervalNames: ['R', '2', 'b3', '4', '5', 'b6', '7'],
    description: 'Natural minor with a raised 7th — creates that exotic, Middle Eastern, neoclassical sound. Think Yngwie Malmsteen, Ritchie Blackmore. That augmented 2nd interval (b6 to 7) is the signature.',
    shapes: [
      {
        name: 'Shape 1',
        startFretOffset: 0,
        frets: [
          [0, 1, 4],
          [0, 2, 3],
          [0, 1],
          [0, 1],
          [0, 1, 4],
          [0, 1, 4],
        ]
      },
      {
        name: 'Shape 2',
        startFretOffset: 3,
        frets: [
          [3, 4],
          [3, 5],
          [3, 5],
          [3, 4, 5],
          [3, 4],
          [3, 4],
        ]
      },
      {
        name: 'Shape 3',
        startFretOffset: 4,
        frets: [
          [4, 5, 7],
          [5, 7, 8],
          [5, 7],
          [5, 7],
          [4, 5, 8],
          [4, 5, 7],
        ]
      },
      {
        name: 'Shape 4',
        startFretOffset: 7,
        frets: [
          [7, 8, 10],
          [7, 8, 10],
          [7, 9, 10],
          [7, 9, 11],
          [8, 10, 11],
          [7, 8, 10],
        ]
      },
      {
        name: 'Shape 5',
        startFretOffset: 10,
        frets: [
          [10, 12, 13],
          [10, 12, 13],
          [10, 12],
          [11, 12],
          [11, 13],
          [10, 12, 13],
        ]
      },
    ]
  },

  // ─── MELODIC MINOR ────────────────────────────────────────
  melodic_minor: {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    intervalNames: ['R', '2', 'b3', '4', '5', '6', '7'],
    description: 'Natural minor with raised 6th AND 7th. A jazz staple — sounds minor but with a brighter color. Used extensively in jazz and fusion. Think Pat Metheny, John Scofield.',
    shapes: [
      {
        name: 'Shape 1',
        startFretOffset: 0,
        frets: [
          [0, 2, 4],
          [0, 2, 3],
          [0, 2],
          [0, 1, 2],
          [0, 1, 4],
          [0, 2, 4],
        ]
      },
      {
        name: 'Shape 2',
        startFretOffset: 2,
        frets: [
          [2, 3, 4],
          [3, 5],
          [2, 4, 5],
          [2, 4],
          [4, 5],
          [2, 4],
        ]
      },
      {
        name: 'Shape 3',
        startFretOffset: 4,
        frets: [
          [4, 5, 7],
          [5, 7],
          [5, 7],
          [4, 6, 7],
          [5, 7, 8],
          [4, 5, 7],
        ]
      },
      {
        name: 'Shape 4',
        startFretOffset: 7,
        frets: [
          [7, 9],
          [7, 8, 10],
          [7, 9, 10],
          [7, 9, 11],
          [8, 10],
          [7, 9],
        ]
      },
      {
        name: 'Shape 5',
        startFretOffset: 9,
        frets: [
          [9, 11, 12],
          [10, 12, 13],
          [10, 12],
          [11, 12],
          [10, 12, 13],
          [9, 11, 12],
        ]
      },
    ]
  },
};

// Export
if (typeof window !== 'undefined') {
  window.ScalesData = { SCALES };
}
