import axios from 'axios'

const Axios = axios.create({ timeout: 10000 })

const METHODS = { GET: 'get', POST: 'post' }

const request = (url, params = {}, headers = {}, method = METHODS.GET) => {
  const options = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      token: window.localStorage['dashboard-token'],
      ...headers,
    },
    method,
  }

  if (method === METHODS.POST) {
    options.data = params
  } else if (method === METHODS.GET) {
    options.params = params
  }

  return Axios({ url, ...options }).catch(err => {
    window.alert('服务器内部错误，请稍后重试！') // eslint-disable-line
    console.log(`error: ${err.message}`) // eslint-disable-line
  })
}

const get = (url, params, headers) => request(url, params, headers)

// const post = (url, params, headers) => request(url, params, headers, METHODS.POST)

export default {

  getVehInfo: params => get('api/getVehInfo', params), // 获取车主信息

  getSingleReport: params => get('api/getSingleReport', params), // 获取单车数据统计

  queryMultiVehInfos: params => get('api/queryMultiVehInfos', params), // 获取多车信息

  getMultiReport: params => get('api/getMultiReport', params), // 获取多车数据统计

  queryMonitorReport: params => get('api/queryMonitorReport', params), // 获取监控数统计

  queryWorkOrderReport: params => get('api/queryWorkOrderReport', params), // 获取报警处理数统计

  queryModelAlarmNumReport: params => get('api/queryModelAlarmNumReport', params), // 获取报警数统计

}
