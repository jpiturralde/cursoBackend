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

// UTILS CONFIG
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_PATH = __dirname.substr(0, __dirname.length-4)

//APP CONFIG
import express from 'express'
import exphbs from 'express-handlebars'
import { logger } from "./lib/index.js"
const app = express()
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }))
app.set('view engine', '.hbs')
app.use(sessionMiddleware)
app.use(express.static(ROOT_PATH + '/views'))           
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

import { mockRouter } from "./mock-router.js"
app.use('/api/productos-test', mockRouter)

/* --------------------- ROUTES --------------------------- */
const getNombreSession = req => req.session.userName ? req.session.userName : ''

// LOGIN
app.get('/login', (req, res) => {
    if (!isAuthenticated(req)) {
        res.sendFile(ROOT_PATH+'/views/login.html')
    }
    else {
        res.redirect("/home")
    }
  })
  
app.post('/login', (req, res) => {
    console.log('/login', req.body.userName)
    if (!isAuthenticated(req)) {
        req.session.userName = req.body.userName
        req.session.visits = 0
    }
    res.redirect("/home")
})

//  LOGOUT
app.get('/logout', (req, res) => {
    const userName = getNombreSession(req)
    console.log('logout')
    req.session.destroy(err => {
        if (!err) {
            const result = { msg: `Hasta luego ${userName}`}
            console.log(result)
           // res.json(result)
            res.render('logout', {
                msg: result.msg
              });
        }
        else res.send({ error: 'logout', body: err })
    })
  })

//  SESSION
app.get('/home', isAuth, (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 0
    }
    req.session.visits++
    console.log('/home', req.session.userName, req.session.visits)    
    res.sendFile(ROOT_PATH + '/views/home.html')
})

const isAuthenticated = (req) => { return req.session.userName != undefined }
//  ROOT
function isAuth(req, res, next) {
    if (isAuthenticated(req)) {
        next()
    } else {
        res.redirect('/login')
    }
  }

app.get('/', isAuth, (req, res) => {
    res.redirect("/home")
})

app.get('/api/logout', (req, res) => {
    const userName = getNombreSession(req)
    console.log('logout')
    req.session.destroy(err => {
        if (!err) {
            const result = { msg: `Hasta luego ${userName}`}
            console.log(result)
            res.json(result)
        }
        else res.send({ error: 'logout', body: err })
    })
})

app.get('/api/info', (req, res) => {
    console.log('------------ req.session -------------')
    console.log(req.session)
    console.log('--------------------------------------')

    console.log('----------- req.sessionID ------------')
    console.log(req.sessionID)
    console.log('--------------------------------------')

    console.log('----------- req.cookies ------------')
    console.log(req.cookies)
    console.log('--------------------------------------')

    console.log('---------- req.sessionStore ----------')
    console.log(req.sessionStore)
    console.log('--------------------------------------')

    res.json({msg: 'Send info ok!' + req.sessionID })
})

// SOCKET CONFIG
import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import ChatNormalizr from './ChatNormalizr.js'

const http = new HttpServer(app)
const io = new IOServer(http)
import sharedsession from 'express-socket.io-session'
io.use(sharedsession(sessionMiddleware, { autoSave: true }))

const socketLogger = (socket, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${socket.handshake.session.userName} socketEvent`)
    next();
}

io.use(socketLogger)
io.on('connection', async socket => {
    console.log('Un cliente se ha conectado', socket.handshake.session.userName)

    if (socket.handshake.session.userName) {
        console.log('onConnection')
        const userName = socket.handshake.session.userName
        let visits = socket.handshake.session.visits++
        const denormalizedMessages = await messagesDB.get()
        let messages = denormalizedMessages
        if (denormalizedMessages.length > 0) {
            console.log('onConnection denormalizedMessages=', denormalizedMessages)
            messages  = ChatNormalizr.normalizeChat(denormalizedMessages) 
            console.log('onConnection messages=')
            print(messages)
        }
        const products = await productsDB.get()
        console.log('emit home')
        socket.emit('home', userName, messages, products, visits)
    }
    else {
        console.log('emit login')
        socket.emit('login')
    }

    socket.on('new-message', async data => {
        data.ts = Date.now()
        await messagesDB.post(data)
        const denormalizedMessages = await messagesDB.get()
        const messages  = ChatNormalizr.normalizeChat(denormalizedMessages)  
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product', async data => {
        await productsDB.post(data)
        const products = await productsDB.get()
        io.sockets.emit('products', products);
    });
})

import util from 'util'

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true))
}


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))