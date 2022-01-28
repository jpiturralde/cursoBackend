import * as fs from 'fs'

const DEFAULT_REPOSITORY_FACTORY_CONFIGURATION = {
    ProductsRepository: { type: 'InMemory' },
    ShoppingCartsRepository: { type: 'InMemory' },
    MessagesRepository: { type: 'InMemory' }
}

export default class RepositoryFactory {
    static #logger
    static #repoConfig

    static async initialize(repoConfigPath, logger) {
        RepositoryFactory.#logger = logger
        try {
            RepositoryFactory.#repoConfig = JSON.parse(fs.readFileSync(repoConfigPath, 'utf8'))
        } catch (e) {
            logger.warn(`RepositoryFactory - Not found ${repoConfigPath} `)
            RepositoryFactory.#repoConfig = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION
            logger.warn(`RepositoryFactory - Default configuration initialized`)
        }
        if (!('ProductsRepository' in RepositoryFactory.#repoConfig)) {
            logger.warn(`RepositoryFactory - Field "ProductsRepository" not found.`)
            RepositoryFactory.#repoConfig.ProductsRepository = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION.ProductsRepository
            logger.warn(`RepositoryFactory - Default "ProductsRepository" initialized.`)
        }
        if (!('ShoppingCartsRepository' in RepositoryFactory.#repoConfig)) {
            logger.warn(`RepositoryFactory - Field "ShoppingCartsRepository" not found.`)
            RepositoryFactory.#repoConfig.ShoppingCartsRepository = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION.ShoppingCartsRepository
            logger.warn(`RepositoryFactory - Default "ShoppingCartsRepository" initialized.`)
        }
        if (!('MessagesRepository' in RepositoryFactory.#repoConfig)) {
            logger.warn(`RepositoryFactory - Field "MessagesRepository" not found.`)
            RepositoryFactory.#repoConfig.MessagesRepository = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION.ShoppingCartsRepository
            logger.warn(`RepositoryFactory - Default "MessagesRepository" initialized.`)
        }
        logger.info('RepositoryFactory', RepositoryFactory.#repoConfig)
    }

    static async createProductsRepository() {
        return await RepositoryFactory
            .createRepository(RepositoryFactory.#repoConfig.ProductsRepository, RepositoryFactory.#logger)
    }

    static async createShoppingCartsRepository() {
        return await RepositoryFactory
            .createRepository(RepositoryFactory.#repoConfig.ShoppingCartsRepository, RepositoryFactory.#logger)
    }

    static async createMessagesRepository() {
        return await RepositoryFactory
            .createRepository(RepositoryFactory.#repoConfig.MessagesRepository, RepositoryFactory.#logger)
    }

    static async createRepository(config) {
        const { logger } = process.context
        config = RepositoryFactory.#parseConfig(config)
        let repo
        switch (config.type) {
            case 'FS':
                logger.info('RepositoryFactory - Create FileSystemRepository.')
                const FileSystemRepository = await import('./FileSystemRepository.js')
                repo = new FileSystemRepository.default(config.connectionString)
                break;
            case 'MongoDb':
                logger.info('RepositoryFactory - Create MongoDbRepository.')
                const MongoDbRepository = await import('./MongoDbRepository.js')
                repo = new MongoDbRepository.default(config.uri, config.db, config.collection)
                repo.init()
                break;
            case 'Firebase':
                logger.info('RepositoryFactory - Create FirebaseRepository.')
                const FirebaseRepository = await import('./FirebaseRepository.js')
                repo = new FirebaseRepository.default(config.credential, config.collection)
                break;
            case 'SQLite3':
                RepositoryFactory.#logger.info('RepositoryFactory - Create SQLite3Repository.')
                const SQLite3Repository = await import('./SQLite3Repository.js')
                repo = new SQLite3Repository.default(config.entity, config.connectionString)
                break;
            default: //InMemory
                logger.info('RepositoryFactory - Create InMemoryRepository.')
                const InMemoryRepository = await import('./InMemoryRepository.js')
                repo = new InMemoryRepository.default()
            }
        return repo
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
