import { remote } from 'electron'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { reducerFactory } from './services/redux'

const originConfig = remote.require('./lib/config')

window.$ = (param) => document.querySelector(param)
//window.ipc = remote.require('./lib/ipc')
//window.proxy = remote.require('./lib/proxy')
window.config = {}
for (const key in originConfig) {
  window.config[key] = originConfig[key]
}

/*const storeCache = (function() {
  const item = !window.isSafeMode ? localStorage.getItem(cachePosition) : '{}'
  return JSON.parse(item || '{}')
})()

export const store = createStore(
    reducerFactory(),
    storeCache,
    compose(
      applyMiddleware(
        promiseActionMiddleware,
        thunk,
      ),
    )
  )

window.dispatch = store.dispatch*/
