import { useState, useMemo } from 'react'
import useAppStore from '../../stores/useAppStore'
import Fretboard from '../../components/Fretboard/Fretboard'
import ChordDiagram from '../../components/ChordDiagram/ChordDiagram'
import { CHORD_TYPES, CHORD_CATEGORIES, getVoicingsForChord } from '../../data/chords'
import { getChordNotes } from '../../utils/musicTheory'
import './ChordLibrary.css'

export default function ChordLibrary() {
  const { rootNote, accidentals } = useAppStore()
  const useFlats = accidentals === 'flats'

  const [selectedType, setSelectedType] = useState('major')
  const [selectedVoicingIdx, setSelectedVoicingIdx] = useState(0)
  const [filterCategory, setFilterCategory] = useState('all')

  const chordType = CHORD_TYPES[selectedType]

  // Get chord notes
  const chordNoteData = useMemo(
    () => getChordNotes(rootNote, selectedType, useFlats),
    [rootNote, selectedType, useFlats]
  )
  const chordNotes = chordNoteData.map(n => n.note)

  // Get voicings
  const voicings = useMemo(
    () => getVoicingsForChord(rootNote, selectedType),
    [rootNote, selectedType]
  )

  // Reset voicing selection when chord type changes
  const selectedVoicing = voicings[selectedVoicingIdx] || voicings[0]

  // Filter chord types by category
  const filteredTypes = useMemo(() => {
    return Object.entries(CHORD_TYPES).filter(([_, type]) => {
      if (filterCategory === 'all') return true
      return type.category === filterCategory
    })
  }, [filterCategory])

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1>🎹 Chord Library</h1>
        <p>
          Every chord type with multiple voicings. Click a voicing to see it on the fretboard and hear it.
        </p>
      </div>

      {/* Category filter */}
      <div className="control-bar">
        <div className="toggle-group">
          <button
            className={filterCategory === 'all' ? 'active' : ''}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          {Object.entries(CHORD_CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              className={filterCategory === key ? 'active' : ''}
              onClick={() => setFilterCategory(key)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chord type selector */}
      <div className="chord-type-pills section">
        {filteredTypes.map(([key, type]) => (
          <button
            key={key}
            className={`btn btn-sm ${selectedType === key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setSelectedType(key)
              setSelectedVoicingIdx(0)
            }}
          >
            {rootNote}{type.symbol}
          </button>
        ))}
      </div>

      {/* Fretboard showing chord notes */}
      <Fretboard highlightNotes={chordNotes} />

      {/* Chord formula */}
      <div className="scale-formula">
        {chordNoteData.map((n, i) => (
          <span key={i} className="note-pill">
            {i > 0 && <span className="arrow">→</span>}
            <span className="note-name">{n.note}</span>
            <span className="note-degree">
              {['R', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♯5', '6', '♭7', '7'][n.interval]}
            </span>
          </span>
        ))}
      </div>

      {/* Chord info */}
      {chordType && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '4px' }}>
            {rootNote}{chordType.symbol} — {chordType.name}
          </h3>
          <p>{chordType.description}</p>
        </div>
      )}

      {/* Voicings */}
      {voicings.length > 0 && (
        <div className="section">
          <h2 className="section-title">Voicings</h2>
          <div className="voicings-grid">
            {voicings.map((voicing, idx) => (
              <div
                key={idx}
                className={`voicing-card ${selectedVoicingIdx === idx ? 'active' : ''}`}
                onClick={() => setSelectedVoicingIdx(idx)}
              >
                <div className="chord-name">{rootNote}{chordType?.symbol}</div>
                <div className="shape-name">{voicing.name}</div>
                <ChordDiagram
                  frets={voicing.frets}
                  barreAt={voicing.barreAt}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
