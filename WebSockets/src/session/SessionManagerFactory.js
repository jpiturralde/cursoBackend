import * as fs from 'fs'
import session from 'express-session'

const DEFAULT_SESSION_MANAGER_FACTORY_CONFIGURATION = { 
    type: 'InMemory',
    session: {
        secret: "default",
        resave: false,
        saveUninitialized: false
    }
}

export default class SessionManagerFactory {
    static #sessionConfig

    static async initialize(sessionConfigPath) {
        try {
            SessionManagerFactory.#sessionConfig = JSON.parse(fs.readFileSync(sessionConfigPath, 'utf8'))
        } catch (e) {
            console.log(`SessionManagerFactory - Not found ${sessionConfigPath} `)
            SessionManagerFactory.#sessionConfig = DEFAULT_SESSION_MANAGER_FACTORY_CONFIGURATION
            console.log(`SessionManagerFactory - Default configuration initialized`)
        }
        console.log('SessionManagerFactory', SessionManagerFactory.#sessionConfig)
    }

    static async createSessionManager() {
    // static async createSessionManager(config) {
        // config = SessionManagerFactory.#parseConfig(config)
        let sessionManager
        switch (SessionManagerFactory.#sessionConfig.type) {
            case 'FileStore':
                console.log('SessionManagerFactory - FileStore.')
//const FileStore = require('session-file-store')(session)
//onst store = new FileStore({ path: './sessions', ttl: 600, logFn: function(){}, retries:0 })
                
                // const FileSystemRepository = await import('./FileSystemRepository.js')
                // repo = new FileSystemRepository.default(config.connectionString)
                // sessionManager = session({
                //     secret: 'shhhhhhhhhhhhhhhhhhhhh',
                //     resave: false,
                //     saveUninitialized: false
                // })
                throw Error('FileStore no implementado!!! No sé cómo usarlo con import en lugar de require!!!');
            case 'MongoStore':
                console.log('SessionManagerFactory - Create MongoStore.')
                const MongoStore = await import('connect-mongo')
                const store = MongoStore.default.create({
                    //En Atlas connect App :  Make sure to change the node version to 2.2.12:
                    mongoUrl: SessionManagerFactory.#sessionConfig.store.uri,
                    mongoOptions: SessionManagerFactory.#sessionConfig.store.options || {}
                })
                const sessionConfig = SessionManagerFactory.#sessionConfig.session
                sessionConfig.store = store
                sessionManager = session(sessionConfig)
                break;
            default: //InMemory
                console.log('SessionManagerFactory - MemoryStore.')
                sessionManager = session({
                    secret: SessionManagerFactory.#sessionConfig.conf.secret,
                    resave: SessionManagerFactory.#sessionConfig.conf.resave || false,
                    saveUninitialized: SessionManagerFactory.#sessionConfig.conf.saveUninitialized || false
                })
            }
        return sessionManager
    }

    static #parseConfig(config) {
        switch (typeof config) {
            case 'undefined': //InMemory
                config = { type: 'InMemory' }
                break;
            case 'string':
                try {
                    config = JSON.parse(fs.readFileSync(config, 'utf8'))
                } catch (e) {
                    throw Error(`Not found ${config} `)
                }
                break;
            case 'object':
                break;
            default: 
                throw Error('Invalid config type.')
        }
        if (!('type' in config)) {
            throw Error('Missing "type" field in config.')
        }
        return config
    }


}
