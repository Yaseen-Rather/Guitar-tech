import useAppStore from '../../stores/useAppStore'
import { SHARP_NOTES } from '../../data/notes'
import { TUNINGS } from '../../data/tunings'
import './TopBar.css'

export default function TopBar() {
  const {
    rootNote, setRootNote,
    tuning, setTuning,
    displayMode, setDisplayMode,
    accidentals, setAccidentals,
    theme, toggleTheme,
    woodType, setWoodType,
  } = useAppStore()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="control-group">
          <span className="control-label">Root</span>
          <select
            className="dropdown root-dropdown"
            value={rootNote}
            onChange={(e) => setRootNote(e.target.value)}
          >
            {SHARP_NOTES.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <span className="control-label">Tuning</span>
          <select
            className="dropdown"
            value={tuning}
            onChange={(e) => setTuning(e.target.value)}
          >
            {Object.entries(TUNINGS).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name} ({t.label})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <span className="control-label">Wood</span>
          <select
            className="dropdown"
            value={woodType}
            onChange={(e) => setWoodType(e.target.value)}
          >
            <option value="maple">Maple</option>
            <option value="rosewood">Rosewood</option>
            <option value="ebony">Ebony</option>
          </select>
        </div>
      </div>

      <div className="topbar-right">
        <div className="toggle-group">
          <button
            className={displayMode === 'notes' ? 'active' : ''}
            onClick={() => setDisplayMode('notes')}
          >
            Notes
          </button>
          <button
            className={displayMode === 'intervals' ? 'active' : ''}
            onClick={() => setDisplayMode('intervals')}
          >
            Intervals
          </button>
        </div>

        <button
          className="btn-icon"
          onClick={() => setAccidentals(accidentals === 'sharps' ? 'flats' : 'sharps')}
          title={`Switch to ${accidentals === 'sharps' ? 'flats' : 'sharps'}`}
        >
          {accidentals === 'sharps' ? '♯' : '♭'}
        </button>

        <button
          className="btn-icon theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
