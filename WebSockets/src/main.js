import cluster from 'cluster'
import * as os from 'os'

import { context } from './context.js'
import { createServer  } from './server.js'

async function startServer() {
    const http = await createServer()
    const PORT = context.port || 8080
    const httpServer = http.listen(PORT)
    httpServer.on('listening', () => {
        console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} Servidor express escuchando en el puerto ${PORT} - PID ${process.pid}`)
    })
    httpServer.on('error', error => console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} Error en servidor ${error}`))
}

async function startCluster() {
    const numCores = os.cpus().length
    if (cluster.isPrimary) {
        console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} PID PRIMARY ${process.pid}`)
        console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} Server context`, context)
        for (let i = 0; i < numCores; i++) {
            cluster.fork()
        }
    
        cluster.on('exit', worker => {
            console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} Worker ${worker.process.pid} died`)
            cluster.fork()
        })
    }
    else {
        startServer()
    }    
}

if (context.isModeFork()) {
    console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} PID ${process.pid}`)
    console.log(`${(new Date()).toLocaleString()} ${process.ppid}-${process.pid} Server context`, context)
    startServer()
}
else {
    startCluster()
}