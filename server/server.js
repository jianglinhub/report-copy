const path = require('path')
const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const log = require("./util/boleLog").boleLog
const staticServer = require('koa-static')
const staticCache = require('koa-static-cache')
const webRoot = path.join(process.cwd(), 'webapp')
const trouters = require('./util/routers')
const config = require('./config')

app.use(async(ctx, next) => {
  log.info('------------------ one request start ------------------')
  try {
    let pattern = new RegExp('^/api')
    if (pattern.test(ctx.url)) {
      log.info(`{ method: ${ctx.method}, url: ${ctx.url} }`)
    }
    await next()
  } catch (err) {
    ctx.body = err
  }
})

app.use(staticCache(webRoot, {
  maxAge: 365 * 24 * 60 * 60,
  gzip: true,
  usePrecompiledGzip: true,
  dynamic: true
}))

app.use(staticServer(webRoot))

app.use(koaBody())
app.use(trouters())

app.listen(config.port)
console.log(`app is listen on ${config.port}`)
