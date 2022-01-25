// SESSION CONFIG
import { SessionManagerFactory } from "./session/index.js"

export async function loadSessionManager() {
    const { logger, SESSION_CONFIG_PATH } = process.context
    
    SessionManagerFactory.initialize(SESSION_CONFIG_PATH, logger)
    let sessionMiddleware
    try {
        sessionMiddleware = await SessionManagerFactory.createSessionManager()
    } catch (error) {
        logger.error(`Error al crear sessionMiddleware ${error}`) 
        throw Error(error)
    }
    return sessionMiddleware
}
