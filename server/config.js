const service = ['api']
const packageConfig = require('../package.json')
const servicePrefix = 'v1'
const dashboard_service = process.env.DASHBOARD_SERVICE || '127.0.0.1:3011'
const gateway = process.env.GATEWAY || '172.28.62.85:8091'

let config = {
  'port': process.env.PORT || '3333',
  'appinfo': {
    'dashboard': {
      'appkey': 'c6860080d01911e7a57edff4153c4b77',
      'secretkey': '6f17d822fd324a018a41c36c88862258'
    },
    'gateway': {
      'appkey': '6839153606',
      'secretkey': 'bcd3edfbc30e64ec46cab5c5fcad6813'
    }
  },
  'dashboard-api': {
    'host': `http://${dashboard_service}/`,
    'uri': 'dashboard-api/'
  }
}
config.pkg = packageConfig
config.servicePrefix = servicePrefix

service.forEach((item, index) => {
  config[item] = { host: `http://${gateway}/`, uri: `${item}/` }
})

module.exports = config
