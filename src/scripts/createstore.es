import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { middleware as promiseActionMiddleware } from './middlewares/promise'
import { remote } from 'electron'
import { reducerFactory } from './redux'

const cachePosition = '_storeCache'
const storeCache = (function() {
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

window.dispatch = store.dispatch

const solveConfSet = (path, value) => {
  const details = {
    path: path,
    value: JSON.parse(JSON.stringify(value)),
  }
  store.dispatch(onConfigChange(details))
}
const config = remote.require('./src/lib/config')
config.addListener('config.set', solveConfSet)
window.addEventListener('unload', (e) => {
  config.removeListener('config.set', solveConfSet)
})
