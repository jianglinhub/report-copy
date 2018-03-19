const path = require('path')
const request = require(path.join(process.cwd(), 'server/util/request'))
const servicePrefix = require(path.join(process.cwd(), 'server/config')).servicePrefix
const signUrl = require(path.join(process.cwd(), 'server/util/signurl')).gatewaySignUrl

class Test {
  getSingleReport(params) {
    let url = signUrl(`api/${servicePrefix}/report`, 'single', {
      query: params
    })
    return request.transfer(url)
  }

  getVehInfo(params) {
    let url = signUrl(`api/${servicePrefix}/report/single`, 'getVehInfo', {
      query: params
    })
    return request.transfer(url)
  }

  getMultiReport(params) {
    let url = signUrl(`api/${servicePrefix}/report`, 'multi', {
      query: params
    })
    return request.transfer(url)
  }

  queryMultiVehInfos(params) {
    let url = signUrl(`api/${servicePrefix}/report/multi`, 'queryVinOrPlate', {
      query: params
    })
    return request.transfer(url)
  }

  queryMonitorReport(params) {
    let url = signUrl(`api/${servicePrefix}/report/vehicle`, 'monitor', {
      query: params
    })
    return request.transfer(url)
  }

  queryWorkOrderReport(params) {
    let url = signUrl(`api/${servicePrefix}/report/vehicle`, 'workOrder', {
      query: params
    })
    return request.transfer(url)
  }

  queryModelAlarmNumReport(params) {
    let url = signUrl(`api/${servicePrefix}/report/vehicle`, 'getModelAlarmNum', {
      query: params
    })
    return request.transfer(url)
  }


  // 导出示例
  //   exportOrderList(params, filePath) {
  //     let url = signUrl(`rtm-workorder-service/api/${servicePrefix}/workorder/warningCaseExport`, 'export', {
  //       query: params
  //     });
  //     return request.requestPipToFile(url, filePath);
  //   }

}

module.exports = exports = new Test
