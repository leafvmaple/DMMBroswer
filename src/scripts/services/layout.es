import { debounce } from 'lodash'
import { remote } from 'electron'
const {config, $} = window

const dmmControlHeight = 30
const titleBarHeight = process.platform === 'win32' ? 28 : 0
const additionalStyle = document.createElement('style')

remote.getCurrentWindow().webContents.on('dom-ready', (e) => {
  document.body.appendChild(additionalStyle)
})

const getFlexCSS = ({webviewWidth}) => {
  return `
    dmm-game {
      flex: ${webviewWidth};
    }
    dmm-app {
      flex: ${window.innerWidth - webviewWidth};
    }
  `
}

const getToastCSS = ({webviewWidth, webviewHeight}) => {
  let { innerHeight, innerWidth } = window
  innerHeight -= titleBarHeight
  if (webviewWidth === 0) {
    return `
      .toast-dmm {
        bottom: 12px;
        right: 12px;
      }
    `
  } else {
    return `
      .toast-dmm {
        bottom: ${(innerHeight - webviewHeight - 30) / 2 + 36}px;
        right: ${(innerWidth - webviewWidth) + 12}px;
      }
    `
  }
}

const setCSS = ({webviewWidth, webviewHeight, tabpaneHeight, zoomLevel}) => {
  let { innerHeight } = window
  innerHeight -= titleBarHeight
  additionalStyle.innerHTML = `
    dmm-app {
      width: 0;
      height: 0;
    }
    .dmm-game-warpper {
      height: calc(${webviewHeight}px + 30px * ${zoomLevel});
    }
    dmm-app div.dmm-app-tabpane {
      height: ${tabpaneHeight};
    }
    dmm-main {
      flex-flow: row nowrap;
    }
    div[role='tooltip'], #dmm-app-container, dmm-info {
      ${zoomLevel !== 1 && `transform: scale(${zoomLevel});`}
    }
    .dmm-control-tooltip {
      max-height: ${Math.ceil(dmmControlHeight / zoomLevel)}px;
    }
    #dmm-app-container, dmm-info {
      width: calc(100% / ${zoomLevel});
    }
    dmm-nav dmm-nav-tabs .nav .dropdown-menu {
      max-height: ${tabpaneHeight};
    }
    dmm-game #webview-wrapper {
      width: ${webviewWidth}px !important;
      height: ${webviewHeight}px !important;
    }
    ${getFlexCSS({webviewWidth: webviewWidth})}
    ${getToastCSS({webviewWidth: webviewWidth, webviewHeight: webviewHeight})}
  `
  
  if (webviewWidth > -0.00001 && webviewWidth < 0.00001) {
    $('dmm-game').style.display = 'none'
  }
  else {
    $('dmm-game').style.display = ''
  }

  // Adjust webview height & position
  $('dmm-game #webview-wrapper').style.marginLeft = '0'
  $('dmm-game').style.marginTop = `${Math.max(0, Math.floor((innerHeight - webviewHeight - dmmControlHeight * zoomLevel) / 2.0))}px`
  $('dmm-game webview').executeJavaScript('window.align()')
}

const setCSSDebounced = debounce(setCSS, 200)

const adjustSize = () => {
  const { devicePixelRatio } = window
  const zoomLevel = config.get('dmm.zoomLevel', 1)
  const panelMinSize = config.get('dmm.panelMinSize', 1)
  let webviewWidth = config.get('dmm.webview.width', -1)
  let webviewHeight = Math.min((window.innerHeight - dmmControlHeight * zoomLevel - titleBarHeight) * devicePixelRatio , Math.round(webviewWidth / 960.0 * 640.0))
  const useFixedResolution = (webviewWidth !== -1)
  let { innerHeight } = window
  innerHeight -= titleBarHeight
  
  if (!useFixedResolution) {
    webviewHeight = innerHeight - dmmControlHeight * zoomLevel
    webviewWidth = Math.round(webviewHeight / 640.0 * 960.0)
  } else {
    webviewWidth = Math.round(webviewWidth / devicePixelRatio)
    webviewHeight = Math.round(webviewHeight / devicePixelRatio)
  }
  
  window.dispatch({
    type: '@@LayoutUpdate',
    value: {
      window: {
        width: window.innerWidth,
        height: innerHeight,
      },
      webview: {
        width: webviewWidth,
        height: webviewHeight,
        useFixedResolution: useFixedResolution,
      },
    },
  })
  
  const cap = Math.ceil(375 * panelMinSize * zoomLevel)
  if (window.innerWidth - webviewWidth < cap) {
    webviewWidth = window.innerWidth - cap
    webviewHeight = Math.min(innerHeight - dmmControlHeight * zoomLevel, Math.round(webviewWidth / 960.0 * 640))
  }
  const tabpaneHeight = `${(innerHeight - webviewHeight - dmmControlHeight * zoomLevel) / zoomLevel - dmmControlHeight * zoomLevel}px`
  
  setCSSDebounced({
    webviewHeight,
    webviewWidth,
    tabpaneHeight,
    zoomLevel,
  })
}

window.addEventListener('game.start', adjustSize)
window.addEventListener('resize', adjustSize)

config.on('config.set', (path, value) => {
  switch (path) {
  case 'dmm.zoomLevel':
  case 'dmm.panelMinSize':
  case 'dmm.tabarea.double':
  case 'dmm.webview.width':
  case 'dmm.reverseLayout': {
    adjustSize()
    break
  }
  default:
    break
  }
})
