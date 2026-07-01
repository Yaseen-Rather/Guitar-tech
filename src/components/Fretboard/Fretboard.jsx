import { useMemo } from 'react'
import useAppStore from '../../stores/useAppStore'
import { generateFretboardNotes, getFretMarkers, getStringLabels } from '../../utils/fretboard'
import { NOTE_INDEX } from '../../data/notes'
import { getIntervalShortName } from '../../data/intervals'
import { playNote } from '../../utils/audio'
import './Fretboard.css'

/**
 * Interactive Fretboard Component
 *
 * @param {Object} props
 * @param {Array<string>} props.highlightNotes - Notes to highlight (e.g., ['A', 'C', 'E'])
 * @param {string} props.rootNote - Root note (overrides global if provided)
 * @param {string} props.className - Additional CSS class
 * @param {boolean} props.compact - Compact mode (smaller size)
 * @param {Function} props.getNoteColor - Custom function to determine note color: (noteData, isRoot) => color class name
 */
export default function Fretboard({
  highlightNotes = null,
  rootNote: propRootNote,
  className = '',
  compact = false,
  getNoteColor = null,
}) {
  const {
    rootNote: storeRootNote,
    tuning,
    fretCount,
    displayMode,
    accidentals,
    woodType,
  } = useAppStore()

  const rootNote = propRootNote || storeRootNote
  const useFlats = accidentals === 'flats'

  // Generate the fretboard grid
  const fretboardGrid = useMemo(
    () => generateFretboardNotes(tuning, fretCount, useFlats),
    [tuning, fretCount, useFlats]
  )

  const markers = useMemo(() => getFretMarkers(fretCount), [fretCount])
  const stringLabels = useMemo(() => getStringLabels(tuning), [tuning])

  // Build set of highlight note indices for fast lookup
  const highlightIndices = useMemo(() => {
    if (!highlightNotes) return null
    return new Set(
      highlightNotes.map(n => NOTE_INDEX[n]).filter(i => i !== undefined)
    )
  }, [highlightNotes])

  const rootIndex = NOTE_INDEX[rootNote]

  function handleNoteClick(noteData) {
    playNote(noteData.frequency, 1.5, 0.5, 0.5)
  }

  function isHighlighted(noteData) {
    if (!highlightIndices) return true // Show all notes if no filter
    const noteIdx = NOTE_INDEX[noteData.note]
    return highlightIndices.has(noteIdx)
  }

  function isRoot(noteData) {
    return NOTE_INDEX[noteData.note] === rootIndex
  }

  function getNoteLabel(noteData) {
    if (displayMode === 'intervals') {
      const semitones = ((NOTE_INDEX[noteData.note] - rootIndex) + 12) % 12
      return getIntervalShortName(semitones)
    }
    return noteData.note
  }

  function getNoteColorClass(noteData) {
    if (getNoteColor) {
      return getNoteColor(noteData, isRoot(noteData))
    }
    if (isRoot(noteData)) return 'note-root'
    return 'note-scale'
  }

  return (
    <div className={`fretboard-container ${compact ? 'compact' : ''} ${className}`}>
      <div className={`fretboard wood-${woodType}`}>
        {/* Nut */}
        <div className="fretboard-nut" />

        {/* String labels */}
        <div className="string-labels">
          {/* Reversed so low E (index 0) is at top visually */}
          {[...stringLabels].reverse().map((label, i) => (
            <div key={i} className="string-label font-mono">{label}</div>
          ))}
        </div>

        {/* Fretboard grid */}
        <div className="fretboard-grid">
          {/* Fret columns */}
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <div key={fret} className={`fret-column ${fret === 0 ? 'open-strings' : ''}`}>
              {/* Fret wire */}
              {fret > 0 && <div className="fret-wire" />}

              {/* Notes on this fret (reversed: low E at top) */}
              {[...fretboardGrid].reverse().map((stringNotes, displayIdx) => {
                const noteData = stringNotes[fret]
                const highlighted = isHighlighted(noteData)
                const root = isRoot(noteData)

                return (
                  <div key={displayIdx} className="note-cell">
                    {/* String line */}
                    <div
                      className="string-line"
                      style={{
                        height: `${1 + (5 - displayIdx) * 0.35}px`,
                        opacity: highlighted ? 0.5 : 0.25,
                      }}
                    />

                    {/* Note dot */}
                    {highlighted && (
                      <button
                        className={`note-dot ${getNoteColorClass(noteData)} ${root ? 'is-root' : ''}`}
                        onClick={() => handleNoteClick(noteData)}
                        title={`${noteData.note}${noteData.octave} (${getIntervalShortName(((NOTE_INDEX[noteData.note] - rootIndex) + 12) % 12)})`}
                      >
                        <span className="note-label font-mono">
                          {getNoteLabel(noteData)}
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}

              {/* Fret marker */}
              {markers[fret] && (
                <div className={`fret-marker ${markers[fret]}`}>
                  <span className="marker-dot" />
                  {markers[fret] === 'double' && <span className="marker-dot" />}
                </div>
              )}
            </div>
          ))}

          {/* Fret numbers */}
          <div className="fret-numbers">
            {Array.from({ length: fretCount + 1 }, (_, fret) => (
              <div key={fret} className={`fret-number ${fret === 0 ? 'open-strings' : ''}`}>
                {fret > 0 && (markers[fret] || fret === 1) ? fret : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
