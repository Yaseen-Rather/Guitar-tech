import { useState, useMemo } from 'react'
import useAppStore from '../../stores/useAppStore'
import Fretboard from '../../components/Fretboard/Fretboard'
import { SCALES, getScaleDegreeLabels } from '../../data/scales'
import { getScaleNotes } from '../../utils/musicTheory'
import { getPentatonicShapeRanges, findNotePositions } from '../../utils/fretboard'
import './ScaleExplorer.css'

export default function ScaleExplorer() {
  const { rootNote, accidentals, tuning, fretCount } = useAppStore()
  const useFlats = accidentals === 'flats'

  const [selectedScale, setSelectedScale] = useState('pentatonic_minor')
  const [selectedShape, setSelectedShape] = useState('all') // 'all' | 'shape1' - 'shape5'

  const scale = SCALES[selectedScale]

  // Get scale notes
  const scaleNoteData = useMemo(
    () => getScaleNotes(rootNote, selectedScale, useFlats),
    [rootNote, selectedScale, useFlats]
  )
  const scaleNotes = scaleNoteData.map(n => n.note)

  // Get shape ranges for pentatonic scales
  const shapeRanges = useMemo(
    () => getPentatonicShapeRanges(rootNote, tuning),
    [rootNote, tuning]
  )

  // Filter notes by shape if selected
  const highlightNotes = useMemo(() => {
    if (selectedShape === 'all') return scaleNotes

    const range = shapeRanges[selectedShape]
    if (!range) return scaleNotes

    // Get all positions within the shape's fret range
    const allPositions = findNotePositions(scaleNotes, tuning, fretCount, useFlats)
    const shapePositionNotes = allPositions
      .filter(pos => pos.fret >= range.start && pos.fret <= range.end)
      .map(pos => pos.note)

    // Return unique note names in this shape
    return [...new Set(shapePositionNotes)]
  }, [scaleNotes, selectedShape, shapeRanges, tuning, fretCount, useFlats])

  const degreeLabels = getScaleDegreeLabels(selectedScale)

  // Whether shape buttons make sense (only for pentatonic/blues)
  const showShapes = ['pentatonic_minor', 'pentatonic_major', 'blues_minor', 'blues_major'].includes(selectedScale)

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1>🎵 Scales Library</h1>
        <p>{scale?.description}</p>
      </div>

      {/* Controls */}
      <div className="control-bar">
        <div className="control-group">
          <span className="control-label">Scale Type</span>
          <select
            className="dropdown"
            value={selectedScale}
            onChange={(e) => {
              setSelectedScale(e.target.value)
              setSelectedShape('all')
            }}
          >
            {Object.entries(SCALES).map(([key, s]) => (
              <option key={key} value={key}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fretboard */}
      <Fretboard highlightNotes={highlightNotes} />

      {/* Scale Formula */}
      <div className="scale-formula">
        {scaleNoteData.map((n, i) => (
          <span key={i} className="note-pill">
            {i > 0 && <span className="arrow">→</span>}
            <span className="note-name">{n.note}</span>
            <span className="note-degree">{n.degree}</span>
          </span>
        ))}
      </div>

      {/* Shape Buttons */}
      {showShapes && (
        <div className="shape-buttons section">
          <button
            className={`btn ${selectedShape === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedShape('all')}
          >
            All Positions
          </button>
          {Object.entries(shapeRanges).map(([key, shape]) => (
            <button
              key={key}
              className={`btn ${selectedShape === key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedShape(key)}
            >
              {shape.name}
            </button>
          ))}
        </div>
      )}

      {/* Scale Info */}
      {scale && (
        <div className="card section">
          <h3 style={{ marginBottom: '8px' }}>
            {rootNote} {scale.name}
            {selectedShape !== 'all' && shapeRanges[selectedShape] && (
              <span className="badge badge-primary" style={{ marginLeft: '12px' }}>
                {shapeRanges[selectedShape].name}
              </span>
            )}
          </h3>
          <p style={{ marginBottom: '8px' }}>{scale.description}</p>
          {scale.famous && (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              <strong>Famous users:</strong> {scale.famous}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
