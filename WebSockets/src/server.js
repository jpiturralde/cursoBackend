const express = require('express')
const exphbs = require('express-handlebars')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const DBWrapper = require('./DBWrapper.js')
const ProductsDBWrapper = require('./ProductsDBWrapper.js')
const RepositoryDB = require('./RepositoryDB.js')
const mariaDB = require('../options/mariaDB.js')
const sqlite3 = require('../options/SQLite3.js')
const { mockRouter } = require("./mock-router")
//const messagesDB = new DBWrapper(new RepositoryDB('messages', mariaDB))
const messagesDB = require('./messages-fs-db.js')
const productsDB = new ProductsDBWrapper(sqlite3)
const ChatNormalizr = require('./ChatNormalizr.js')

//SESSION CONFIG
const session = require('express-session')
/* ------------------------------------------------*/
/*           Persistencia por FileStore            */
/* ------------------------------------------------*/
//const FileStore = require('session-file-store')(session)
//onst store = new FileStore({ path: './sessions', ttl: 600, logFn: function(){}, retries:0 })
/* ------------------------------------------------*/
/*           Persistencia por MongoDB              */
/* ------------------------------------------------*/
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const store = MongoStore.create({
    //En Atlas connect App :  Make sure to change the node version to 2.2.12:
    mongoUrl: 'mongodb+srv://<user>:<password>@cluster0.xjgs3.mongodb.net/<DB>?retryWrites=true&w=majority',
    mongoOptions: advancedOptions
})

const sharedsession = require("express-socket.io-session")
const sessionMiddleware  = session({
    store: store,
    secret: 'cursoBackend',
    resave: true,
    saveUninitialized: false
})


const ROOT_PATH = __dirname.substr(0, __dirname.length-4)
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
    console.log('Un cliente se ha conectado', socket.handshake.session.userName, socket.handshake.session.visits)

    if (socket.handshake.session.userName) {
        console.log('onConnection')
        const userName = socket.handshake.session.userName
        let visits = socket.handshake.session.visits++
        const denormalizedMessages = await messagesDB.get()
        const messages  = ChatNormalizr.normalizeChat(denormalizedMessages) 
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
        const messages  = ChatNormalizr.normalizeChat(await messagesDB.get())  
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


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))