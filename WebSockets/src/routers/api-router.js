import { Router } from "express"

export const apiRouter = () => {
    const router = new Router()

    // LOGOUT
    router.get('/api/logout', getLogout)

    // INFO
    router.get('/api/info', getInfo)

    return router
} 

const getUserName = req => req.session.userName ? req.session.userName : ''

const getLogout = async (req, res) => {
    const userName = getUserName(req)
    console.log('logout')
    req.session.destroy(err => {
        if (!err) {
            const result = { msg: `Hasta luego ${userName}`}
            console.log(result)
            res.json(result)
        }
        else res.send({ error: 'logout', body: err })
    })
}

export const getInfo = (req, res) => {
    console.log('------------ req.session -------------')
    console.log(req.session)
    console.log('--------------------------------------')

    console.log('----------- req.sessionID ------------')
    console.log(req.sessionID)
    console.log('--------------------------------------')

    console.log('----------- req.cookies ------------')
    console.log(req.cookies)
    console.log('--------------------------------------')

    console.log('---------- req.sessionStore ----------')
    console.log(req.sessionStore)
    console.log('--------------------------------------')

    res.json({msg: 'Send info ok!' + req.sessionID })
}

/* --------------------- ROUTES --------------------------- */
// const getNombreSession = req => req.session.userName ? req.session.userName : ''
// app.get('/api/logout', (req, res) => {
//     const userName = getNombreSession(req)
//     console.log('logout')
//     req.session.destroy(err => {
//         if (!err) {
//             const result = { msg: `Hasta luego ${userName}`}
//             console.log(result)
//             res.json(result)
//         }
//         else res.send({ error: 'logout', body: err })
//     })
// })

// app.get('/api/info', (req, res) => {
//     console.log('------------ req.session -------------')
//     console.log(req.session)
//     console.log('--------------------------------------')

//     console.log('----------- req.sessionID ------------')
//     console.log(req.sessionID)
//     console.log('--------------------------------------')

//     console.log('----------- req.cookies ------------')
//     console.log(req.cookies)
//     console.log('--------------------------------------')

//     console.log('---------- req.sessionStore ----------')
//     console.log(req.sessionStore)
//     console.log('--------------------------------------')

//     res.json({msg: 'Send info ok!' + req.sessionID })
// })
