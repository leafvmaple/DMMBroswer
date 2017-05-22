{app, BrowserWindow, ipcMain, Tray, nativeImage} = require 'electron'

# Environment
global.POI_VERSION = app.getVersion()
global.mainWindow = mainWindow = null

app.on 'window-all-closed', ->
  app.quit()

app.on 'ready', ->
  {screen} = require 'electron'
  {workArea} = screen.getPrimaryDisplay()
  global.mainWindow = mainWindow = new BrowserWindow
    x: 0
    y: 0
    width: 800
    height: 600
    title: 'flower'
  mainWindow.loadURL "file://#{__dirname}/index.html"
  # Never wants navigate
  mainWindow.webContents.on 'will-navigate', (e) ->
    e.preventDefault()
  mainWindow.on 'closed', ->
    # Close all sub window
    mainWindow = null
