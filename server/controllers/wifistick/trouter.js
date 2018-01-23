const path = require("path")
const log = require("../../util/boleLog").boleLog
const trouter = require(path.join(process.cwd(), "server/util/trouter"))
const handler = require(path.join(process.cwd(), "server/service/wifistick/handler"))

trouter.get("/queryWifi", async(ctx) => {
  ctx.body = await handler.queryWifi(ctx.request.query)
})

trouter.post("/testPost", async(ctx) => {
  ctx.body = await handler.testPost(ctx.request.body)
})

module.exports = trouter
