const request = require('request-promise')
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
}

module.exports = exports = new Request