const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const store = new FileStore({ path: './sessions', ttl: 60, logFn: function(){}, retries:0 })

const sessionMiddleware  = session({
    store: store,
    secret: 'cursoBackend',
    resave: false,
    saveUninitialized: false
})
const app = express()

const http = new HttpServer(app)
const io = new IOServer(http)

const wrap = middleware => (socket, next) => middleware(socket.request, socket.request.res || {}, next)
io.use(wrap(sessionMiddleware))

app.use(sessionMiddleware)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });

const getNombreSession = req => req.session.nombre ? req.session.nombre : ''

app.get('/api/login', (req, res) => {
    console.log('/api/login', req.query.nombre)
    if (req.session.contador) {
        req.session.contador++
        const result = { msg: `${getNombreSession(req)} visitaste la página ${req.session.contador} veces.`}
        console.log(result)
        res.json(result)
    } else {
        let { nombre } = req.query
        req.session.nombre = nombre
        req.session.contador = 1
        const result = { msg: `Te damos la bienvenida ${getNombreSession(req)}`}
        console.log(result)
        res.json(result)
    }
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

    res.send('Send info ok!' + req.sessionID)
})


const messages  = ['mensaje1', 'mensaje2']
const products = ['product1', 'product2']



io.on('connection', async socket => {
    console.log('Un cliente se ha conectado', socket.request.session.nombre, socket.request.session.sessionID)
    if (socket.request.session.nombre) {
        if (socket.request.session.contador == 1) {
            console.log('emit session')
            const userName = socket.request.session.nombre
            socket.emit('session', userName, messages, products)
        }
        else {
            console.log('emit messages products')
            /* Envio los mensajes al cliente que se conectó */
            socket.emit('messages', messages)

            /* Envio los productos al cliente que se conectó */
            socket.emit('products', products)
        }
    }
    else {
        console.log('emit login')
        socket.emit('login')
    }
   
    socket.on('new-message', async data => {
        messages.push(data)
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product', async data => {
        products.push(data)
        io.sockets.emit('products', products);
    });

    socket.on('new-session', async data => {
        const userName = socket.request.session.nombre
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