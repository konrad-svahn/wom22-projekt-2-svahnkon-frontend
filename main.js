// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { electron } = require('process')
const fetch = require('electron-fetch').default

const Store = require('electron-store')
const ElectronStore = require('electron-store')
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

ipcMain.handle('logout', () => {
  store.set('jwt', null)
})

ipcMain.handle('edit', async (event, data) => {
  try {
  if (data == null) {return false}
  d = new Date(data.time) 
  const res = await fetch(rahtiUrl + '/orders/' + data.order,{
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "service": store.get('service'),
      "cottage": store.get('cotage'),
      "duration": d.getTime()
    }),
    timeout: 5000
  })

  console.log(res)
  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('create', async (event, data) => {
  try {
  if (data == null) {return false}
  d = new Date(data) 
  const res = await fetch(rahtiUrl + '/orders',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "service": store.get('service'),
      "cottage": store.get('cotage'),
      "duration": d.getMilliseconds()
    }),
    timeout: 5000
  })

  return res
  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('delete', async (event, data) => {
  try {
    
    const res = await fetch(rahtiUrl + '/orders/' + data,{
      method: 'DELETE',
      timeout: 5000
    })
    
    return res
  } catch (error) {
    console.log(error.message)
    return false
  }
})


ipcMain.handle('get-order', async (event, data) => {
  try {
    store.set('service', data)
    const res = await fetch(rahtiUrl + '/orders', {timeout: 5000})
      
    if (res.status > 201) {
        console.log(res.status + ' ' + res.statusText)
        console.log(res)
        return false
      }
  
      const order = await res.json()
      console.log(data)
      //console.log(order)
      for (let i = 0; i < order.length; i++) {
        //console.log(order[i].service)
        if (order[i].service != data || order[i].cottage != store.get('cotage')) {
          order.splice(i, 1 )
          i = i-1
        }
      }

      return order

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('get-service', async (event, data) => {
  try {
    store.set('cotage', data)
    const res = await fetch(rahtiUrl + '/services', {timeout: 5000})
      
    if (res.status > 201) {
        console.log(res.status + ' ' + res.statusText)
        console.log(res)
        return false
      }

      const service = await res.json()
      for (let i = 0; i < service.length; i++) {
        if (service[i].cottage != data) {
          service.splice(i, 1 )
          i = i-1
        }
      }

      return service

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('get-cabins', async () => {
  try {
    const res = await fetch(rahtiUrl + '/cabins', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt')},
      timeout: 5000
    })

    if (res.status > 201) {
      console.log(res.status + ' ' + res.statusText)
      console.log(res)
      return false
    }

    const service = await res.json()

    if (service.msg == 'auth failed') {
      return false
    }

    return service

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('login', async (event, data) => {
  try {
    const res = await fetch(azureUrl + '/users/login',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
      timeout: 5000
    })
    const user = await res.json()
    if (res.status > 201) {
      return user
    }
    console.log(user.token)
    store.set('jwt', user.token)
    return false
  } catch (error) {
    console.log(error.message)
    return { 'msg': "Login failed."}
  }
})

app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})


