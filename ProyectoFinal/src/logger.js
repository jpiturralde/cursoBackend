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

const log = log4js.getLogger()

const logger = {
  trace: (...msg) => { log.trace(`${process.ppid}-${process.pid} ${msg.join(" ")}`) },
  debug: (...msg) => { log.debug(`${process.ppid}-${process.pid} ${msg.join(" ")}`) },
  info: (...msg) => { log.info(`${process.ppid}-${process.pid} ${msg.join(" ")}`) },
  warn: (...msg) => { log.warn(`${process.ppid}-${process.pid} ${msg.join(" ")}`) },
  error: (...msg) => { log.error(`${process.ppid}-${process.pid} ${msg.join(" ")}`) }
}

export { logger }