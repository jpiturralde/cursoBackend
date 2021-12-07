import express from 'express'
import exphbs from 'express-handlebars'

import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'

import { mockRouter } from "./mock-router.js"
import ChatNormalizr from './ChatNormalizr.js'
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
import session from 'express-session'
/* ------------------------------------------------*/
/*           Persistencia por FileStore            */
/* ------------------------------------------------*/
//const FileStore = require('session-file-store')(session)
//onst store = new FileStore({ path: './sessions', ttl: 600, logFn: function(){}, retries:0 })
/* ------------------------------------------------*/
/*           Persistencia por MongoDB              */
/* ------------------------------------------------*/
import MongoStore from 'connect-mongo'
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const store = MongoStore.create({
    //En Atlas connect App :  Make sure to change the node version to 2.2.12:
    mongoUrl: 'mongodb+srv://[USER]:[PASSWORD]@cluster0.xjgs3.mongodb.net/[DB]>?retryWrites=true&w=majority',
    mongoOptions: advancedOptions
})

import sharedsession from 'express-socket.io-session'
const sessionMiddleware  = session({
    store: store,
    secret: 'cursoBackend',
    resave: true,
    saveUninitialized: false
})

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_PATH = __dirname.substr(0, __dirname.length-4)
console.log(ROOT_PATH)
const app = express()
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }))
app.set('view engine', '.hbs')
app.use(sessionMiddleware)
app.use(express.static(ROOT_PATH + '/views'))           
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos-test', mockRouter)

/* --------------------- ROUTES --------------------------- */

// LOGIN
app.get('/login', (req, res) => {
    res.sendFile(ROOT_PATH+'/views/login.html')
  })
  
app.post('/login', (req, res) => {
    console.log('/login', req.body.userName)
    if (req.session.visits) {
        req.session.visits++
        const result = { msg: `${getNombreSession(req)} visitaste la página ${req.session.visits} veces.`}
        console.log(result)
    } else {
        req.session.userName = req.body.userName
        req.session.visits = 1
        const result = { msg: `Te damos la bienvenida ${getNombreSession(req)}`}
        console.log(result)
    }
    res.redirect("/session")
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
app.get('/session', (req, res) => {
    res.sendFile(ROOT_PATH + '/views/session.html')
})

//  ROOT
app.get('/', (req, res) => {
    console.log('GET /')
    if (req.session.visits) {
        res.redirect("/session")
    }
    else {
        res.redirect("/login")
    }
    //res.sendFile(__dirname + '/views/index.html');
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


const getNombreSession = req => req.session.userName ? req.session.userName : ''
const http = new HttpServer(app)
const io = new IOServer(http)
io.use(sharedsession(sessionMiddleware, { autoSave: true }))

io.on('connection', async socket => {
    console.log('Un cliente se ha conectado', socket.handshake.session.userName)

    if (socket.handshake.session.userName) {
        console.log('onConnection')
        const userName = socket.handshake.session.userName
        let visits = socket.handshake.session.visits++
        const denormalizedMessages = await messagesDB.get()
        // console.log(denormalizedMessages)
        const messages  = ChatNormalizr.normalizeChat(denormalizedMessages) 
        // console.log('onConnection messages=')
        // print(messages)
        const products = await productsDB.get()
        console.log('emit session')
        socket.emit('session', userName, messages, products, visits)
    }
    else {
        console.log('emit login')
        socket.emit('login')
    }

    /* Envio los mensajes al cliente que se conectó */
    // const denormalizedMessages = await messagesDB.get()
    // const messages  = ChatNormalizr.normalizeChat(denormalizedMessages) 
    // socket.emit('messages', messages)

    /* Envio los productos al cliente que se conectó */
    // socket.emit('products', await productsDB.get())
    
    socket.on('new-message', async data => {
        data.ts = Date.now()
        await messagesDB.post(data)
        const denormalizedMessages = await messagesDB.get()
        console.log('new-message', denormalizedMessages)
        const messages  = ChatNormalizr.normalizeChat(denormalizedMessages)  
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product', async data => {
        await productsDB.post(data)
        const products = await productsDB.get()
        io.sockets.emit('products', products);
    });

    socket.on('new-session', async data => {
        const userName = socket.handshake.session.userName
        const visits = socket.handshake.session.visits++
        console.log('new-session', userName)
        socket.emit('session', userName, messages, products)
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