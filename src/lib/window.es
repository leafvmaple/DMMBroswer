export default {
  saveConfig: () => {
    const win = global.mainWindow
    const isFullScreen = win.isFullScreen()
    if (win.isFullScreen()) {
      win.setFullScreen(false)
    }
    const isMaximized = win.isMaximized()
    if (win.isMaximized()){
      win.unmaximize()
    }
    const b = win.getBounds()
    b.isFullScreen = isFullScreen
    b.isMaximized = isMaximized
    require('./config').set('dmm.window', b)
  },
}
