import { NavLink } from 'react-router-dom'
import useAppStore from '../../stores/useAppStore'
import './Sidebar.css'

const NAV_ITEMS = [
  {
    section: 'HOME',
    items: [
      { path: '/', label: 'Dashboard', icon: '🏠' },
      { path: '/fretboard', label: 'Fretboard Map', icon: '🎸' },
    ],
  },
  {
    section: 'THEORY',
    items: [
      { path: '/intervals', label: 'Intervals', icon: '🔗' },
      { path: '/scales', label: 'Scales', icon: '🎵' },
    ],
  },
  {
    section: 'CHORDS',
    items: [
      { path: '/chords', label: 'Chord Library', icon: '🎹' },
      { path: '/circle-of-fifths', label: 'Circle of Fifths', icon: '⭕' },
    ],
  },
  {
    section: 'SYSTEMS',
    items: [
      { path: '/caged', label: 'CAGED System', icon: '🔲' },
    ],
  },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🎸</span>
          {!sidebarCollapsed && (
            <span className="logo-text">
              Guitar<span className="logo-accent">Theory</span>
            </span>
          )}
        </div>
        <button
          className="btn-icon sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.section} className="nav-group">
            {!sidebarCollapsed && (
              <span className="nav-section-label">{group.section}</span>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!sidebarCollapsed && (
          <div className="app-version">GuitarTheory v1.0</div>
        )}
      </div>
    </aside>
  )
}
