import { useNavigate } from 'react-router-dom'
import useAppStore from '../../stores/useAppStore'
import Fretboard from '../../components/Fretboard/Fretboard'
import { getScaleNotes } from '../../utils/musicTheory'
import './Home.css'

const MODULES = [
  { path: '/fretboard', icon: '🎸', name: 'Fretboard Map', desc: 'See every note — visualize keys, intervals, and positions' },
  { path: '/scales', icon: '🎵', name: 'Scales Library', desc: 'All scales, all 5 shapes — pentatonic, modes, blues, and more' },
  { path: '/chords', icon: '🎹', name: 'Chord Library', desc: 'Every chord type with multiple voicings and fretboard overlay' },
  { path: '/intervals', icon: '🔗', name: 'Intervals', desc: 'The DNA of music — master the building blocks' },
  { path: '/circle-of-fifths', icon: '⭕', name: 'Circle of Fifths', desc: 'The master map of all keys and their relationships' },
  { path: '/caged', icon: '🔲', name: 'CAGED System', desc: 'Connect the 5 shapes across the entire fretboard' },
]

export default function Home() {
  const navigate = useNavigate()
  const { rootNote, accidentals, userName, practiceStats } = useAppStore()
  const useFlats = accidentals === 'flats'

  // Get major scale notes for the fretboard display
  const majorScaleNotes = getScaleNotes(rootNote, 'major', useFlats).map(n => n.note)

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-content animate-fade-in">
      {/* Fretboard at top */}
      <Fretboard highlightNotes={majorScaleNotes} compact />

      {/* Welcome Section */}
      <div className="home-welcome section">
        <div className="welcome-text">
          <h1>
            {greeting}, <span className="text-primary-color">{userName}</span> 👋
          </h1>
          <p>Let's practice something beautiful today. Master the fretboard, one note at a time.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid section">
        <div className="stat-card">
          <div className="stat-value">🔥 {practiceStats.dayStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{practiceStats.totalSessions}</div>
          <div className="stat-label">Practice Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{practiceStats.scalesMastered}</div>
          <div className="stat-label">Scales Explored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{practiceStats.chordsLearned}</div>
          <div className="stat-label">Chords Learned</div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="section">
        <h2 className="section-title">Explore Modules</h2>
        <div className="module-cards">
          {MODULES.map((mod) => (
            <div
              key={mod.path}
              className="module-card card-clickable"
              onClick={() => navigate(mod.path)}
            >
              <span className="icon">{mod.icon}</span>
              <h3>{mod.name}</h3>
              <p>{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
