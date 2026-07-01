const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getStoreValue: (key) => ipcRenderer.invoke('store-get', key),
  setStoreValue: (key, value) => ipcRenderer.invoke('store-set', key, value),
  getAllStoreValues: () => ipcRenderer.invoke('store-get-all'),
})
