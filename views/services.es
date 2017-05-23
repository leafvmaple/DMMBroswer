import { remote } from 'electron'

const {$, config} = window

window.addEventListener('game.request', (e) => {
  const {method} = e.detail
  const resPath = e.detail.path
})

window.addEventListener('game.response', (e) => {
  const {method, body, postBody, time} = e.detail
  const resPath = e.detail.path
  if (config.get('poi.showNetworkLog', true)) {
    log(`${__('Hit')} ${method} ${resPath}`, {dontReserve: true})
  }
})

remote.getCurrentWebContents().on('dom-ready', () => {
  if (config.get('flower.content.muted', false)) {
    $('dmm-game webview').setAudioMuted(true)
  }
  if ($('dmm-game').style.display !== 'none')  {
    $('dmm-game webview').loadURL(config.get('flower.homepage', 'http://www.dmm.co.jp/netgame/social/-/gadgets/=/app_id=329993/'))
  }
  $('dmm-game webview').addEventListener('dom-ready', (e) => {
    if (config.get('flower.enableDMMcookie', false)) {
      $('dmm-game webview').executeJavaScript(`
        document.cookie = "cklg=welcome;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/";
        document.cookie = "cklg=welcome;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame/";
        document.cookie = "cklg=welcome;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame_s/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=osapi.dmm.com;path=/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=203.104.209.7;path=/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.com;path=/netgame/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=log-netgame.dmm.com;path=/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame/";
        document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame_s/";
      `)
    }
    if (config.get('flower.disableNetworkAlert', false)) {
      $('dmm-game webview').executeJavaScript('DMM.netgame.reloadDialog=function(){}')
    }
  })
  $('dmm-game webview').addEventListener('new-window', (e) => {
    const exWindow = WindowManager.createWindow({
      realClose: true,
      navigatable: true,
      nodeIntegration: false,
    })
    exWindow.loadURL(e.url)
    exWindow.show()
    e.preventDefault()
  })
})
