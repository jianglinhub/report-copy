const path = require("path")
const log = require("../../util/boleLog").boleLog
const filters = require('../../util/utils')
const trouter = require(path.join(process.cwd(), "server/util/trouter"))
const handler = require(path.join(process.cwd(), "server/service/report/handler"))
const send = require('koa-send')

trouter.get("/getSingleReport", async(ctx) => {
  const res = await handler.getSingleReport(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

trouter.get("/getVehInfo", async(ctx) => {
  const res = await handler.getVehInfo(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

trouter.get("/getMultiReport", async(ctx) => {
  const res = await handler.getMultiReport(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

trouter.get("/queryMultiVehInfos", async(ctx) => {
  const res = await handler.queryMultiVehInfos(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

trouter.get("/queryMonitorReport", async(ctx) => {
  const res = await handler.queryMonitorReport(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

trouter.get("/queryWorkOrderReport", async(ctx) => {
  const res = await handler.queryWorkOrderReport(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

trouter.get("/queryModelAlarmNumReport", async(ctx) => {
  const res = await handler.queryModelAlarmNumReport(ctx.request.query)
  log.info('------------------ one request end ------------------')
  console.log('\n')
  ctx.body = res
})

// 导出示例
// trouter.get("/exportOrderList", async(ctx) => {
//   unLinkFilePath(path.join(process.cwd(), 'server/tmp/'))
//   let fileName = '车辆报警信息' + '-' + filters.DateFilter(Date.now()) + String(Math.floor(Math.random() * 9000) + 1000) + '.xlsx'
//   let serverFilePath = path.join(process.cwd(), 'server/tmp', fileName)
//   let result = await handler.exportOrderList(ctx.request.query, serverFilePath)
//   if (result.status === 1) {
//     ctx.attachment(fileName)
//     await send(ctx, path.join('server/tmp', fileName))
//   }
// })

module.exports = trouter
