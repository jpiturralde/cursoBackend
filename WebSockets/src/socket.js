import { Server as IOServer } from 'socket.io'
import sharedsession from 'express-socket.io-session'

export const bindSocketIO = (httpServer, sessionMiddleware, messagesDB, productsDB, logger) => {
    const io = new IOServer(httpServer)
    io.use(sharedsession(sessionMiddleware, { autoSave: true }))
    io.use(socketLogger(logger))
    io.on('connection', async socket => {
        logger.info(`${socket.handshake.session.username} onConnection`)
    
        if (socket.handshake.session.username) {
            const userName = socket.handshake.session.username
            const visits = socket.handshake.session.visits
            const messages = await messagesDB.get()
            const products = await productsDB.get()
            logger.info(`${socket.handshake.session.username} emit home`)
            socket.emit('home', userName, messages, products, visits)
        }
        else {
            logger.info(`emit login`)
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

const socketLogger = (logger) => (socket, next) => {
    logger.info(`${socket.handshake.session.username} socketEvent`)
    next();
}


