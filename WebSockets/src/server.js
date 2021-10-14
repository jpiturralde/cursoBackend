const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const productsDB = require('./products-inMemory-db.js')
const messagesDB = require('./messages-fs-db.js')

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
    socket.emit('products', productsDB.get())
    
    socket.on('new-message', async data => {
        data.ts = Date.now()
        await messagesDB.post(data)
        const messages  = await messagesDB.get() 
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product', data => {
        productsDB.post(data)
        const products = productsDB.get()
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