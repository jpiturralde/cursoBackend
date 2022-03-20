import { Server as IOServer } from 'socket.io'
import sharedsession from 'express-socket.io-session'

export const bindSocketIO = (httpServer, sessionMiddleware, api, logger) => {
    const io = new IOServer(httpServer)
    io.use(sharedsession(sessionMiddleware, { autoSave: true }))
    io.use(socketLogger(logger))
    io.on('connection', async socket => {
        logger.info(`${socket.handshake.session.username} onConnection`)

        if (socket.handshake.session.username) {
            const messages = await api.messages.get()
            logger.info(`${socket.handshake.session.username} emit messages`)
            io.sockets.emit('messages', messages);
        }
        else {
            logger.info(`emit login`)
            socket.emit('login')
        }
    
        socket.on('new-message', async data => {
            const { username, role } = socket.handshake.session
            data.email = username
            data.role = role
            await api.messages.post(data)
            const messages = await api.messages.get()
            io.sockets.emit('messages', messages);
        })
    })
}

const socketLogger = (logger) => (socket, next) => {
    logger.info(`${socket.handshake.session.username} socketEvent`)
    next();
}


