import { Router } from "express"

export const apiRouter = () => {
    const router = new Router()

    // LOGOUT
    // router.get('/api/logout', getLogout)

    // INFO
    router.get('/api/info', getInfo)

    return router
} 

export const getInfo = (req, res) => { res.json(info()) }

import * as os from 'os'
const numCores = os.cpus().length

export const info = () => { return {
    numCores,
    process: {
        argv: process.argv,
        cwd: process.cwd(), 
        rss: process.memoryUsage.rss(),
        platform: process.platform,
        execPath: process.execPath,
        pid: process.pid,
        version: process.version
    }} 
}

// const getUserName = req => req.session.userName ? req.session.userName : ''

// const getLogout = async (req, res) => {
//     const userName = getUserName(req)
//     console.log('logout')
//     req.session.destroy(err => {
//         if (!err) {
//             const result = { msg: `Hasta luego ${userName}`}
//             console.log(result)
//             res.json(result)
//         }
//         else res.send({ error: 'logout', body: err })
//     })
// }

