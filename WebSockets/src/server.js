// CONTEXT
import { context } from './context.js'

// SERVER CONFIG
import { loggerMdw } from "./lib/index.js"
import { Server as HttpServer } from 'http'
import { ExpressApp } from './app.js'

// SOCKET CONFIG
import { bindSocketIO } from './socket.js'

const logger = context.logger

// SERVER CONFIG
async function createServer() {
    logger.info(`Creating server ..........................`)
    const { ROOT_PATH, sessionMiddleware, authenticationManager, api }  = context
    const http = new HttpServer(ExpressApp({
        rootPath: ROOT_PATH,
        sessionMiddleware,
        authenticationManager,
        loggerMdw, 
        logger
    }))

    // const { productsDS, messagesDS } = context.persistence

    // SOCKET CONFIG
    // bindSocketIO(http, sessionMiddleware, messagesDS, productsDS, logger)
    bindSocketIO(http, sessionMiddleware, api, logger)
    logger.info(`Server created ..........................`)
    return http
}

export { createServer }