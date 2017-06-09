import { remote } from 'electron'
import path from 'path-extra'

Object.clone = (obj) =>
  JSON.parse(JSON.stringify(obj))
//Object.remoteClone = (obj) =>
//  JSON.parse(window.remote.require('./src/lib/config').remoteStringify(obj))

window.ROOT = path.join(__dirname, '..')
window.WEBROOT = path.join(window.ROOT, '..')
window.$ = (param) => document.querySelector(param)
//window.ipc = remote.require('./lib/ipc')
//window.proxy = remote.require('./lib/proxy')

const originConfig = remote.require('./src/lib/config')

window.config = {}
for (const key in originConfig) {
  window.config[key] = originConfig[key]
}

require('module').globalPaths.push(window.ROOT)

require('./env/i18n')
require('./env/theme')
