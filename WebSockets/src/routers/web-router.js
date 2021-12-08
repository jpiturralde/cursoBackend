import { Router } from "express"

export const webRouter = (rootPath, isAuthenticated) => {
    const router = new Router()

    //  ROOT
    router.get('/', getRoot)

    // LOGIN
    router.get('/login', getLogin(rootPath, isAuthenticated))
    router.post('/login', postLogin(isAuthenticated))

    //  HOME
    router.get('/home', getHome(rootPath))

    //  LOGOUT
    router.get('/logout', getLogout)

    return router
} 

const getUserName = req => req.session.userName ? req.session.userName : ''

const getRoot = (req, res) => {
    res.redirect("/home")
}

const getLogin = (rootPath, isAuthenticated) => (req, res) => {
    if (!isAuthenticated(req)) {
        res.sendFile(rootPath+'/views/login.html')
    }
    else {
        res.redirect("/home")
    }
}

const postLogin = isAuthenticated => (req, res) => {
    console.log('/login', req.body.userName)
    if (!isAuthenticated(req)) {
        req.session.userName = req.body.userName
        req.session.visits = 0
    }
    res.redirect("/home")
}

const getHome = rootPath => (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 0
    }
    req.session.visits++
    console.log('/home', req.session.userName, req.session.visits)    
    res.sendFile(rootPath + '/views/home.html')
}

const getLogout = (req, res) => {
    const userName = getUserName(req)
    req.session.destroy(err => {
        if (!err) {
            const msg = `Hasta luego ${userName}`
            console.log(msg)
            res.render('logout', { msg })
        }
        else res.send({ error: 'logout', body: err })
    })
}

