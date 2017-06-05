import { remote } from 'electron'
import { onGameRequest, onGameResponse } from 'scripts/redux'

const proxy = remote.require('./src/lib/proxy')

window.listenerFlag = false

const isGameApi = (pathname) =>
  (pathname.startsWith('/api/v1'))

const handleProxyGameOnRequest = (method, [domain, path], body, time) => {
  const {dispatch} = window
  if (!isGameApi(path)) {
    return
  }
  body = JSON.parse(body)
  const details = {
    method: method,
    path: path,
    body: body,
    time: time,
  }
  dispatch(onGameRequest(details))
  const event = new CustomEvent('game.request', {
    bubbles: true,
    cancelable: true,
    detail: details,
  })
  window.dispatchEvent(event)
}

const handleProxyGameStart = () => {
  window.dispatchEvent(new Event('game.start'))
}

const responses = []
let locked = false

const parseResponses = () => {
  const {dispatch} = window
  let [method, [domain, path, url], body, postBody, time] = responses.shift()
  /*if (['/kcs/mainD2.swf', '/kcsapi/api_start2', '/kcsapi/api_get_member/basic'].includes(path)) {
    handleProxyGameStart()
  }*/
  if (!isGameApi(path)) {
    return
  }
  console.log(path)
  console.log(body)
  
  /*if (body.api_data) {
    body = body.api_data
  }
  
  if ((postBody || {}).api_token) {
    delete postBody.api_token
  }
  
  if ((body || {}).api_level != null) {
    body.api_level = parseInt(body.api_level)
  }
  if ((body || {}).api_member_lv != null) {
    body.api_member_lv = parseInt(body.api_member_lv)
  }*/

  const details = {
    method: method,
    path: path,
    body: body,
    postBody: postBody,
    time: time,
  }

  // Update redux store
  dispatch(onGameResponse(details))
  const event = new CustomEvent('game.response', {
    bubbles: true,
    cancelable: true,
    detail: details,
  })
  window.dispatchEvent(event)
}

const resolveResponses = () => {
  locked = true
  while (responses.length > 0) {
    parseResponses()
  }
  locked = false
}

const handleProxyGameOnResponse = (method, [domain, path, url], body, postBody, time) => {
  responses.push([method, [domain, path, url], JSON.parse(body), JSON.parse(postBody), time])
  if (!locked) {
    resolveResponses()
  }
}

const handleGetServer = (server) => {
  window._serverIp = server.ip
}

const proxyListener = {
  'network.on.request': handleProxyGameOnRequest,
  'network.on.response': handleProxyGameOnResponse,
  //'network.error': handleProxyNetworkError,
  //'network.error.retry': handleProxyNetworkErrorRetry,
  'network.get.server': handleGetServer,
}

const addProxyListener = () => {
  if (!window.listenerFlag) {
    window.listenerFlag = true
    for (const eventName in proxyListener) {
      proxy.addListener(eventName, proxyListener[eventName])
    }
  }
}

addProxyListener()

window.addEventListener ('load', () => {
  addProxyListener()
})

window.addEventListener ('unload', () => {
  if (window.listenerFlag){
    window.listenerFlag = false
    for (const eventName in proxyListener) {
      proxy.removeListener(eventName, proxyListener[eventName])
    }
  }
})
