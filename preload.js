/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('exposed', {

  // expose a function in main (node) to renderer
  getStuffFromMain: () => ipcRenderer.invoke('get-stuff-from-main'),

  // send data back to main
  sendStuffToMain: (data) => ipcRenderer.invoke('send-stuff-to-main', data),

  test2: () => {
    ipcRenderer.invoke('clicked')
  },

  getCabins: () => ipcRenderer.invoke('get-cabins'),

  login: (data) => ipcRenderer.invoke('login', data),
  
  logout: () => ipcRenderer.invoke('logout'),

  create: () => ipcRenderer.invoke('create'),

  getService: (data) => ipcRenderer.invoke('get-service', data),

  getOrder: (data) => ipcRenderer.invoke('get-order', data)

})