import useAppStore from '../../stores/useAppStore'
import Fretboard from '../../components/Fretboard/Fretboard'
import { SHARP_NOTES, FLAT_NOTES } from '../../data/notes'

export default function FretboardMap() {
  const { rootNote, accidentals } = useAppStore()
  const allNotes = accidentals === 'flats' ? [...FLAT_NOTES] : [...SHARP_NOTES]

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1>🎸 Fretboard Map</h1>
        <p>
          See every note on the fretboard. Click any note to hear it.
          Use the Root selector in the top bar to highlight root notes.
          Toggle between note names and intervals.
        </p>
      </div>

      {/* Show all notes on the fretboard */}
      <Fretboard highlightNotes={allNotes} />

      {/* Note reference */}
      <div className="section">
        <h2 className="section-title">All 12 Notes</h2>
        <div className="control-bar" style={{ justifyContent: 'center', gap: '8px' }}>
          {allNotes.map(note => (
            <span
              key={note}
              className={`badge ${note === rootNote ? 'badge-primary' : ''}`}
              style={{
                fontSize: '0.85rem',
                padding: '6px 12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
              }}
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
