const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'GuitarTheory',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'default',
    backgroundColor: '#0F0B1A',
    show: false,
  })

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC handlers for settings persistence
let store = null

async function getStore() {
  if (!store) {
    // electron-store is ESM, use dynamic import
    try {
      const Store = (await import('electron-store')).default
      store = new Store({
        defaults: {
          rootNote: 'A',
          tuning: 'standard',
          fretCount: 22,
          displayMode: 'notes',
          accidentals: 'sharps',
          theme: 'dark',
          sidebarCollapsed: false,
          woodType: 'maple',
          userName: 'Guitarist',
          practiceStats: {
            dayStreak: 0,
            lastPracticeDate: null,
            totalSessions: 0,
            scalesMastered: 0,
            chordsLearned: 0,
          },
        },
      })
    } catch (e) {
      // Fallback: use a simple in-memory store if electron-store isn't available
      console.warn('electron-store not available, using in-memory fallback')
      const data = {
        rootNote: 'A',
        tuning: 'standard',
        fretCount: 22,
        displayMode: 'notes',
        accidentals: 'sharps',
        theme: 'dark',
        sidebarCollapsed: false,
        woodType: 'maple',
        userName: 'Guitarist',
        practiceStats: {
          dayStreak: 0,
          lastPracticeDate: null,
          totalSessions: 0,
          scalesMastered: 0,
          chordsLearned: 0,
        },
      }
      store = {
        get: (key) => data[key],
        set: (key, value) => { data[key] = value },
        store: data,
      }
    }
  }
  return store
}

ipcMain.handle('store-get', async (_, key) => {
  const s = await getStore()
  return s.get(key)
})

ipcMain.handle('store-set', async (_, key, value) => {
  const s = await getStore()
  s.set(key, value)
})

ipcMain.handle('store-get-all', async () => {
  const s = await getStore()
  return s.store
})
