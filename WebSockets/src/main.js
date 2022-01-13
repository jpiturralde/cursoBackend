import cluster from 'cluster'
import * as os from 'os'

import { context } from './context.js'
import { createServer  } from './server.js'

const logger = context.logger

async function startServer() {
    const http = await createServer()
    const PORT = context.PORT || 8080
    const httpServer = http.listen(PORT)
    httpServer.on('listening', () => {
        logger.info(`Servidor express escuchando en el puerto ${PORT} - PID ${process.pid}`)
    })
    httpServer.on('error', error => logger.error(`Error en servidor ${error}`))
}

async function startCluster() {
    const numCores = os.cpus().length
    if (cluster.isPrimary) {
        logger.info(`PID PRIMARY ${process.pid}`)
        logger.info(`Server context`, context)
        for (let i = 0; i < numCores; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
            logger.info(`Worker ${worker.process.pid} died`)
            cluster.fork()
        })
    }
    else {
        startServer()
    }    
}

if (context.isModeFork()) {
    logger.info(`PID ${process.pid}`)
    logger.info(`Server context`, context)
    startServer()
}
else {
    startCluster()
}