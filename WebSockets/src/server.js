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
import { logger } from "./lib/index.js"
import { Server as HttpServer } from 'http'
import { ExpressApp } from './app.js'
// SOCKET CONFIG
import { bindSocketIO } from './socket.js'

//PERSISTENCE CONFIG
async function createDB() {
    RepositoryFactory.initialize(context.PERSISTENCE_CONFIG_PATH)
    let productsDB
    let messagesDB
    try {
        productsDB = new ProductsDao(await RepositoryFactory.createProductsRepository())
    } catch (error) {
        console.error(`Error al crear ProductsDao ${error}`) 
        throw Error(error)
    }
    try {
        messagesDB = new MessagesDao(await RepositoryFactory.createMessagesRepository())
    } catch (error) {
        console.error(`Error al crear MessagesDao ${error}`) 
        throw Error(error)
    }
    return {
        productsDB,
        messagesDB
    }
}


// SESSION CONFIG
async function createSessionManager() {
    SessionManagerFactory.initialize(context.SESSION_CONFIG_PATH)
    let sessionMiddleware
    try {
        sessionMiddleware = await SessionManagerFactory.createSessionManager()
    } catch (error) {
        console.error(`Error al crear sessionMiddleware ${error}`) 
        throw Error(error)
    }
    return sessionMiddleware
}


// AUTHENTICATION CONFIG
async function createAthenticationManager() {
    await AuthenticationManagerFactory.initialize(context.AUTHENTICATION_CONFIG_PATH, RepositoryFactory, UsersDao)
    return await AuthenticationManagerFactory.create()
}

// SERVER CONFIG
async function createServer() {
    console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} creating server ..........................`)
    const sessionMiddleware = await createSessionManager()
    const http = new HttpServer(ExpressApp({
        rootPath: context.ROOT_PATH,
        sessionMiddleware,
        authenticationManager: await createAthenticationManager(),
        logger
    }))

    const db = await createDB()

    // SOCKET CONFIG
    bindSocketIO(http, sessionMiddleware, db.messagesDB, db.productsDB)
    console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} server created ..........................`)
    return http
}

//const http = await createServer()

/* ------------------------------------------------------ */
/* Server Listen */
// const PORT = context.port || 8080
// const httpServer = http.listen(PORT)
// httpServer.on('listening', () => {
//     console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
// })
// httpServer.on('error', error => console.log(`Error en servidor ${error}`))

// }//else cluster.isPrimary

export { createServer }