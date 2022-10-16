// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { electron } = require('process')
const fetch = require('electron-fetch').default

const Store = require('electron-store')
const store = new Store()

//python apin för services
const rahtiUrl = 'https://p2-svahnkon.rahtiapp.fi'

//projekt1 på azure 
const azureUrl = 'https://wom-konrad-p1.azurewebsites.net'

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {


  createWindow()

  // Check original template for MacOS stuff!
})

// Example functions for communication between main and renderer (backend/frontend)
ipcMain.handle('get-stuff-from-main', () => 'Stuff from main!')
ipcMain.handle('send-stuff-to-main', async (event, data) => console.log(data))
ipcMain.handle('clicked', async () => {
  console.log('test')
})


ipcMain.handle('get-service', async () => {/*
  try {
    const res = await fetch(rahtiUrl + '',{timeout: 5000})
    const service = await res.json
    return service
  } catch (error) {
    console.log(error.message)
    return false
  }//*/
})

ipcMain.handle('login', async (event, data) => {
  try {
    console.log(3)
    const res = await fetch(azureUrl + '/users/login',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
      timeout: 5000
    })
    const user = await res.json()
    console.log(user)
    if (res.status > 200) {
      return false
    }
    return true
  } catch (error) {
    console.log(error.message)
    return false
  }
})

app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})


