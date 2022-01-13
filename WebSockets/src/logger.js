import log4js from "log4js"

log4js.configure({
  appenders: {
    console: { type: 'console' },
    errorFile: { type: 'file', filename: 'error.log' },
    warnFile: { type: 'file', filename: 'warn.log' },
    consoleLogger: { type: 'logLevelFilter', appender: 'console', level: 'info' },
    errorFileLogger: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' },
    warnFileLogger: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn' }
  },
  categories: {
    default: {
      appenders: ['consoleLogger', 'errorFileLogger', 'warnFileLogger'], level: 'all'
    }
  }
})

const logger = log4js.getLogger()

export { logger }