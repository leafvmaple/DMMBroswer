const { remote, webFrame } = require('electron')

window.onclick = (e) => {
  remote.getCurrentWindow().webContents.executeJavaScript(`
    $('webview').blur()
    $('webview').focus()
  `)
}

const alignCSS = document.createElement('style')

window.align = async function () {
  let zoom = await new Promise((resolve, reject) => {
    remote.getCurrentWindow().webContents.executeJavaScript("$('webview').getBoundingClientRect().width", (result) => {
      resolve(result)
    })
  })
  zoom = zoom / 960
  webFrame.setLayoutZoomLevelLimits(-999999, 999999)
  webFrame.setZoomFactor(zoom)
  const zl = webFrame.getZoomLevel()
  webFrame.setLayoutZoomLevelLimits(zl, zl)
  window.scrollTo(0, 0)
  
  alignCSS.innerHTML =
  `html {
    overflow: hidden;
  }
  #w, #main-ntg {
    position: absolute !important;
    top: 0;
    left: 0;
    z-index: 100;
    margin-left: 0 !important;
    margin-top: 0 !important;
  }
  #game_frame {
    width: 960px !important;
    position: absolute;
    top: 0px;
    left: 0;
  }
  .naviapp {
    z-index: -1;
  }
  #ntg-recommend {
    display: none !important;
  }
  `
}

let intervalHandle = null
window.click = (e) => {
  const mouseclick = () => {
    const zoom = webFrame.getZoomFactor()
    const x = parseInt(855 * zoom)
    const y = parseInt(545 * zoom)
    remote.getCurrentWebContents().sendInputEvent({
      type: 'mouseDown',
      x: x,
      y: y,
      button: 'left',
      clickCount: 1,
    })
    remote.getCurrentWebContents().sendInputEvent({
      type: 'mouseUp',
      x: x,
      y: y,
      button: 'left',
      clickCount: 1
    })
  }
  intervalHandle = window.setInterval(mouseclick, 100)
}
window.unclick = () => {
  if (intervalHandle) {
    window.clearInterval(intervalHandle)
  }
}

const handleDOMContentLoaded = () => {
  window.align()
  document.querySelector('body').appendChild(alignCSS)
  document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded)
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded)

