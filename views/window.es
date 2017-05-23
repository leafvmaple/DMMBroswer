import { remote } from 'electron'

const originConfig = remote.require('./lib/config')

window.$ = (param) => document.querySelector(param)
//window.ipc = remote.require('./lib/ipc')
//window.proxy = remote.require('./lib/proxy')
window.config = {}
for (const key in originConfig) {
  window.config[key] = originConfig[key]
}
