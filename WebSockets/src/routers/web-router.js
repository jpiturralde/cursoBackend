import { Router } from "express"

export const webRouter = (rootPath, authenticationManager) => {
    const router = new Router()

    //  ROOT
    router.get('/', getRoot)

    // LOGIN
    router.get('/login', getLogin(rootPath, authenticationManager.authenticationFn))
    router.post('/login', authenticationManager.signinMdw('/faillogin'), postLogin(authenticationManager.authenticationFn))
    router.get('/faillogin', getFailLogin);

    // SIGNUP
    router.get('/signup', getSignup(rootPath, authenticationManager.authenticationFn))
    router.post('/signup', authenticationManager.signupMdw('/failsignup'), postSignup(authenticationManager.authenticationFn))
    router.get('/failsignup', getFailSignup);

    //  HOME
    router.get('/home', getHome(rootPath))

    //  LOGOUT
    router.get('/logout', getLogout)

    return router
} 

const getUserName = req => req.session.userName ? req.session.userName : ''

    // ROOT
const getRoot = (req, res) => {
    res.redirect("/home")
}

    // LOGIN
const getLogin = (rootPath, isAuthenticated) => (req, res) => {
    if (!isAuthenticated(req)) {
        console.log('web-router.getLogin /views/login.html')
        res.sendFile(rootPath+'/views/login.html')
    }
    else {
        console.log('web-router.getLogin /home')
        res.redirect("/home")
    }
}

const postLogin = isAuthenticated => (req, res) => {
    console.log('/login', req.body.username)
//    if (!isAuthenticated(req)) {
        req.session.username = req.body.username
        req.session.visits = 0
//    }
    res.redirect("/home")
}

const getFailLogin = (req, res) => {
    const msg = 'User error signin'
    res.render('fail', { msg })    
}

    // SIGNUP
const getSignup = (rootPath, isAuthenticated) => (req, res) => {
    if (!isAuthenticated(req)) {
        console.log('web-router.getLogin /views/signup.html')
        res.sendFile(rootPath+'/views/signup.html')
    }
    else {
        console.log('web-router.getSignup /home')
        res.redirect("/home")
    }
}

const postSignup = isAuthenticated => (req, res) => {
    console.log('/signup', req.body.username)
    // if (!isAuthenticated(req)) {
        req.session.username = req.body.username
        req.session.visits = 0
    // }
    res.redirect("/home")
}

const getFailSignup = (req, res) => {
    const msg = 'User error signup'
    res.render('fail', { msg })    
}

    // HOME
const getHome = rootPath => (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 0
    }
    req.session.visits++
    console.log('/home', req.session.username, req.session.visits, req.session.passport)    
    res.sendFile(rootPath + '/views/home.html')
}

    // LOGOUT
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

