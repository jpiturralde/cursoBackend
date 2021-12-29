import cluster from 'cluster'
import * as os from 'os'

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

const numCores = os.cpus().length
if (cluster.isPrimary) {
    console.log(numCores)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCores; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}
else {

console.log('Server context', context)

//PERSISTENCE CONFIG
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
SessionManagerFactory.initialize(context.SESSION_CONFIG_PATH)
let sessionMiddleware
try {
    sessionMiddleware = await SessionManagerFactory.createSessionManager()
} catch (error) {
    console.error(`Error al crear sessionMiddleware ${error}`) 
    throw Error(error)
}

// AUTHENTICATION CONFIG
await AuthenticationManagerFactory.initialize(context.AUTHENTICATION_CONFIG_PATH, RepositoryFactory, UsersDao)
const authenticationManager = await AuthenticationManagerFactory.create()

// SERVER CONFIG
const http = new HttpServer(ExpressApp({
    rootPath: context.ROOT_PATH,
    sessionMiddleware,
    authenticationManager,
    logger
}))

// SOCKET CONFIG
bindSocketIO(http, sessionMiddleware, messagesDB, productsDB)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = context.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))

}//else cluster.isPrimary