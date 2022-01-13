// CONTEXT
import { context } from './context.js'
//PERSISTENCE CONFIG
import { ProductsDao, MessagesDao } from "./daos/index.js"
import { RepositoryFactory } from "./persistence/index.js"
// SESSION CONFIG
import { SessionManagerFactory } from "./session/index.js"
// AUTHENTICATION CONFIG
import { AuthenticationManagerFactory } from './authentication/index.js'
import { UsersDao } from './daos/index.js'
// SERVER CONFIG
import { loggerMdw } from "./lib/index.js"
import { Server as HttpServer } from 'http'
import { ExpressApp } from './app.js'
// SOCKET CONFIG
import { bindSocketIO } from './socket.js'

const logger = context.logger

//PERSISTENCE CONFIG
async function createDB() {
    RepositoryFactory.initialize(context.PERSISTENCE_CONFIG_PATH)
    let productsDB
    let messagesDB
    try {
        productsDB = new ProductsDao(await RepositoryFactory.createProductsRepository())
    } catch (error) {
        logger.error(`Error al crear ProductsDao ${error}`) 
        throw Error(error)
    }
    try {
        messagesDB = new MessagesDao(await RepositoryFactory.createMessagesRepository())
    } catch (error) {
        logger.error(`Error al crear MessagesDao ${error}`) 
        throw Error(error)
    }
    return {
        productsDB,
        messagesDB
    }
}


// SESSION CONFIG
async function createSessionManager() {
    SessionManagerFactory.initialize(context.SESSION_CONFIG_PATH, logger)
    let sessionMiddleware
    try {
        sessionMiddleware = await SessionManagerFactory.createSessionManager()
    } catch (error) {
        logger.error(`Error al crear sessionMiddleware ${error}`) 
        throw Error(error)
    }
    return sessionMiddleware
}


// AUTHENTICATION CONFIG
async function createAthenticationManager() {
    await AuthenticationManagerFactory.initialize(context.AUTHENTICATION_CONFIG_PATH, RepositoryFactory, UsersDao, logger)
    return await AuthenticationManagerFactory.create()
}

// SERVER CONFIG
async function createServer() {
    logger.info(`Creating server ..........................`)
    const sessionMiddleware = await createSessionManager()
    const http = new HttpServer(ExpressApp({
        rootPath: context.ROOT_PATH,
        sessionMiddleware,
        authenticationManager: await createAthenticationManager(),
        logger: loggerMdw(logger)
    }))

    const db = await createDB()

    // SOCKET CONFIG
    bindSocketIO(http, sessionMiddleware, db.messagesDB, db.productsDB, logger)
    logger.info(`Server created ..........................`)
    return http
}

export { createServer }