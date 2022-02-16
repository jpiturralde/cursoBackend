import * as fs from 'fs'

const DEFAULT_FACTORY_CONFIGURATION = { 
    type: 'PassportLocal',
    repoConfig: { type: 'InMemory' }
}

const isSecured = (scopes, req) => {
    const scope = securedScope(scopes, req.path)
    return  scope && securedMethod(scope, req.method)
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
    static #config
    static #repoFactory
    static #usersDaoClass
    static #usersAPI
    static #logger

    static async initialize(usersDaoClass, usersAPI) {
        const { logger, AUTHENTICATION_CONFIG_PATH, persistence } = process.context
        AuthenticationManagerFactory.#repoFactory = persistence.repositoryFactory
        AuthenticationManagerFactory.#usersDaoClass = usersDaoClass
        AuthenticationManagerFactory.#usersAPI = usersAPI
        AuthenticationManagerFactory.#logger = logger
        try {
            AuthenticationManagerFactory.#config = JSON.parse(fs.readFileSync(AUTHENTICATION_CONFIG_PATH, 'utf8'))
        } catch (e) {
            AuthenticationManagerFactory.#logger.warn(`AuthenticationManagerFactory - Not found ${AUTHENTICATION_CONFIG_PATH} `)
            AuthenticationManagerFactory.#config = DEFAULT_FACTORY_CONFIGURATION
            AuthenticationManagerFactory.#logger.warn(`AuthenticationManagerFactory - Default configuration initialized`)
        }
        AuthenticationManagerFactory.#logger.info('AuthenticationManagerFactory', AuthenticationManagerFactory.#config)
    }

    static async create() {
        let instance
        switch (AuthenticationManagerFactory.#config.type) {
            case 'PassportLocal':
                AuthenticationManagerFactory.#logger.info('AuthenticationManagerFactory - Create PassportLocal.')
                const repo = await AuthenticationManagerFactory.#repoFactory
                    .createRepository(AuthenticationManagerFactory.#config.repoConfig)
                const dao = await (new AuthenticationManagerFactory.#usersDaoClass(repo))
                const api = AuthenticationManagerFactory.#usersAPI(dao)
                const authConfig = {
                    usersDB: api,
                    scopes: [{
                        path:'/home', 
                        methods: ['GET']
                    }, {
                        path:'/products', 
                        methods: ['GET']
                    }, {
                        path:'/shoppingCart', 
                        methods: ['GET']
                    }], 
                    isSecured, 
                    logger: AuthenticationManagerFactory.#logger
                }
                const PassportLocalAuthentication = await import('./PassportLocalAuthentication.js')
                instance = new PassportLocalAuthentication.default(authConfig)
                break;
            default:
                throw Error('Only supported AuthenticationManagerFactory.type = PassportLocal')
        }
        return instance
    }

}