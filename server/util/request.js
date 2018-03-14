const request = require('request-promise')
const fs = require('fs')
const log = require("./boleLog").boleLog
const isDev = process.env.NODE_ENV === 'development'

class Request {
  transfer(options) {
    let param = {
      uri: options.uri,
      method: options.method,
      form: options.form,
      formData: options.formData,
      body: options.body,
      headers: options.headers,
      json: true,
      gzip: true
    }
    if (isDev) {
      if (param.body) {
        log.info(`{ body: ${JSON.stringify(param.body)} }`)
      }
      log.info(`{ request service: ${param.uri} }`)
    } else {
      log.info(param)
    }
    log.info('------------------  one request end  ------------------')
    console.log('\n')
    return request(param)
  }

  requestPipToFile(options, filepath) {
    return new Promise((resolve, reject) => {
      try {
        let stream = fs.createWriteStream(filepath)
        stream.on('finish', () => {
          resolve({ status: 1 })
        })
        log.info(`{ request service: ${options.uri} }`)
        return request({
          uri: options.uri,
          method: options.method,
          body: options.params,
          headers: {
            'Content-Type': 'application/octet-stream',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
          }
        }).pipe(stream)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = exports = new Request
