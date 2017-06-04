import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { middleware as promiseActionMiddleware } from './middlewares/promise'
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
