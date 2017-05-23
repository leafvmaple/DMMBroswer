import { app } from 'electron'
import EventEmitter from 'events'
import http from 'http'
import url from 'url'
import config from './config'

class Proxy extends EventEmitter {
    constructor() {
    super()
    this.load()
  }
  load = () => {
    this.server = http.createServer((req, res) => {
      /*delete req.headers['proxy-connection']
      req.headers['connection'] = 'close'
      const parsed = url.parse(req.url)
      console.log(parsed)
      let reqBody = Buffer.alloc(0)
      // Get all request body
      req.on ('data', (data) => {
        reqBody = Buffer.concat([reqBody, data])
      })
      req.on('end', async () => {
        let domain, pathname, requrl
        try {
          let options = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            encoding: null,
            followRedirect: false,
          }
          // Add body to request
          if (reqBody.length > 0) {
            options = Object.assign(options, {
              body: reqBody,
            })
          }
          domain = req.headers.origin
          pathname = parsed.pathname
          requrl = req.url
        } catch (e) {
          error(`${req.method} ${req.url} ${e.toString()}`)
          this.emit('network.error', [domain, pathname, requrl])
        }
      })*/
    })
    /*this.server.on('connect', (req, client, head) => {
      delete req.headers['proxy-connection']
      // Disable HTTP Keep-Alive
      req.headers['connection'] = 'close'
      const remoteUrl = url.parse(`https://${req.url}`)
      const host = config.get('proxy.http.host', '127.0.0.1')
      const port = config.get('proxy.http.port', 8099)
	    // Write header to http proxy
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
    })*/
    const listenPort = config.get('proxy.port', 8099)
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
