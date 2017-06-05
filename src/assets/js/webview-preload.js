const { remote, webFrame } = require('electron')

window.onclick = (e) => {
  remote.getCurrentWindow().webContents.executeJavaScript(`
    $('webview').blur()
    $('webview').focus()
  `)
}

window.align = async function () {
  let zoom = await new Promise((resolve, reject) => {
    remote.getCurrentWindow().webContents.executeJavaScript("$('webview').getBoundingClientRect().width", (result) => {
      resolve(result)
    })
  })
  zoom = zoom / 800
  webFrame.setLayoutZoomLevelLimits(-999999, 999999)
  webFrame.setZoomFactor(zoom)
  const zl = webFrame.getZoomLevel()
  webFrame.setLayoutZoomLevelLimits(zl, zl)
  window.scrollTo(0, 0)
}
