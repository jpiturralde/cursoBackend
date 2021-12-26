import { Router } from "express"
import { fork } from 'child_process'
import path from 'path'

export const processRouter = (rootPath) => {
    const router = new Router()

    //  INFO
    router.get('/info', getInfo)

    // API/RANDOMS
    router.get('/api/randoms', getRandoms(rootPath))

    return router
} 

const getInfo = (req, res) => {
    res.render('process-info', { process })    
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