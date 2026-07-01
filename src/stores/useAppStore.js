/**
 * Global app state store using Zustand.
 * Manages root note, tuning, theme, display mode, and user preferences.
 * Persists to electron-store when available.
 */
import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // Music settings
  rootNote: 'A',
  tuning: 'standard',
  fretCount: 22,
  displayMode: 'notes', // 'notes' or 'intervals'
  accidentals: 'sharps', // 'sharps' or 'flats'

  // UI settings
  theme: 'dark',
  sidebarCollapsed: false,
  woodType: 'maple', // 'maple', 'rosewood', 'ebony'

  // User
  userName: 'Guitarist',

  // Practice stats
  practiceStats: {
    dayStreak: 0,
    lastPracticeDate: null,
    totalSessions: 0,
    scalesMastered: 0,
    chordsLearned: 0,
  },

  // Loading state
  isLoaded: false,

  // Actions
  setRootNote: (rootNote) => {
    set({ rootNote })
    persistValue('rootNote', rootNote)
  },

  setTuning: (tuning) => {
    set({ tuning })
    persistValue('tuning', tuning)
  },

  setFretCount: (fretCount) => {
    set({ fretCount })
    persistValue('fretCount', fretCount)
  },

  setDisplayMode: (displayMode) => {
    set({ displayMode })
    persistValue('displayMode', displayMode)
  },

  setAccidentals: (accidentals) => {
    set({ accidentals })
    persistValue('accidentals', accidentals)
  },

  setTheme: (theme) => {
    set({ theme })
    document.documentElement.setAttribute('data-theme', theme)
    persistValue('theme', theme)
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(newTheme)
  },

  setSidebarCollapsed: (sidebarCollapsed) => {
    set({ sidebarCollapsed })
    persistValue('sidebarCollapsed', sidebarCollapsed)
  },

  toggleSidebar: () => {
    const newState = !get().sidebarCollapsed
    get().setSidebarCollapsed(newState)
  },

  setWoodType: (woodType) => {
    set({ woodType })
    persistValue('woodType', woodType)
  },

  setUserName: (userName) => {
    set({ userName })
    persistValue('userName', userName)
  },

  updatePracticeStats: (updates) => {
    const newStats = { ...get().practiceStats, ...updates }
    set({ practiceStats: newStats })
    persistValue('practiceStats', newStats)
  },

  // Load saved settings from electron-store
  loadSettings: async () => {
    try {
      if (window.electronAPI) {
        const settings = await window.electronAPI.getAllStoreValues()
        if (settings) {
          set({
            rootNote: settings.rootNote || 'A',
            tuning: settings.tuning || 'standard',
            fretCount: settings.fretCount || 22,
            displayMode: settings.displayMode || 'notes',
            accidentals: settings.accidentals || 'sharps',
            theme: settings.theme || 'dark',
            sidebarCollapsed: settings.sidebarCollapsed || false,
            woodType: settings.woodType || 'maple',
            userName: settings.userName || 'Guitarist',
            practiceStats: settings.practiceStats || {
              dayStreak: 0,
              lastPracticeDate: null,
              totalSessions: 0,
              scalesMastered: 0,
              chordsLearned: 0,
            },
            isLoaded: true,
          })
          // Apply theme
          document.documentElement.setAttribute('data-theme', settings.theme || 'dark')
        }
      } else {
        // No electron API (running in browser), use defaults
        set({ isLoaded: true })
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    } catch (err) {
      console.warn('Failed to load settings:', err)
      set({ isLoaded: true })
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  },
}))

/**
 * Persist a single value to electron-store
 */
function persistValue(key, value) {
  try {
    if (window.electronAPI) {
      window.electronAPI.setStoreValue(key, value)
    }
  } catch (err) {
    console.warn('Failed to persist setting:', key, err)
  }
}

export default useAppStore
