import * as fs from 'fs'

const DEFAULT_FACTORY_CONFIGURATION = { 
    type: 'PassportLocal',
    repoConfig: { type: 'InMemory' },
    jwt: { secret: 'secret' }
}

const isSecured = (scopes, req) => {
    const scope = securedScope(scopes, req.path)
    if (scope && securedMethod(scope, req.method)) {
      return scope
    }
    return false
}

const securedScope = (scopes, path) => {
    if (scopes.length > 0) {
        const scope = scopes.filter(s => path.startsWith(s.path)) 
        if (scope.length > 0) {
            return scope[0]
        }
    }
    return false
}

const securedMethod = (scope, method) => {
    const secMethod = scope.methods.filter(m => method == m)
    return secMethod.length > 0
}

export default class AuthenticationManagerFactory {
    static config
    static #repoFactory
    static #usersDaoClass
    static #usersAPI
    static #logger
    static #authenticationManagerInstance

    static async initialize(usersDaoClass, usersAPI) {
        const { logger, AUTHENTICATION_CONFIG_PATH, persistence } = process.context
        AuthenticationManagerFactory.#repoFactory = persistence.repositoryFactory
        AuthenticationManagerFactory.#usersDaoClass = usersDaoClass
        AuthenticationManagerFactory.#usersAPI = usersAPI
        AuthenticationManagerFactory.#logger = logger
        try {
            AuthenticationManagerFactory.config = JSON.parse(fs.readFileSync(AUTHENTICATION_CONFIG_PATH, 'utf8'))
        } catch (e) {
            AuthenticationManagerFactory.#logger.warn(`AuthenticationManagerFactory - Not found ${AUTHENTICATION_CONFIG_PATH} `)
            AuthenticationManagerFactory.config = DEFAULT_FACTORY_CONFIGURATION
            AuthenticationManagerFactory.#logger.warn(`AuthenticationManagerFactory - Default configuration initialized`)
        }
        AuthenticationManagerFactory.#logger.info('AuthenticationManagerFactory', AuthenticationManagerFactory.config)
    }

    static async create() {
        if (!AuthenticationManagerFactory.#authenticationManagerInstance) {
            switch (AuthenticationManagerFactory.config.type) {
                case 'PassportLocal':
                    AuthenticationManagerFactory.#logger.info('AuthenticationManagerFactory - Create PassportLocal.')
                    const repo = await AuthenticationManagerFactory.#repoFactory
                        .createRepository(AuthenticationManagerFactory.config.repoConfig)
                    const dao = await (new AuthenticationManagerFactory.#usersDaoClass(repo))
                    const api = AuthenticationManagerFactory.#usersAPI(dao)
                    const authConfig = {
                        ...AuthenticationManagerFactory.config,
                        usersDB: api,
                        scopes: [{
                            path:'/products', 
                            methods: ['GET']
                        }, {
                            path:'/shoppingCart', 
                            methods: ['GET']
                        }, {
                            path:'/api/user', 
                            methods: ['GET']
                        }, {
                            path:'/api/productos', 
                            methods: ['POST', 'DELETE'],
                            roles: ['admin']
                        }, {
                            path:'/api/carrito', 
                            methods: ['GET', 'POST', 'DELETE']
                        }], 
                        isSecured, 
                        logger: AuthenticationManagerFactory.#logger, 
                        notifySignupEnabled: typeof(AuthenticationManagerFactory.config.notifySignupEnabled) != "undefined" 
                            ? AuthenticationManagerFactory.config.notifySignupEnabled : true
                    }
                    const PassportLocalJwtAuthentication = await import('./PassportLocalJwtAuthentication.js')
                    AuthenticationManagerFactory.#authenticationManagerInstance = new PassportLocalJwtAuthentication.default(authConfig)
                    break;
                default:
                    throw Error('Only supported AuthenticationManagerFactory.type = PassportLocal')
            }
        }
        return AuthenticationManagerFactory.#authenticationManagerInstance
    }

}