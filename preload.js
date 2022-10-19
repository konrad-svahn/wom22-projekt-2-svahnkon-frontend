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

  getCabins: () => ipcRenderer.invoke('get-cabins'),

  getService: (data) => ipcRenderer.invoke('get-service', data),

  getOrder: (data) => ipcRenderer.invoke('get-order', data),

  login: (data) => ipcRenderer.invoke('login', data),
  
  logout: () => ipcRenderer.invoke('logout'),

  create: (data) => ipcRenderer.invoke('create',data),

  edit: (data) => ipcRenderer.invoke('edit',data),

  delete: (data) => ipcRenderer.invoke('delete',data)
})