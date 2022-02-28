import jwt from 'jsonwebtoken'
import passport from 'passport'
import LocalStrategy from 'passport-local'

export default class PassportLocalJwtAuthentication {
    #config
    #passportInstance

    constructor(config) {
        const notificationFn = this.notifiy(process.context.emailManager, process.context.sysadm.email)    

        passport.use('signup', this.signupStrategy(config.usersDB, config.logger, notificationFn))
        passport.use('signin', this.signinStrategy(config.usersDB, config.logger))
        passport.serializeUser(this.serializer())
        passport.deserializeUser(this.deserializer(config.usersDB, config.logger))

        this.#passportInstance = passport
        this.#config = config
    }

    createJWT(user) {
        return jwt.sign(user, this.#config.jwt.secret)
    }

    readJWT(token) {
        return jwt.verify(token, this.#config.jwt.secret)
    }

    signupStrategy(db, logger, notifyFn) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                const {name, address, phone } = req.body
                const avatar = req.file.filename
                this.signup(db, {username, password, name, address, phone, avatar})
                    .then(user => {
                        notifyFn('Nuevo registro', user)
                        logger.info(`PassportLocalAuthentication#signupStrategy: ${username} registered successfuly.`)
                        return done(null, user)
                    })
                    .catch(error => {
                        logger.info(`PassportLocalAuthentication#signupStrategy: ${error.message}`)
                        return done(null, false)
                    })
            })
    }

    async signup(db, {username, password, name, address, phone, avatar}) {
        const user = await db.post( {username, password, name, address, phone, avatar} )
        const shoppingCart = await process.context.api.shoppingCarts.post(user.id, {})
        user.shoppingCartId = shoppingCart.id
        return user
    }

    signinStrategy(db, logger) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                this.signin(db, {username, password})
                    .then(user => {
                        return done(null, user, { message: 'Logged in Successfully' })
                    })
                    .catch(error => {
                        logger.info(`PassportLocalAuthentication#signinStrategy: ${error.message}`)
                        return done(null, false, { message: error.message })
                    })
            })
    }

    async signin(db, credentials) {
        const { username, password } = credentials
        const user = await db.login(username, password)
        const shoppingCart = await process.context.api.shoppingCarts.post(user.id, {})
        user.shoppingCartId = shoppingCart.id
        return user
    }

    serializer() { return (user, done) => { done(null, this.createJWT(user)) } }

    deserializer(db, logger) { 
        return (token, done) => {
            done(null, this.readJWT(token))
        }
    }

    notifiy(emailManager, sysadmEmail)  {
        return async (event, user) => {
            const mailOptions = {
                to: sysadmEmail,
                subject: `${event} ${user.id}`,
                html: this.userToHtml(user)
            }
            emailManager.sendMail(mailOptions)    
        }
    }

    userToHtml(user) {
        return `<p><strong>ID: <span style="font-size:20px">${user.id}</span></strong></p>
        
        <p><strong>Username: <span style="font-size:20px">${user.username}</span></strong></p>

        <p><strong>Name: <span style="font-size:20px">${user.name}</span></strong></p>
        
        <p><strong>Address: <span style="font-size:20px">${user.address}</span></strong></p>
        
        <p><strong>Phone: <span style="font-size:20px">${user.phone}</span></strong></p>
        
        <p><strong>Avatar: <span style="font-size:20px">${user.avatar}</span></strong></p>`

    } 

    initApp(expressApp) {
        expressApp.use(this.#passportInstance.initialize())
        expressApp.use(this.#passportInstance.session())
        expressApp.use(this.authenticationMdw())
    }

    authenticationMdw(loginURI = '/login') {
        return (req, res, next) => {
            if (this.#config.isSecured(this.#config.scopes, req) && !this.authenticationFn(req)) {
                res.redirect(loginURI)
            } else {
                next()
            }
        }
    }

    authenticationFn(req) {
        return req.isAuthenticated()
    }

    signupMdw(failureRedirect) {
        return this.#passportInstance.authenticate('signup', { failureRedirect })
    }

    signinMdw(failureRedirect) {
        return this.#passportInstance.authenticate('signin', { failureRedirect })
    }

    deserializeUser(id) {
        return new Promise((resolve, reject) => {
            this.#passportInstance.deserializeUser(id, (err, user) => {
                if (err) return reject(err)
                resolve(user)
            })
        })
    }
}