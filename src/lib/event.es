const {config, $} = window

export const battleClick = (enable) => {
  try {
  	if (enable) {
  	  $('dmm-game webview').executeJavaScript('window.click()')
  	} else {
  	  $('dmm-game webview').executeJavaScript('window.unclick()')
  	}
  } catch (e) {
    console.error(e)
  }
}