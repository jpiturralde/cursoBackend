import { Server as IOServer } from 'socket.io'
import sharedsession from 'express-socket.io-session'

export const bindSocketIO = (httpServer, sessionMiddleware, messagesDB, productsDB) => {
    const io = new IOServer(httpServer)
    io.use(sharedsession(sessionMiddleware, { autoSave: true }))
    io.use(socketLogger)
    io.on('connection', async socket => {
        console.log('Un cliente se ha conectado', socket.handshake.session.userName)
    
        if (socket.handshake.session.userName) {
            console.log('onConnection')
            const userName = socket.handshake.session.userName
            const visits = socket.handshake.session.visits
            const messages = await messagesDB.get()
            const products = await productsDB.get()
            console.log('emit home')
            socket.emit('home', userName, messages, products, visits)
        }
        else {
            console.log('emit login')
            socket.emit('login')
        }
    
        socket.on('new-message', async data => {
            await messagesDB.post(data)
            const messages = await messagesDB.get()
            io.sockets.emit('messages', messages);
        })
    
        socket.on('new-product', async data => {
            await productsDB.post(data)
            const products = await productsDB.get()
            io.sockets.emit('products', products);
        })
    })
}

const socketLogger = (socket, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${socket.handshake.session.userName} socketEvent`)
    next();
}


