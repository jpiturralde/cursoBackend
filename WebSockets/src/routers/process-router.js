import { Router } from "express"
import { fork } from 'child_process'
import path from 'path'
import compression from 'compression'
import { GENERATE_RANDOMS, generateRandoms } from '../process/generateRandoms.js'

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

    // API/RANDOMSNOFORK
    router.get('/api/randomsnofork', getRandomsNoFork)

    return router
} 

const info = () => { return process.context.api.info.get() }

const getInfo = async (req, res) => { 
    res.render('process-info', await info())    
}

const loggerConsole = async (req, res, next) => {
    const date = new Date()
    console.log(`${date.toLocaleString()} ${process.ppid}-${process.pid}`, await info())
    next();
}

const DEFAULT_RANDOM_COUNT = 100000000

const getRandoms = (rootPath) => (req, res) => {
    const qty = req.query.cant || DEFAULT_RANDOM_COUNT
    const computo = fork(path.resolve(rootPath+'/src/process', 'forkProcess.js'), [qty])
    computo.on('message', msg => {
        if ( msg == 'readyToProcess') {
            computo.send(GENERATE_RANDOMS)
        }
        else {
            res.json({ msg })
        }
    })
}

const getRandomsNoFork = (req, res) => {
    const qty = req.query.cant || DEFAULT_RANDOM_COUNT
    res.json({ msg: generateRandoms(qty) })
}