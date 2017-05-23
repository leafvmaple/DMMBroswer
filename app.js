const {app, BrowserWindow, ipcMain, Tray, nativeImage, shell} = require('electron')
const path = require('path-extra')

global.POI_VERSION = app.getVersion()
global.ROOT = __dirname
global.EXECROOT = path.join(process.execPath, '..')
global.APPDATA_PATH = path.join(app.getPath('appData'), 'flower')
global.EXROOT = global.APPDATA_PATH
global.DEFAULT_CACHE_PATH = path.join(global.EXROOT, 'MyCache')
global.MODULE_PATH = path.join(global.ROOT, "node_modules")

const config = require('./lib/config')

if (config.get('poi.disableHA', false)) {
  app.disableHardwareAcceleration()
}

global.mainWindow = mainWindow = null

app.on ('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  debugger;
  const {screen} = require('electron')
  const {workArea} = screen.getPrimaryDisplay()
  global.mainWindow = mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    title: 'flower',
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.webContents.on('will-navigate', (e) => {
    e.preventDefault()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})
