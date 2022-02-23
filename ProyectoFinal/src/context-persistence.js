//PERSISTENCE CONFIG
import { ProductsDao, MessagesDao, ShoppingCartsDao, ShoppingCartsByUserDao } from "./daos/index.js"
import { RepositoryFactory } from "./persistence/index.js"

//PERSISTENCE CONFIG
export async function loadPersistence() {
    const { logger, PERSISTENCE_CONFIG_PATH } = process.context

    RepositoryFactory.initialize(PERSISTENCE_CONFIG_PATH, logger)

    const persistence = {}
    persistence.repositoryFactory = RepositoryFactory
    try {
        persistence.productsDS = new ProductsDao(await RepositoryFactory.createProductsRepository())
    } catch (error) {
        logger.error(`Error al crear ProductsDao ${error}`) 
        throw Error(error)
    }

    try {
        persistence.messagesDS = new MessagesDao(await RepositoryFactory.createMessagesRepository())
    } catch (error) {
        logger.error(`Error al crear MessagesDao ${error}`) 
        throw Error(error)
    }

    try {
        persistence.shoppingCartsDS = new ShoppingCartsDao(await RepositoryFactory.createShoppingCartsRepository())
    } catch (error) {
        logger.error(`Error al crear ShoppingCartsDao ${error}`) 
        throw Error(error)
    }

    try {
        persistence.shoppingCartsByUserDS = new ShoppingCartsByUserDao(await RepositoryFactory.createShoppingCartsByUserRepository())
    } catch (error) {
        logger.error(`Error al crear ShoppingCartsByUserDao ${error}`) 
        throw Error(error)
    }

    return persistence
}

