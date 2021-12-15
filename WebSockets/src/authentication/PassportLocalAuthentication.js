import passport from 'passport'
import LocalStrategy from 'passport-local'

export default class PassportLocalAuthentication {
    #config
    #passportInstance

    static #signupStrategy(db) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                db.getByUserName(username)
                .then(user => {
                    if (user) {
                        console.log(`PassportLocalAuthentication#sigupStrategy: ${username} already exists.`);
                        return done(null, false)
                    }
                    db.post( {username, password} )
                    .then(user => {
                        console.log(`PassportLocalAuthentication#sigupStrategy: ${username} registered successfuly.`)
                        return done(null, user)
                    })
                })
            })
    }

    static #signinStrategy(db) {
        return new LocalStrategy({
                passReqToCallback: true
            },
            (req, username, password, done) => {
                db.getByUserName(username).then(user => {
                    if (!user) {
                        console.log(`PassportLocalAuthentication#siginStrategy: Invalid cretentials.`);
                        return done(null, false)
                    }
                    if (!db.validateHash(password, user.password)) {
                        console.log(`PassportLocalAuthentication#siginStrategy: Invalid cretentials.`);
                        return done(null, false)
                    }
                    return done(null, user)
                })
            })
    }

    static #serializer() { return (user, done) => { done(null, user.id) } }

    static #deserializer(db) {
        return (id, done) => {
            db.getById(id)
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                console.error('PassportLocalAuthentication.#deserializer', err)
                done(err)
            })
        }
    }

    constructor(config) {
        passport.use('signup', PassportLocalAuthentication.#signupStrategy(config.usersDB))
        passport.use('signin', PassportLocalAuthentication.#signinStrategy(config.usersDB))
        passport.serializeUser(PassportLocalAuthentication.#serializer())
        passport.deserializeUser(PassportLocalAuthentication.#deserializer(config.usersDB))
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
    
}
