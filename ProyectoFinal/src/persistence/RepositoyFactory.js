import * as fs from 'fs'

const DEFAULT_REPOSITORY_FACTORY_CONFIGURATION = {
    ProductsRepository: { type: 'InMemory' },
    ShoppingCartsRepository: { type: 'InMemory' }
}

export default class RepositoryFactory {
    static #repoConfig

    static async initialize(repoConfigPath) {
        try {
            RepositoryFactory.#repoConfig = JSON.parse(fs.readFileSync(repoConfigPath, 'utf8'))
        } catch (e) {
            console.log(`RepositoryFactory - Not found ${repoConfigPath} `)
            RepositoryFactory.#repoConfig = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION
            console.log(`RepositoryFactory - Default configuration initialized`)
        }
        if (!('ProductsRepository' in RepositoryFactory.#repoConfig)) {
            console.log(`RepositoryFactory - Field "ProductsRepository" not found.`)
            RepositoryFactory.#repoConfig.ProductsRepository = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION.ProductsRepository
            console.log(`RepositoryFactory - Default "ProductsRepository" initialized.`)
        }
        if (!('ShoppingCartsRepository' in RepositoryFactory.#repoConfig)) {
            console.log(`RepositoryFactory - Field "ShoppingCartsRepository" not found.`)
            RepositoryFactory.#repoConfig.ShoppingCartsRepository = DEFAULT_REPOSITORY_FACTORY_CONFIGURATION.ShoppingCartsRepository
            console.log(`RepositoryFactory - Default "ShoppingCartsRepository" initialized.`)
        }
        console.log('RepositoryFactory', RepositoryFactory.#repoConfig)
    }

    static async createProductsRepository() {
        return await RepositoryFactory.createRepository(RepositoryFactory.#repoConfig.ProductsRepository)
    }

    static async createShoppingCartsRepository() {
        return await RepositoryFactory.createRepository(RepositoryFactory.#repoConfig.ShoppingCartsRepository)
    }

    static async createRepository(config) {
        config = RepositoryFactory.#parseConfig(config)
        let repo
        switch (config.type) {
            case 'FS':
                console.log('RepositoryFactory - Create FileSystemRepository.')
                const [FSContainer, FSRepository] =
                    await Promise.all([
                        import('./FileSystemContainer.js'),
                        import('./Repository.js')
                    ]);
                repo = new FSRepository.default(new FSContainer.default(config.connectionString))
                break;
            case 'MongoDb':
                const MongoDbRepository = await import('./MongoDbRepository.js')
                repo = new MongoDbRepository.default(config.uri, config.db, config.collection)
                repo.init()
                break;
            case 'Firebase':
                throw Error('RepositoryFactory - FALTA IMPLEMENTAR Firebase!!!!!!!')
            default: //InMemory
                console.log('RepositoryFactory - Create InMemoryRepository.')
                const [ Container, Repository ] =
                    await Promise.all([
                        import('./Container.js'),
                        import('./Repository.js')
                    ]);
                repo = new Repository.default(new Container.default())
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
