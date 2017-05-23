import { remote } from 'electron'

const {$, config} = window

remote.getCurrentWebContents().on('dom-ready', () => {
  if (config.get('flower.content.muted', false)) {
    $('fk-game webview').setAudioMuted(true)
  }
  if ($('fk-game').style.display !== 'none')  {
    $('fk-game webview').loadURL(config.get('flower.homepage', 'http://www.dmm.com/netgame/social/application/-/detail/=/app_id=854854/'))
  }
  $('fk-game webview').addEventListener('dom-ready', (e) => {
    debugger;
    if (config.get('flower.enableDMMcookie', false)) {
      $('fk-game webview').executeJavaScript(`
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
      $('fk-game webview').executeJavaScript('DMM.netgame.reloadDialog=function(){}')
    }
  })
  $('fk-game webview').addEventListener('new-window', (e) => {
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
