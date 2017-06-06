import path from 'path-extra'
import glob from 'glob'

const {WEBROOT, config} = window

window.language = window.config.get('dmm.language', navigator.language)
window.i18n = {}
const i18nFiles = glob.sync(path.join(WEBROOT, 'i18n', '*'))
for (const i18nFile of i18nFiles) {
  const namespace = path.basename(i18nFile)
  window.i18n[namespace] = new (require('i18n-2'))({
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'en-US',
    directory: i18nFile,
    updateFiles: false,
    indent: "\t",
    extension: '.json',
    devMode: false,
  })
  window.i18n[namespace].setLocale(window.language)
}
window.i18n.resources = {
  __: (str) => (str),
  translate: (locale, str) => (str),
  setLocale: (str) => (str),
}
