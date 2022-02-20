import passport from 'passport'
import LocalStrategy from 'passport-local'

export default class PassportLocalAuthentication {
    #config
    #passportInstance

    static #signupStrategy(db, logger, notifyFn) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                db.getByUserName(username)
                .then(user => {
                    if (user) {
                        logger.info(`PassportLocalAuthentication#signupStrategy: ${username} already exists.`);
                        return done(null, false)
                    }
                    const {name, address, phone } = req.body
                    const avatar = req.file.filename
                    db.post( {username, password, name, address, phone, avatar} )
                    .then(user => {
                        process.context.api.shoppingCarts.post(user.id, {})
                        .then(shoppingCart => {
                            notifyFn('Nuevo registro', user)
                            logger.info(`PassportLocalAuthentication#signupStrategy: ${username} registered successfuly.`)
                            return done(null, user)
                        })
                    })
                })
            })
    }

    static #signinStrategy(db, logger) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                db.getByUserName(username).then(user => {
                    if (!user) {
                        logger.info(`PassportLocalAuthentication#signinStrategy: Invalid cretentials.`);
                        return done(null, false)
                    }
                    if (!db.validateHash(password, user.password)) {
                        logger.info(`PassportLocalAuthentication#signinStrategy: Invalid cretentials.`);
                        return done(null, false)
                    }
                    return done(null, user)
                })
            })
    }

    static #serializer() { return (user, done) => { done(null, user.id) } }

    static #deserializer(db, logger) {
        return (id, done) => {
            db.getById(id)
            .then(user => {
                const { username, name, address, phone, avatar } = user
                process.context.api.shoppingCarts.getByUser(user.id)
                .then(shoppingCart => {
                    done(null, { username, name, address, phone, avatar, shoppingCartId: shoppingCart.id })
                })
            })
            .catch(err => {
                logger.error('PassportLocalAuthentication.#deserializer', err)
                done(err)
            })
        }
    }

    static #notifiy(emailManager, sysadmEmail)  {
        return async (event, user) => {
            const mailOptions = {
                to: sysadmEmail,
                subject: `${event} ${user.id}`,
                html: PassportLocalAuthentication.#userToHtml(user)
            }
            emailManager.sendMail(mailOptions)    
        }
    }

    static #userToHtml(user) {
        return `<p><strong>ID: <span style="font-size:20px">${user.id}</span></strong></p>
        
        <p><strong>Username: <span style="font-size:20px">${user.username}</span></strong></p>

        <p><strong>Name: <span style="font-size:20px">${user.name}</span></strong></p>
        
        <p><strong>Address: <span style="font-size:20px">${user.address}</span></strong></p>
        
        <p><strong>Phone: <span style="font-size:20px">${user.phone}</span></strong></p>
        
        <p><strong>Avatar: <span style="font-size:20px">${user.avatar}</span></strong></p>`

    } 

    constructor(config) {
        const notificationFn = PassportLocalAuthentication.#notifiy(process.context.emailManager, process.context.sysadm.email)    

        passport.use('signup', PassportLocalAuthentication.#signupStrategy(config.usersDB, config.logger, notificationFn))
        passport.use('signin', PassportLocalAuthentication.#signinStrategy(config.usersDB, config.logger))
        passport.serializeUser(PassportLocalAuthentication.#serializer())
        passport.deserializeUser(PassportLocalAuthentication.#deserializer(config.usersDB, config.logger))

        this.#passportInstance = passport
        this.#config = config
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
