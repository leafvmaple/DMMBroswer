import path from 'path-extra'
import glob from 'glob'

const {WEBROOT, isMain, config} = window
window.language = window.config.get('dmm.language', navigator.language)
if (!['zh-CN', 'zh-TW', 'ja-JP', 'en-US', 'ko-KR'].includes(window.language)) {
  switch (window.language.substr(0, 2).toLowerCase()) {
  case 'zh':
    window.language = 'zh-TW'
    break
  }
}

window.i18n = {}
const i18nFiles = glob.sync(path.join(WEBROOT, 'i18n', '*'))
