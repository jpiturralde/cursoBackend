const express = require('express')
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


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use('/api/productos-test', mockRouter)

const http = new HttpServer(app)
const io = new IOServer(http)
io.on('connection', async socket => {
    console.log('Un cliente se ha conectado')

    /* Envio los mensajes al cliente que se conectó */
    const denormalizedMessages = await messagesDB.get()
    const messages  = ChatNormalizr.normalizeChat(denormalizedMessages) 
    socket.emit('messages', messages)

    /* Envio los productos al cliente que se conectó */
    socket.emit('products', await productsDB.get())
    
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
})


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.port || 8080
const httpServer = http.listen(PORT)
httpServer.on('listening', () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on('error', error => console.log(`Error en servidor ${error}`))