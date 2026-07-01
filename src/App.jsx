import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import useAppStore from './stores/useAppStore'
import Sidebar from './components/Layout/Sidebar'
import TopBar from './components/Layout/TopBar'

// Pages
import Home from './pages/Home/Home'
import FretboardMap from './pages/FretboardMap/FretboardMap'
import ScaleExplorer from './pages/ScaleExplorer/ScaleExplorer'
import ChordLibrary from './pages/ChordLibrary/ChordLibrary'
import IntervalTrainer from './pages/IntervalTrainer/IntervalTrainer'
import CircleOfFifths from './pages/CircleOfFifths/CircleOfFifths'
import CAGEDSystem from './pages/CAGEDSystem/CAGEDSystem'

export default function App() {
  const loadSettings = useAppStore(state => state.loadSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <HashRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fretboard" element={<FretboardMap />} />
            <Route path="/scales" element={<ScaleExplorer />} />
            <Route path="/chords" element={<ChordLibrary />} />
            <Route path="/intervals" element={<IntervalTrainer />} />
            <Route path="/circle-of-fifths" element={<CircleOfFifths />} />
            <Route path="/caged" element={<CAGEDSystem />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}
