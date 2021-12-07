import * as fs from 'fs'
import session from 'express-session'

const DEFAULT_SESSION_MANAGER_FACTORY_CONFIGURATION = { 
    type: 'InMemory',
    conf: {
        secret: "secret",
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
        switch (config.type) {
            case 'FS':
                console.log('SessionManagerFactory - FileStore.')
                
                const FileSystemRepository = await import('./FileSystemRepository.js')
                repo = new FileSystemRepository.default(config.connectionString)
                sessionManager = session({
                    secret: 'shhhhhhhhhhhhhhhhhhhhh',
                    resave: false,
                    saveUninitialized: false
                })
                break;
            case 'MongoDb':
                console.log('RepositoryFactory - Create MongoDbRepository.')
                const MongoDbRepository = await import('./MongoDbRepository.js')
                repo = new MongoDbRepository.default(config.uri, config.db, config.collection)
                repo.init()
                break;
            case 'Firebase':
                console.log('RepositoryFactory - Create FirebaseRepository.')
                const FirebaseRepository = await import('./FirebaseRepository.js')
                repo = new FirebaseRepository.default(config.credential, config.collection)
                break;
            case 'SQLite3':
                console.log('RepositoryFactory - Create SQLite3Repository.')
                const SQLite3Repository = await import('./SQLite3Repository.js')
                repo = new SQLite3Repository.default(config.entity, config.connectionString)
                break;
            default: //InMemory
                console.log('SessionManagerFactory - MemoryStore.')
                sessionManager = session({
                    secret: 'shhhhhhhhhhhhhhhhhhhhh',
                    resave: false,
                    saveUninitialized: false
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
