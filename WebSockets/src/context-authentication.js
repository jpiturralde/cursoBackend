// AUTHENTICATION CONFIG
import { AuthenticationManagerFactory } from './authentication/index.js'
import { UsersDao } from './daos/index.js'

export async function createAthenticationManager() {
    const { logger, AUTHENTICATION_CONFIG_PATH, persistence } = process.context
    await AuthenticationManagerFactory.initialize(AUTHENTICATION_CONFIG_PATH, persistence.repositoryFactory, UsersDao, logger)
    return await AuthenticationManagerFactory.create()
}