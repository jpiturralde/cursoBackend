import { Router } from "express"
import { fork } from 'child_process'
import path from 'path'
import compression from 'compression'

export const processRouter = (rootPath) => {
    const router = new Router()

    //  INFO
    router.get('/info', getInfo)

    //  INFOZIP
    router.get('/infozip', compression(), getInfo)

    //  INFOZIP
    router.get('/infoconsole', loggerConsole, getInfo)

    // API/RANDOMS
    router.get('/api/randoms', getRandoms(rootPath))

    return router
} 

import * as os from 'os'
const numCores = os.cpus().length

const getInfo = (req, res) => {
    res.render('process-info', { process, numCores })    
}

const loggerConsole = (req, res, next) => {
    const date = new Date()
    const info = {
        argv: process.argv,
        cwd: process.cwd(), 
        rss: process.memoryUsage.rss(),
        platform: process.platform,
        execPath: process.execPath,
        pid: process.pid,
        version: process.version,
        cores: numCores
    }
    console.log(`${date.toLocaleString()} ${process.ppid}-${process.pid}`, info)
    next();
}

const DEFAULT_RANDOM_COUNT = 100000000

const getRandoms = (rootPath) => (req, res) => {
    const qty = req.query.cant || DEFAULT_RANDOM_COUNT
    const computo = fork(path.resolve(rootPath+'/src/process', 'generateRandoms.js'), [qty])
    computo.on('message', msg => {
        if ( msg == 'readyToProcess') {
            computo.send('startProcess')
        }
        else {
            res.json({ msg })
        }
    })
}