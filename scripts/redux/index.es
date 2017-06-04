import { remote } from 'electron'
import { combineReducers } from 'redux'

import { reducer as info } from 'views/info'
import { reducer as battle } from 'views/battle'

export function reducerFactory(extensionConfig) {
  return combineReducers({
    info,
    battle,
  })
}

export function onGameResponse({method, path, body, postBody, time}) {
  return {
    type: `@@Response${path}`,
    method,
    path,
    body,
    postBody,
    time,
  }
}

export function onGameRequest({method, path, body, time}) {
  return {
    type: `@@Request${path}`,
    method,
    path,
    body,
    time,
  }
}

export function onConfigChange({path, value}) {
  return {
    type: `@@Config`,
    path,
    value,
  }
}
