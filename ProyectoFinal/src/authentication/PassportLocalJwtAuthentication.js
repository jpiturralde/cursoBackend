import jwt from 'jsonwebtoken'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import passportJWT from 'passport-jwt'

const JWTStrategy = passportJWT.Strategy
const jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()

export default class PassportLocalJwtAuthentication {
    #config
    #passportInstance

    constructor(config) {
        const notificationFn = this.notifiy(process.context.emailManager, process.context.sysadm.email)    

        passport.use('signup', this.signupStrategy(config.usersDB, config.logger, notificationFn))
        passport.use('signin', this.signinStrategy(config.usersDB, config.logger))
        passport.use(new JWTStrategy({
                jwtFromRequest,
                secretOrKey   : config.jwt.secret
            },
            function (jwtPayload, cb) {
                if (jwtPayload && jwtPayload.id) {
                    return cb(null, jwtPayload)   
                }
                return cb('Invalid JWT')
            }
        ))
        passport.serializeUser(this.serializer())
        passport.deserializeUser(this.deserializer(config.usersDB, config.logger))

        this.#passportInstance = passport
        this.#config = config
    }

    createJWT(user) {
        const { expiresIn } = this.#config.jwt
        return jwt.sign(user, this.#config.jwt.secret, { expiresIn })
    }

    readJWT(token) {
        return jwt.verify(token, this.#config.jwt.secret)
    }

    signupStrategy(db, logger, notifyFn) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                const {name, address, phone, password2 } = req.body
                const avatar = req.file ? req.file.filename : 'avatar.png'
                this.signup(db, {username, password, password2, name, address, phone, avatar})
                    .then(user => {
                        notifyFn('Nuevo registro', user)
                        logger.info(`PassportLocalJwtAuthentication#signupStrategy: ${username} registered successfuly.`)
                        return done(null, user)
                    })
                    .catch(error => {
                        logger.info(`PassportLocalJwtAuthentication#signupStrategy: ${error.message}`)
                        return done(null, false, error)
                    })
            })
    }

    async signup(db, {username, password, password2, name, address, phone, avatar}) {
        let role = 'default'
        if (this.#config.adminsUsername && this.#config.adminsUsername.indexOf(username)>-1) {
            role = 'admin'
        }
        const user = await db.post( {username, password, password2, name, address, phone, avatar, role} )
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
                        logger.info(`PassportLocalJwtAuthentication#signinStrategy: ${error.message}`)
                        return done(null, false, error)
                    })
            })
    }

    async signin(db, credentials) {
        const { username, password } = credentials
        const user = await db.login(username, password)
        const shoppingCart = await process.context.api.shoppingCarts.getByUser(user.id)
        user.shoppingCartId = shoppingCart.id
        return user
    }

    serializer() { return (user, done) => { done(null, this.createJWT(user)) } }

    deserializer(db, logger) { 
        return (token, done) => {
            console.log('deserializer', token)
            done(null, this.readJWT(token))
        }
    }

    notifiy(emailManager, sysadmEmail)  {
        return async (event, user) => {
            if (this.#config.notifySignupEnabled) {
                const mailOptions = {
                    to: sysadmEmail,
                    subject: `${event} ${user.id}`,
                    html: this.userToHtml(user)
                }
                emailManager.sendMail(mailOptions)    
            }
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
            const isAuthorized = (user, scope) => {
                return !scope.roles 
                    || scope.roles.length > 0
                    && scope.roles.indexOf(user.role) > -1
            }
            const securedScope = this.#config.isSecured(this.#config.scopes, req)
            if (!securedScope) {
                next()
            }
            else {
                const authenticatedUser = this.authenticationFn(req)
                if (authenticatedUser && isAuthorized(authenticatedUser, securedScope)) {
                    next()
                }
                else {
                    if (req.path.startsWith('/api')) {
                        res.status(401).json()
                    }
                    else {
                        res.redirect(loginURI)
                    }
                }
            }
            // if (securedScope) {
            //     const authenticatedUser = this.authenticationFn(req)
            //     if (!authenticatedUser || !isAuthorized(authenticatedUser, securedScope)) {
            //         if (req.path.startsWith('/api')) {
            //             res.status(401).json()
            //         }
            //         else {
            //             res.redirect(loginURI)
            //         }
            //     } else {
            //         next()
            //     }
            // } else {
            //     next()
            // }
        }
    }

    authenticationFn(req) {
        try {
            const authenticatedUser = this.readJWT(jwtFromRequest(req))
            return authenticatedUser 
        } 
        catch(err) {
            process.context.logger.warn(`PassportLocalJwtAuthentication#authJwtMdw:`, err)
            return false
        }
    }

    signupMdw(failureRedirect) {
        return this.#passportInstance.authenticate('signup', { failureRedirect })
    }

    signinMdw(failureRedirect) {
        return this.#passportInstance.authenticate('signin', { failureRedirect })
    }

    authJwtMdw(passportStrategy) {
        return (req, res, next) => {
            this.#passportInstance.authenticate(passportStrategy, { session: false }, (err, user, info) => {
                if (err || !user) {
                    let message
                    let status
                    if (err) {
                        message = err.message
                        status = 500
                        this.#config.logger.error(`PassportLocalJwtAuthentication#authJwtMdw:`, err)
                    }
                    else {
                        status = 400
                        message = info ? info.message : `${passportStrategy} failed.`
                    }
                    return res.status(status).json({
                        message,
                        user   : user
                    });
                }
                else {
                    req.login(user, { session: false }, (err) => {
                        if (err) {
                            res.send(err);
                        }
                        req.session.username = user.username
                        req.session.role = user.role
                        const token = this.createJWT(user)
                        return res.json({user, token})
                    });
                }
            })
            (req, res)
        }
    }
    
    jwtMdw() {
        return this.#passportInstance.authenticate('jwt', {session: false})
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