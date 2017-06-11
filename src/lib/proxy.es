import { app } from 'electron'
import bluebird from 'bluebird'
import EventEmitter from 'events'
import http from 'http'
import url from 'url'
import net from 'net'
import request from 'request'
import socks from 'socks5-client'
import SocksHttpAgent from 'socks5-http-client/lib/Agent'
import querystring from 'querystring'
import caseNormalizer from 'header-case-normalizer'
import config from './config'

const zlib = bluebird.promisifyAll(require('zlib'))

const bodyParse = (compress, codepage, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = null
      switch (compress) {
      case 'gzip':
        decoded = await zlib.gunzipAsync(body)
        break
      case 'deflate':
        decoded = await zlib.inflateAsync(body)
        break
      case 'zip':
        decoded = await zlib.unzipAsync(body)
        break
      default:
        decoded = body
      }
      switch (codepage) {
      case 'base64':
        decoded = new Buffer(decoded.toString(), 'base64').toString()
        break
      default:
        decoded = decoded.toString()
      }
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
  switch (config.get('proxy.use')) {
  case 'socks5':
    return Object.assign(req, {
      agentClass: SocksHttpAgent,
      agentOptions: {
        socksHost: config.get('proxy.socks5.host', '127.0.0.1'),
        socksPort: config.get('proxy.socks5.port', 1080),
      },
    })
  case 'http': {
    const host = config.get('proxy.http.host', '127.0.0.1')
    const port = config.get('proxy.http.port', 8099)
    const requirePassword = config.get('proxy.http.requirePassword', false)
    const username = config.get('proxy.http.username', '')
    const password = config.get('proxy.http.password', '')
    const useAuth = (requirePassword && username !== '' && password !== '')
    const strAuth = `${username}:${password}@`
    return Object.assign(req, {
      proxy: `http://${useAuth ? strAuth : ''}${host}:${port}`,
    })
  }
  case 'pac': {
    const uri = config.get('proxy.pacAddr')
    if (!PacAgents[uri]) {
      PacAgents[uri] = new PacProxyAgent(uri)
    }
    return Object.assign(req, {
      agent: PacAgents[uri],
    })
  }
  default:
    return req
  }
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
        let codepage = 'utf-8'
        if (pathname.startsWith('/api/v1')) {
          response.headers['content-encoding'] = 'zip'
          codepage = 'base64'
        }
        let resolvedBody = await bodyParse(response.headers['content-encoding'], codepage, body)
        if (response.statusCode == 200) {
          this.emit('network.on.response', req.method, [domain, pathname, requrl], JSON.stringify(resolvedBody), reqBody, Date.now())
        }
        
        res.end()
      })
    })
    this.server.on('connect', (req, client, head) => {
      delete req.headers['proxy-connection']
      req.headers['connection'] = 'close'
      const remoteUrl = url.parse(`https://${req.url}`)
      let remote = null
      switch (config.get('proxy.use')) {
      case 'socks5': {
        remote = socks.createConnection({
          socksHost: config.get('proxy.socks5.host', '127.0.0.1'),
          socksPort: config.get('proxy.socks5.port', 1080),
          host: remoteUrl.hostname,
          port: remoteUrl.port,
        })
        remote.on ('connect', () => {
          client.write("HTTP/1.1 200 Connection Established\r\nConnection: close\r\n\r\n")
          remote.write(head)
        })
        client.on('data', (data) => {
          remote.write(data)
        })
        remote.on('data', (data) => {
          client.write(data)
        })
        break
      }
      case 'http': {
        const host = config.get('proxy.http.host', '127.0.0.1')
        const port = config.get('proxy.http.port', 8118)
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
        break
      }
      default: {
        remote = net.connect(remoteUrl.port, remoteUrl.hostname, () => {
          client.write("HTTP/1.1 200 Connection Established\r\nConnection: close\r\n\r\n")
          remote.write(head)
          client.pipe(remote)
          remote.pipe(client)
        })
      }
      }
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
      this.port = this.server.address().port
      app.commandLine.appendSwitch('proxy-server', `127.0.0.1:${this.port}`)
      app.commandLine.appendSwitch('ignore-certificate-errors')
      app.commandLine.appendSwitch('ssl-version-fallback-min', "tls1")
      //log(`Proxy listening on ${this.port}`)
    })
  }
}

export default new Proxy()
