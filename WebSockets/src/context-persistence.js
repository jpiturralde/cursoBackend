//PERSISTENCE CONFIG
import { ProductsDao, MessagesDao } from "./daos/index.js"
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

    return persistence
}
