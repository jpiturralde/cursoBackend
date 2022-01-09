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

    // API/RANDOMS
    router.get('/api/randoms', getRandoms(rootPath))

    return router
} 

import * as os from 'os'
const numCores = os.cpus().length

const getInfo = (req, res) => {
    res.render('process-info', { process, numCores })    
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