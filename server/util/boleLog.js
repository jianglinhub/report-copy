const bole = require("bole")
const boleConsole = require("bole-console")
const config = require("../config")

const isDev = process.env.NODE_ENV === 'development'

var boleConsoleStream
if (isDev) {
  boleConsoleStream = boleConsole({})
} else {
  boleConsoleStream = boleConsole({
    timestamp: true,
    hostname: true,
    pid: true,
    requestDetails: true
  })
}

bole.output([
  { level: "info", stream: boleConsoleStream }
])

var boleLog = bole(config.pkg.name)

module.exports = {
  boleLog: boleLog
}