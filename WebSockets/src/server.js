// UTILS CONFIG
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_PATH = __dirname.substr(0, __dirname.length-4)

//PERSISTENCE CONFIG
import { ProductsDao, MessagesDao } from "./daos/index.js"
import { RepositoryFactory } from "./persistence/index.js"

RepositoryFactory.initialize(process.argv.slice(2)[0])
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

//SESSION CONFIG
import { SessionManagerFactory } from "./session/index.js"
SessionManagerFactory.initialize(process.argv.slice(2)[1])
let sessionMiddleware
try {
    sessionMiddleware = await SessionManagerFactory.createSessionManager()
} catch (error) {
    console.error(`Error al crear sessionMiddleware ${error}`) 
    throw Error(error)
}

import { logger, authentication, isAuthenticated } from "./lib/index.js"
const authenticationManager = {
    authenticationMdw: authentication(
        [{
            path:'/home', 
            methods: ['GET']
        }]
    ),
    authenticationFn: isAuthenticated
}
import { ExpressApp } from './app.js'
const app = ExpressApp({
    rootPath: ROOT_PATH,
    sessionMiddleware,
    authenticationManager,
    logger
})

// const apiRouter = () => {
//     const router = new Router()

//     // LOGOUT
//     router.get('/api/logout', getLogout)

//     // INFO
//     router.get('api/info', getInfo)

//     return router
// } 

// const getInfo = (req, res) => {
//     console.log('------------ req.session -------------')
//     console.log(req.session)
//     console.log('--------------------------------------')

//     console.log('----------- req.sessionID ------------')
//     console.log(req.sessionID)
//     console.log('--------------------------------------')

//     console.log('----------- req.cookies ------------')
//     console.log(req.cookies)
//     console.log('--------------------------------------')

//     console.log('---------- req.sessionStore ----------')
//     console.log(req.sessionStore)
//     console.log('--------------------------------------')

//     res.json({msg: 'Send info ok!' + req.sessionID })
// }
// app.get('/api/info', getInfo)


// SOCKET CONFIG
import { Server as HttpServer } from 'http'
const http = new HttpServer(app)

import { bindSocketIO } from './socket.js'
bindSocketIO(http, sessionMiddleware, messagesDB, productsDB)

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))