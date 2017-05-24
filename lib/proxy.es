import { app } from 'electron'
import bluebird from 'bluebird'
import EventEmitter from 'events'
import http from 'http'
import url from 'url'
import net from 'net'
import request from 'request'
import querystring from 'querystring'
import caseNormalizer from 'header-case-normalizer'
import config from './config'

const zlib = bluebird.promisifyAll(require('zlib'))

const resolveBody = (encoding, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = null
      switch (encoding) {
      case 'gzip':
        decoded = await zlib.gunzipAsync(body)
        break
      case 'deflate':
        decoded = await zlib.inflateAsync(body)
        break
      default:
        decoded = body
      }
      decoded = decoded.toString()
      if (decoded.indexOf('svdata=') === 0) {
        decoded = decoded.substring(7)
      }
      decoded = JSON.parse(decoded)
      resolve(decoded)
    } catch (e) {
      reject(e)
    }
  })
}

const resolve = (req) => {
  const host = config.get('proxy.http.host', '127.0.0.1')
  //const port = config.get('proxy.http.port', 8099)
  const port = config.get('proxy.http.port', 1080)
  const requirePassword = config.get('proxy.http.requirePassword', false)
  const username = config.get('proxy.http.username', '')
  const password = config.get('proxy.http.password', '')
  const useAuth = (requirePassword && username !== '' && password !== '')
  const strAuth = `${username}:${password}@`
  return Object.assign(req, {
    proxy: `http://${useAuth ? strAuth : ''}${host}:${port}`,
  })
}

class Proxy extends EventEmitter {
    constructor() {
    super()
    this.load()
  }
  load = () => {
    let isCreated = false
    this.server = http.createServer((req, res) => {
      delete req.headers['proxy-connection']
      req.headers['connection'] = 'close'
      const parsed = url.parse(req.url)
      if (!isCreated && parsed.hostname == "web.flower-knight-girls.co.jp" && parsed.pathname.startsWith('/api/v1')) {
        isCreated = true
        this.emit('network.get.server', {
          ip: parsed.hostname,
        })
      }
      let reqBody = Buffer.alloc(0)
      req.on ('data', (data) => {
        reqBody = Buffer.concat([reqBody, data])
      })
      let cacheFile = null
      req.on('end', async () => {
        let domain, pathname, requrl
        let options = {
          method: req.method,
          url: req.url,
          headers: req.headers,
          encoding: null,
          followRedirect: false,
        }
        if (reqBody.length > 0) {
          options = Object.assign(options, {
            body: reqBody,
          })
        }
        domain = req.headers.origin
        pathname = parsed.pathname
        requrl = req.url
        reqBody = JSON.stringify(querystring.parse(reqBody.toString()))
        this.emit('network.on.request', req.method, [domain, pathname, requrl], reqBody, Date.now())
        const [response, body] = await new Promise((promise_resolve, promise_reject) => {
          request(resolve(options), (err, res_response, res_body) => {
            if (!err) {
              promise_resolve([res_response, res_body])
            } else {
              promise_reject(err)
            }
          }).pipe(res)
        })
        let resolvedBody = await resolveBody(response.headers['content-encoding'], body)
        this.emit('network.on.response', req.method, [domain, pathname, requrl], JSON.stringify(resolvedBody), reqBody, Date.now())
        res.end()
      })
    })
    this.server.on('connect', (req, client, head) => {
      delete req.headers['proxy-connection']
      // Disable HTTP Keep-Alive
      req.headers['connection'] = 'close'
      let remote = null
      const remoteUrl = url.parse(`https://${req.url}`)
      const host = config.get('proxy.http.host', '127.0.0.1')
      //const port = config.get('proxy.http.port', 8099)
      const port = config.get('proxy.http.port', 1080)
      let msg = `CONNECT ${remoteUrl.hostname}:${remoteUrl.port} HTTP/${req.httpVersion}\r\n`
      for (const k in req.headers) {
        msg += `${caseNormalizer(k)}: ${req.headers[k]}\r\n`
      }
      msg += "\r\n"
      remote = net.connect(port, host, () => {
        remote.write(msg)
        remote.write(head)
        client.pipe(remote)
        remote.pipe(client)
      })
      client.on('end', () => {
        remote.end()
      })
      remote.on('end', () => {
        client.end()
      })
      client.on('error', (e) => {
        remote.destroy()
      })
      remote.on('error', (e) => {
        client.destroy()
      })
      client.on('timeout', () => {
        client.destroy()
        remote.destroy()
      })
      remote.on('timeout', () => {
        client.destroy()
        remote.destroy()
      })
    })
    const listenPort = config.get('proxy.port', 0)
    this.server.listen(listenPort, '127.0.0.1', () => {
      console.log(this.server.address().port)
      this.port = this.server.address().port
      app.commandLine.appendSwitch('proxy-server', `127.0.0.1:${this.port}`)
      app.commandLine.appendSwitch('ignore-certificate-errors')
      app.commandLine.appendSwitch('ssl-version-fallback-min', "tls1")
      //log(`Proxy listening on ${this.port}`)
    })
  }
}

export default new Proxy()
