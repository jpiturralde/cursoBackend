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

    static async initialize(configPath, repoFactory, usersDaoClass) {
        AuthenticationManagerFactory.#repoFactory = repoFactory
        AuthenticationManagerFactory.#usersDaoClass = usersDaoClass
        try {
            AuthenticationManagerFactory.#config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        } catch (e) {
            console.log(`AuthenticationManagerFactory - Not found ${configPath} `)
            AuthenticationManagerFactory.#config = DEFAULT_FACTORY_CONFIGURATION
            console.log(`AuthenticationManagerFactory - Default configuration initialized`)
        }
        console.log('AuthenticationManagerFactory', AuthenticationManagerFactory.#config)
    }

    static async create() {
        let instance
        switch (AuthenticationManagerFactory.#config.type) {
            case 'PassportLocal':
                console.log('AuthenticationManagerFactory - Create PassportLocal.')
                const repo = await AuthenticationManagerFactory.#repoFactory
                    .createRepository(AuthenticationManagerFactory.#config.repoConfig)
                const dao = await (new AuthenticationManagerFactory.#usersDaoClass(repo))
                const authConfig = {
                    usersDB: dao,
                    scopes: [{
                        path:'/home', 
                        methods: ['GET']
                    }], 
                    isSecured
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