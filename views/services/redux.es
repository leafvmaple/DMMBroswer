import { combineReducers } from 'redux'

export function reducerFactory(extensionConfig) {
  return combineReducers()
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
