const path = require('path')
const request = require(path.join(process.cwd(), 'server/util/request'))
const signUrl = require(path.join(process.cwd(), 'server/util/signurl')).gatewaySignUrl

class Test {
  queryWifi(params) {
    console.log('params:', params)
    let url = signUrl('vehicle/wifistick', 'queryWifi', {
      query: params
    })
    return request.transfer(url)
  }
}

module.exports = exports = new Test
