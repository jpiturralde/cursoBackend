const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
// const productsDB = require('./products-inMemory-db.js')
// const messagesDB = require('./messages-fs-db.js')
const DBWrapper = require('./DBWrapper.js')
const ProductsDBWrapper = require('./ProductsDBWrapper.js')
const RepositoryDB = require('./RepositoryDB.js')
const mariaDB = require('../options/mariaDB.js')
const sqlite3 = require('../options/SQLite3.js')
const messagesDB = new DBWrapper(new RepositoryDB('messages', mariaDB))
const productsDB = new ProductsDBWrapper(sqlite3)

const app = express()
const http = new HttpServer(app)
const io = new IOServer(http)

app.use(express.static('public'))

io.on('connection', async socket => {
    console.log('Un cliente se ha conectado')

    /* Envio los mensajes al cliente que se conectó */
    const messages  = await messagesDB.get() 
    socket.emit('messages', messages)

    /* Envio los productos al cliente que se conectó */
    socket.emit('products', await productsDB.get())
    
    socket.on('new-message', async data => {
        data.ts = Date.now()
        await messagesDB.post(data)
        const messages  = await messagesDB.get() 
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