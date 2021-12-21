// CONTEXT
import { context } from './context.js'

console.log('Server context', context)
//PERSISTENCE CONFIG
import { ProductsDao, MessagesDao } from "./daos/index.js"
import { RepositoryFactory } from "./persistence/index.js"

// RepositoryFactory.initialize(process.argv.slice(2)[0])
// RepositoryFactory.initialize(process.env.PERSISTENCE_CONFIG_PATH)
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

// SESSION CONFIG
import { SessionManagerFactory } from "./session/index.js"
SessionManagerFactory.initialize(context.SESSION_CONFIG_PATH)
let sessionMiddleware
try {
    sessionMiddleware = await SessionManagerFactory.createSessionManager()
} catch (error) {
    console.error(`Error al crear sessionMiddleware ${error}`) 
    throw Error(error)
}

// AUTHENTICATION CONFIG
import { AuthenticationManagerFactory } from './authentication/index.js'
import { UsersDao } from './daos/index.js'
await AuthenticationManagerFactory.initialize(context.AUTHENTICATION_CONFIG_PATH, RepositoryFactory, UsersDao)
const authenticationManager = await AuthenticationManagerFactory.create()

// SERVER CONFIG
import { logger } from "./lib/index.js"
import { Server as HttpServer } from 'http'
import { ExpressApp } from './app.js'
const http = new HttpServer(ExpressApp({
    rootPath: context.ROOT_PATH,
    sessionMiddleware,
    authenticationManager,
    logger
}))

// SOCKET CONFIG
import { bindSocketIO } from './socket.js'
bindSocketIO(http, sessionMiddleware, messagesDB, productsDB)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = context.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))