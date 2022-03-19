import { Router } from "express"

export const webRouter = (rootPath, authenticationManager, logger, imageLoaderMdw) => {
    const { api } = process.context
    const router = new Router()

    //  ROOT
    router.get('/', getRoot)

    // LOGIN
    router.get('/login', getLogin(rootPath, authenticationManager.authenticationFn))
    router.post('/login', authenticationManager.signinMdw('/faillogin'), postLogin(logger))
    router.get('/faillogin', getFailLogin);

    // SIGNUP
    router.get('/signup', getSignup(rootPath, authenticationManager.authenticationFn))
    router.post('/signup', imageLoaderMdw.single('avatar'), authenticationManager.signupMdw('/failsignup'), postSignup(logger))
    router.get('/failsignup', getFailSignup);

    router.get('/home', getHome(rootPath, logger))
    router.get('/products', getProducts(rootPath))
    router.get('/shoppingCart', getShoppingCart(rootPath))
    router.get('/chat/:email', getMessages(api.messages))

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
        res.sendFile(rootPath+'/views/login.html')
    }
    else {
        res.redirect("/home")
    }
}

const postLogin = (logger) => (req, res) => {
    logger.info('/login', req.body.username)
    req.session.username = req.body.username
    req.session.visits = 0
    res.redirect("/products")
}

const getFailLogin = (req, res) => {
    const msg = 'User error signin'
    res.render('fail', { msg })    
}

    // SIGNUP
const getSignup = (rootPath, isAuthenticated) => (req, res) => {
    if (!isAuthenticated(req)) {
        res.sendFile(rootPath+'/views/signup.html')
    }
    else {
        res.redirect("/products")
    }
}

const postSignup = (logger) => (req, res) => {
    logger.info('/signup', req.body.username)
    req.session.username = req.body.username
    req.session.visits = 0
    res.redirect("/products")
}

const getFailSignup = (req, res) => {
    const msg = 'User error signup'
    res.render('fail', { msg })    
}

    // HOME
const getHome = (rootPath, logger) => (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 0
    }
    req.session.visits++
    logger.info('/home', req.session.username, req.session.visits)   
    res.sendFile(rootPath + '/views/home.html')
}

const getProducts = (rootPath) => (req, res) => {
    res.sendFile(rootPath + '/views/products.html')
}

const getShoppingCart = (rootPath) => (req, res) => {
    res.sendFile(rootPath + '/views/shoppingCart.html')
}

const getMessages = (api) => async (req, res) => {
    let messages = await api.getByEmail(req.params.email)
    if (!messages) {
        messages = []
    }
    res.json(messages)
}

// LOGOUT
const getLogout = (req, res) => {
    const userName = getUserName(req)
    req.session.destroy(err => {
        if (!err) {
            const msg = `Hasta luego ${userName}`
            res.render('logout', { msg })
        }
        else res.send({ error: 'logout', body: err })
    })
}

