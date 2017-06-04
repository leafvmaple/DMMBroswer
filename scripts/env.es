import { remote } from 'electron'
import path from 'path-extra'

const originConfig = remote.require('./lib/config')

window.ROOT = path.join(__dirname, '..')
window.$ = (param) => document.querySelector(param)
//window.ipc = remote.require('./lib/ipc')
//window.proxy = remote.require('./lib/proxy')
window.config = {}
for (const key in originConfig) {
  window.config[key] = originConfig[key]
}

require('module').globalPaths.push(window.ROOT)
