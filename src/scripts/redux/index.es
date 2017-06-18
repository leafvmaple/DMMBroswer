import { remote } from 'electron'
import { combineReducers } from 'redux'

import { reducer as config } from 'views/config'
import { reducer as info } from 'views/info'
import { reducer as battle } from 'views/battle'
import { reducer as ui} from 'views/ui'

export function reducerFactory(extensionConfig) {
  return combineReducers({
    config,
    info,
    battle,
    ui,
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
