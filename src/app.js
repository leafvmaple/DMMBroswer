const {app, BrowserWindow, ipcMain, Tray, nativeImage, shell} = require('electron')
const path = require('path-extra')

global.ROOT = __dirname
global.DMM_VERSION = app.getVersion()
global.EXECROOT = path.join(process.execPath, '..')
global.APPDATA_PATH = path.join(app.getPath('appData'), 'DMM')
global.WEBROOT = path.join(global.ROOT, '..')
global.EXROOT = global.APPDATA_PATH
global.DEFAULT_CACHE_PATH = path.join(global.EXROOT, 'MyCache')
global.MODULE_PATH = path.join(global.WEBROOT, "node_modules")

const config = require('./lib/config')
const proxy = require('./lib/proxy')

const iconPath = path.join(ROOT, 'assets', 'icons', 'flower.jpg')

proxy.setMaxListeners(30)

if (config.get('flower.disableHA', false)) {
  app.disableHardwareAcceleration()
}

require('./lib/flash')

global.mainWindow = mainWindow = null

app.on ('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  const {screen} = require('electron')
  const {workArea} = screen.getPrimaryDisplay()
  let {x, y, width, height} = config.get('flower.window', workArea)
  const validate = (n, min, range) => (n != null && n >= min && n < min + range)
  const withinDisplay = (d) => {
    const wa = d.workArea
    return validate(x, wa.x, wa.width) && validate(y, wa.y, wa.height)
  }
  if (!screen.getAllDisplays().some(withinDisplay)) {
    x = workArea.x
    y = workArea.y
  }
  if (width == null) {
    width = workArea.width
  }
  if (height == null) {
    height = workArea.height
  }
  global.mainWindow = mainWindow = new BrowserWindow({
    x: x,
    y: y,
    width: width,
    height: height,
    title: 'Flower',
    icon: iconPath,
    resizable: config.get('flower.content.resizeable', true),
    alwaysOnTop: config.get('flower.content.alwaysOnTop', false),
    titleBarStyle: 'hidden',
  })
  mainWindow.loadURL(`file://${WEBROOT}/index.html`)
  mainWindow.webContents.on('will-navigate', (e) => {
    e.preventDefault()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.platform === 'win32' || process.platform === 'linux') {
    global.appIcon = appIcon = new Tray(iconPath)
    appIcon.on('click', () => {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      } else {
        mainWindow.show()
      }
    })
  }
})
